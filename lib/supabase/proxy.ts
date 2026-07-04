import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getProtectedRouteRedirect } from "@/lib/auth/access";
import { getSupabasePublicEnv, hasSupabaseEnv } from "@/lib/env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!hasSupabaseEnv) {
    return supabaseResponse;
  }

  const env = getSupabasePublicEnv();
  const supabase = createServerClient(
    env.url,
    env.publishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const redirectTarget = getProtectedRouteRedirect({
    pathname: request.nextUrl.pathname,
    hasUser: Boolean(user),
  });

  if (redirectTarget) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.search = redirectTarget.split("?")[1] ?? "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
