import { afterEach, describe, expect, it, vi } from "vitest";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
  vi.resetModules();
});

async function loadEnvModule() {
  return await import("@/lib/env");
}

describe("getSiteUrl", () => {
  it("prefers an explicitly configured site URL", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://app.11s.example";
    process.env.VERCEL_URL = "preview-11s.vercel.app";

    const { getSiteUrl } = await loadEnvModule();

    expect(getSiteUrl()).toBe("https://app.11s.example");
  });

  it("falls back to the Vercel production domain when no site URL is configured", async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "11s.example";
    process.env.VERCEL_URL = "preview-11s.vercel.app";

    const { getSiteUrl } = await loadEnvModule();

    expect(getSiteUrl()).toBe("https://11s.example");
  });
});
