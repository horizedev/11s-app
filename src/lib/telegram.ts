import "server-only";

/**
 * Minimal Telegram Bot API notifier for operator alerts (new signups,
 * subscription events). All functions are fire-and-forget: they never throw
 * and never block the user-facing flow on Telegram availability.
 */

type TelegramConfig = {
  botToken: string;
  chatId: string;
};

function getConfig(): TelegramConfig | null {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return null;
  return { botToken, chatId };
}

export async function sendTelegramMessage(text: string): Promise<boolean> {
  const config = getConfig();
  if (!config) {
    console.warn(
      "Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set.",
    );
    return false;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${config.botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: config.chatId,
          text,
          disable_web_page_preview: true,
        }),
      },
    );
    if (!response.ok) {
      console.error("Telegram notification failed", response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Telegram notification failed", error);
    return false;
  }
}

export function notifySignup(details: {
  email: string;
  location: string;
  referrerEmail: string | null;
}) {
  const lines = [
    "🆕 New 11s signup",
    `Email: ${details.email}`,
    `Location: ${details.location}`,
    details.referrerEmail
      ? `Referral: yes (by ${details.referrerEmail})`
      : "Referral: no",
  ];
  return sendTelegramMessage(lines.join("\n"));
}

export function notifySubscription(details: {
  event: string;
  email: string | null;
  plan: string;
  status: string;
  interval: string | null;
  amount: string | null;
  currentPeriodEnd: string | null;
}) {
  const lines = [
    `💳 11s subscription event: ${details.event}`,
    `Email: ${details.email ?? "unknown"}`,
    `Plan: ${details.plan}`,
    `Status: ${details.status}`,
  ];
  if (details.interval) lines.push(`Interval: ${details.interval}`);
  if (details.amount) lines.push(`Amount: ${details.amount}`);
  if (details.currentPeriodEnd) {
    lines.push(`Period ends: ${details.currentPeriodEnd}`);
  }
  return sendTelegramMessage(lines.join("\n"));
}
