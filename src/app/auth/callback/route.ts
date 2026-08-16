import { type NextRequest, NextResponse } from "next/server";

import { claimReferral, REFERRAL_COOKIE } from "@/lib/referrals";
import {
  readSignupLocation,
  readSignupReferralCode,
} from "@/lib/signup-notify-request";
import { maybeNotifySignup } from "@/lib/signup-notify";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function privateRedirect(url: URL) {
  const response = NextResponse.redirect(url);
  response.headers.set(
    "Cache-Control",
    "private, no-cache, no-store, must-revalidate, max-age=0",
  );
  response.headers.set("Expires", "0");
  response.headers.set("Pragma", "no-cache");
  return response;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const requestedNext = requestUrl.searchParams.get("next");
  const nextPath =
    requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/workspace";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const response = privateRedirect(new URL(nextPath, request.url));

      const referralCode = request.cookies.get(REFERRAL_COOKIE)?.value;
      const { data } = await supabase.auth.getClaims();
      if (data?.claims?.sub) {
        const admin = createAdminClient();
        if (referralCode) {
          try {
            await claimReferral(admin, data.claims.sub, referralCode);
          } catch (claimError) {
            console.error("Referral attribution failed", claimError);
          }
        }
        // New accounts (email confirmation / Google OAuth) notify ops here,
        // server-side, so it does not depend on a browser call afterwards.
        // The DB guard makes repeat sign-ins and parallel flows no-op.
        try {
          const result = await maybeNotifySignup(
            admin,
            data.claims.sub,
            readSignupLocation(request),
            referralCode ?? readSignupReferralCode(request),
          );
          if (result !== "sent" && result !== "already-notified" && result !== "not-new") {
            console.warn("Signup notification skipped:", result);
          }
        } catch (notifyError) {
          console.error("Signup notification failed", notifyError);
        }
      }
      response.cookies.delete(REFERRAL_COOKIE);

      return response;
    }

    const loginUrl = new URL("/login", request.url);
    const errorCode = error.message
      .toLowerCase()
      .includes("code verifier")
      ? "confirmation-browser-mismatch"
      : error.message;
    loginUrl.searchParams.set("error", errorCode);
    return privateRedirect(loginUrl);
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "error",
    requestUrl.searchParams.get("error_description") ??
      "The confirmation link is invalid or expired.",
  );
  return privateRedirect(loginUrl);
}
