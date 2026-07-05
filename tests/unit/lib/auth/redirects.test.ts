import { describe, expect, it } from "vitest";

import {
  buildAuthCallbackUrl,
  getSafePostAuthPath,
} from "@/lib/auth/redirects";

describe("auth redirects", () => {
  it("builds callback URLs with an encoded next path", () => {
    expect(
      buildAuthCallbackUrl({
        nextPath: "/auth/update-password",
        origin: "https://11s-app.vercel.app",
      }),
    ).toBe(
      "https://11s-app.vercel.app/auth/confirm?next=%2Fauth%2Fupdate-password",
    );
  });

  it("allows safe in-app post-auth redirects", () => {
    expect(getSafePostAuthPath("/app/relationships/new", "/app")).toBe(
      "/app/relationships/new",
    );
  });

  it("rejects unsafe post-auth redirects", () => {
    expect(getSafePostAuthPath("https://evil.example/phish", "/app")).toBe(
      "/app",
    );
    expect(getSafePostAuthPath("//evil.example/phish", "/app")).toBe("/app");
  });
});
