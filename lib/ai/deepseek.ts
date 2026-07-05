import "server-only";

export type DeepSeekConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
};

type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

const DEFAULT_DEEPSEEK_BASE_URL = "https://api.deepseek.com";

export function getDeepSeekConfig(): DeepSeekConfig | null {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const model = process.env.DEEPSEEK_MODEL;

  if (!apiKey || !model) {
    return null;
  }

  return {
    apiKey,
    baseUrl: process.env.DEEPSEEK_BASE_URL ?? DEFAULT_DEEPSEEK_BASE_URL,
    model,
  };
}

export async function requestDeepSeekCompletion(params: {
  systemPrompt: string;
  userPrompt: string;
  timeoutMs?: number;
}) {
  const config = getDeepSeekConfig();

  if (!config) {
    throw new Error("DeepSeek configuration is missing.");
  }

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: params.systemPrompt },
        { role: "user", content: params.userPrompt },
      ],
      stream: false,
    }),
    signal: AbortSignal.timeout(params.timeoutMs ?? 30_000),
  });

  if (!response.ok) {
    throw new Error("DeepSeek request failed.");
  }

  const data = (await response.json()) as DeepSeekResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("DeepSeek response was empty.");
  }

  return content;
}
