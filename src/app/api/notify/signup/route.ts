import { claimReferral, REFERRAL_COOKIE } from "@/lib/referrals";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { notifySignup } from "@/lib/telegram";

export const runtime = "nodejs";

/** Signups older than this never trigger a notification (backfill safety). */
const NEW_USER_WINDOW_MS = 48 * 60 * 60 * 1000;

function readLocation(request: Request): string {
  const city = request.headers.get("x-vercel-ip-city");
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry");
  const parts = [city, country]
    .map((part) => (part ? decodeURIComponent(part) : ""))
    .filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Unknown";
}

/**
 * Sends the "new signup" Telegram alert exactly once per account. The
 * signup_notified_at column acts as an idempotency guard, so the various
 * signup flows (email+password, email confirmation, Google OAuth) can all
 * call this route without double-notifying.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return Response.json({ notified: false }, { status: 401 });
  }

  const userId = data.claims.sub;
  const admin = createAdminClient();

  const { data: userData, error: userError } =
    await admin.auth.admin.getUserById(userId);
  if (userError || !userData.user) {
    return Response.json({ notified: false }, { status: 500 });
  }

  const createdAtMs = new Date(userData.user.created_at).getTime();
  if (
    !Number.isFinite(createdAtMs) ||
    Date.now() - createdAtMs > NEW_USER_WINDOW_MS
  ) {
    return Response.json({ notified: false });
  }

  // Attribute a referral first (when the cookie survived) so the
  // notification can say who referred this user.
  const cookieHeader = request.headers.get("cookie") ?? "";
  const referralCode = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${REFERRAL_COOKIE}=`))
    ?.split("=")[1];
  if (referralCode) {
    try {
      await claimReferral(admin, userId, decodeURIComponent(referralCode));
    } catch (claimError) {
      console.error("Referral attribution failed", claimError);
    }
  }

  // Idempotency guard: only the request that flips signup_notified_at from
  // null sends the message.
  await admin
    .from("11s_preferences")
    .upsert(
      { user_id: userId },
      { onConflict: "user_id", ignoreDuplicates: true },
    );
  const { data: claimedRows, error: claimGuardError } = await admin
    .from("11s_preferences")
    .update({ signup_notified_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("signup_notified_at", null)
    .select("user_id");

  if (claimGuardError) {
    console.error("Signup notification guard failed", claimGuardError);
    return Response.json({ notified: false }, { status: 500 });
  }
  if (!claimedRows || claimedRows.length === 0) {
    return Response.json({ notified: false });
  }

  let referrerEmail: string | null = null;
  const { data: referral } = await admin
    .from("11s_referrals")
    .select("referrer_id")
    .eq("referred_user_id", userId)
    .maybeSingle();
  if (referral?.referrer_id) {
    const { data: referrerData } = await admin.auth.admin.getUserById(
      referral.referrer_id,
    );
    referrerEmail = referrerData.user?.email ?? null;
  }

  await notifySignup({
    email: userData.user.email ?? "unknown",
    location: readLocation(request),
    referrerEmail,
  });

  return Response.json({ notified: true });
}
