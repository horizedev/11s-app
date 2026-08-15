import {
  readSignupLocation,
  readSignupReferralCode,
} from "@/lib/signup-notify-request";
import { maybeNotifySignup } from "@/lib/signup-notify";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Fallback trigger for signup flows that never pass through /auth/callback
 * (email+password sign-up with confirmation disabled). The auth callback
 * also calls maybeNotifySignup directly; the DB guard makes this idempotent.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return Response.json({ notified: false }, { status: 401 });
  }

  const result = await maybeNotifySignup(
    createAdminClient(),
    data.claims.sub,
    readSignupLocation(request),
    readSignupReferralCode(request),
  );

  return Response.json({ notified: result === "sent", reason: result });
}
