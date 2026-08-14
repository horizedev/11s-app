import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/lib/database.types";
import { getSupabaseConfig } from "@/lib/supabase/config";
import {
  isReferralCode,
  REFERRAL_COOKIE,
  REFERRAL_COOKIE_MAX_AGE,
} from "@/lib/referrals";

/**
 * When redirectTo is missing from the Supabase allow-list, Auth falls back to
 * the Site URL and appends ?code=… (e.g. https://www.11s.io/?code=…).
 * PKCE codes must be exchanged at /auth/callback, so forward them there.
 */
function redirectAuthCodeToCallback(request: NextRequest) {
  const url = request.nextUrl;
  if (url.pathname === "/auth/callback") return null;

  const code = url.searchParams.get("code");
  const oauthError = url.searchParams.get("error");
  if (!code && !oauthError) return null;

  const callbackUrl = request.nextUrl.clone();
  callbackUrl.pathname = "/auth/callback";
  if (!callbackUrl.searchParams.get("next")) {
    callbackUrl.searchParams.set("next", "/workspace");
  }
  return NextResponse.redirect(callbackUrl);
}

export async function updateSession(request: NextRequest) {
  const authRedirect = redirectAuthCodeToCallback(request);
  if (authRedirect) return authRedirect;

  let response = NextResponse.next({ request });
  const { url, publishableKey } = getSupabaseConfig();

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, cacheHeaders) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        Object.entries(cacheHeaders).forEach(([name, value]) => {
          response.headers.set(name, value);
        });
      },
    },
  });

  await supabase.auth.getClaims();

  // First referral link clicked wins; keep an existing cookie untouched.
  const referralCode = request.nextUrl.searchParams.get("ref");
  if (isReferralCode(referralCode) && !request.cookies.get(REFERRAL_COOKIE)) {
    response.cookies.set(REFERRAL_COOKIE, referralCode, {
      path: "/",
      maxAge: REFERRAL_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  }

  return response;
}
