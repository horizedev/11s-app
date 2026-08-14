import { claimReferral, REFERRAL_COOKIE } from "@/lib/referrals";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Fallback attribution for sign-up flows that never pass through
 * /auth/callback (e.g. email sign-up with confirmation disabled). The
 * workspace fires this once when the referral cookie is present.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return Response.json({ claimed: false }, { status: 401 });
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const referralCode = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${REFERRAL_COOKIE}=`))
    ?.split("=")[1];

  if (referralCode) {
    try {
      await claimReferral(
        createAdminClient(),
        data.claims.sub,
        decodeURIComponent(referralCode),
      );
    } catch (claimError) {
      console.error("Referral attribution failed", claimError);
    }
  }

  return Response.json(
    { claimed: Boolean(referralCode) },
    {
      headers: {
        "Set-Cookie": `${REFERRAL_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`,
      },
    },
  );
}
