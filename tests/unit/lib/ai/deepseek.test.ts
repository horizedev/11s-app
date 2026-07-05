import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { requestDeepSeekMarkdown } from "@/lib/ai/deepseek";

describe("DeepSeek client", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns a config error without calling the API when env vars are missing", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", "");
    vi.stubEnv("DEEPSEEK_BASE_URL", "");
    vi.stubEnv("DEEPSEEK_MODEL", "");
    global.fetch = vi.fn() as typeof fetch;

    await expect(
      requestDeepSeekMarkdown({ prompt: "Generate a prep brief." }),
    ).resolves.toMatchObject({
      ok: false,
      kind: "config_error",
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("sends the exact configured model string to chat completions", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", "test-key");
    vi.stubEnv("DEEPSEEK_BASE_URL", "https://api.deepseek.com");
    vi.stubEnv("DEEPSEEK_MODEL", "DeepSeek-V4-Pro");
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: "## Situation snapshot\n- Ready",
            },
          },
        ],
      }),
    }) as typeof fetch;

    await expect(
      requestDeepSeekMarkdown({ prompt: "Generate a prep brief." }),
    ).resolves.toMatchObject({
      ok: true,
      content: "## Situation snapshot\n- Ready",
      model: "DeepSeek-V4-Pro",
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.deepseek.com/chat/completions",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"model":"DeepSeek-V4-Pro"'),
      }),
    );
  });
});
