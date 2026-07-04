import { describe, expect, it } from "vitest";

import { getProtectedRouteRedirect } from "@/lib/auth/access";

describe("getProtectedRouteRedirect", () => {
  it("redirects unauthenticated app requests to login with a next param", () => {
    expect(
      getProtectedRouteRedirect({
        pathname: "/app",
        hasUser: false,
      }),
    ).toBe("/auth/login?next=%2Fapp");
  });

  it("allows unauthenticated access to marketing routes", () => {
    expect(
      getProtectedRouteRedirect({
        pathname: "/",
        hasUser: false,
      }),
    ).toBeNull();
  });

  it("allows authenticated access to app routes", () => {
    expect(
      getProtectedRouteRedirect({
        pathname: "/app",
        hasUser: true,
      }),
    ).toBeNull();
  });
});
