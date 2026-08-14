import { createDeepSeek } from "@ai-sdk/deepseek";

export const DEEPSEEK_MODEL = "deepseek-v4-flash";

export function getDeepSeek() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;

  return createDeepSeek({
    apiKey,
  });
}
