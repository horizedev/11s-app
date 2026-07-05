import { afterEach, describe, expect, it, vi } from "vitest";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
  vi.resetModules();
  vi.unstubAllGlobals();
});

async function loadModule() {
  return await import("@/lib/ai/deepseek");
}

describe("DeepSeek client", () => {
  it("returns null when required config is missing", async () => {
    delete process.env.DEEPSEEK_API_KEY;
    delete process.env.DEEPSEEK_MODEL;
    delete process.env.DEEPSEEK_BASE_URL;

    const { getDeepSeekConfig } = await loadModule();

    expect(getDeepSeekConfig()).toBeNull();
  });

  it("preserves the exact configured model string in API requests", async () => {
    process.env.DEEPSEEK_API_KEY = "deepseek_test_key";
    process.env.DEEPSEEK_MODEL = "DeepSeek-V4-Pro";
    process.env.DEEPSEEK_BASE_URL = "https://api.deepseek.test";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: "## Situation snapshot\n- Ready",
            },
          },
        ],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { requestDeepSeekCompletion } = await loadModule();

    await expect(
      requestDeepSeekCompletion({
        systemPrompt: "system prompt",
        userPrompt: "user prompt",
      }),
    ).resolves.toBe("## Situation snapshot\n- Ready");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.deepseek.test/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer deepseek_test_key",
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          model: "DeepSeek-V4-Pro",
          messages: [
            { role: "system", content: "system prompt" },
            { role: "user", content: "user prompt" },
          ],
          stream: false,
        }),
        signal: expect.any(AbortSignal),
      }),
    );
  });
});
