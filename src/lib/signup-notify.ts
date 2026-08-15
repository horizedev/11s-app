import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database.types";
import { claimReferral } from "@/lib/referrals";
import { notifySignup } from "@/lib/telegram";

/** Signups older than this never trigger a notification (backfill safety). */
const NEW_USER_WINDOW_MS = 48 * 60 * 60 * 1000;

/**
 * Sends the "new signup" Telegram alert exactly once per account. The
 * signup_notified_at column acts as an idempotency guard, so the various
 * signup flows (email+password, email confirmation, Google OAuth, repeat
 * sign-ins) can all call this without double-notifying.
 *
 * Returns "sent" when a notification went out, otherwise a short reason
 * string for logging/debugging.
 */
export async function maybeNotifySignup(
  admin: SupabaseClient<Database>,
  userId: string,
  location: string,
  referralCode?: string | null,
): Promise<"sent" | "user-not-found" | "not-new" | "already-notified" | "guard-error"> {
  const { data: userData, error: userError } =
    await admin.auth.admin.getUserById(userId);
  if (userError || !userData.user) {
    console.error("Signup notification: could not load user", userError);
    return "user-not-found";
  }

  const createdAtMs = new Date(userData.user.created_at).getTime();
  if (
    !Number.isFinite(createdAtMs) ||
    Date.now() - createdAtMs > NEW_USER_WINDOW_MS
  ) {
    return "not-new";
  }

  // Attribute a referral first (when a code is available) so the
  // notification can say who referred this user.
  if (referralCode) {
    try {
      await claimReferral(admin, userId, referralCode);
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
    return "guard-error";
  }
  if (!claimedRows || claimedRows.length === 0) {
    return "already-notified";
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

  const delivered = await notifySignup({
    email: userData.user.email ?? "unknown",
    location,
    referrerEmail,
  });
  if (!delivered) {
    console.error("Signup notification: Telegram delivery failed", { userId });
  }

  return "sent";
}
