import "server-only";

const CONFIG_ERROR_MESSAGE =
  "AI Prep Brief is not configured yet. Please try again later.";
const PROVIDER_ERROR_MESSAGE =
  "We couldn't generate the prep brief right now. Your meeting data is saved, so try again in a moment.";

type DeepSeekConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
};

export type DeepSeekMarkdownResult =
  | {
      ok: true;
      content: string;
      model: string;
    }
  | {
      ok: false;
      kind: "config_error" | "provider_error";
      message: string;
    };

export async function requestDeepSeekMarkdown(params: {
  prompt: string;
}): Promise<DeepSeekMarkdownResult> {
  const config = getDeepSeekConfig();

  if (!config) {
    return {
      ok: false,
      kind: "config_error",
      message: CONFIG_ERROR_MESSAGE,
    };
  }

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "system",
            content:
              "You generate concise markdown prep briefs for 1:1 meeting preparation.",
          },
          {
            role: "user",
            content: params.prompt,
          },
        ],
        temperature: 0.3,
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      return {
        ok: false,
        kind: "provider_error",
        message: PROVIDER_ERROR_MESSAGE,
      };
    }

    const data = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string | null;
        };
      }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return {
        ok: false,
        kind: "provider_error",
        message: PROVIDER_ERROR_MESSAGE,
      };
    }

    return {
      ok: true,
      content,
      model: config.model,
    };
  } catch {
    return {
      ok: false,
      kind: "provider_error",
      message: PROVIDER_ERROR_MESSAGE,
    };
  }
}

function getDeepSeekConfig(): DeepSeekConfig | null {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseUrl = process.env.DEEPSEEK_BASE_URL;
  const model = process.env.DEEPSEEK_MODEL;

  if (!apiKey || !baseUrl || !model) {
    return null;
  }

  return {
    apiKey,
    baseUrl,
    model,
  };
}
