import type { Relationship } from "@/lib/types";
import type { Dictionary, Locale } from "@/lib/i18n/types";

export const relationshipMeta: Record<
  Relationship,
  { group: "work" | "personal" }
> = {
  manager: { group: "work" },
  "direct-report": { group: "work" },
  peer: { group: "work" },
  mentor: { group: "work" },
  friend: { group: "personal" },
};

export function relationshipLabel(
  relationship: Relationship,
  t: Dictionary,
  compact = false,
): string {
  if (compact && relationship === "direct-report") {
    return t.relationship["direct-report-short"];
  }
  return t.relationship[relationship];
}

export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function intlLocale(locale: Locale): string {
  return locale === "zh-TW" ? "zh-TW" : "en";
}

export function formatMeetingDate(value: string, locale: Locale = "en"): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatHistoryDate(value: string, locale: Locale = "en"): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatTime(value: string, locale: Locale = "en"): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getLastMeetingTiming(
  value: string | undefined,
  t: Dictionary,
  locale: Locale = "en",
  now = new Date(),
): { label: string; tone: "recent" | "earlier" | "none" } {
  if (!value) {
    return { label: t.timing.noConversationYet, tone: "none" };
  }

  const meeting = startOfDay(new Date(value));
  const today = startOfDay(now);
  const days = Math.round(
    (today.getTime() - meeting.getTime()) / (24 * 60 * 60 * 1000),
  );

  if (days <= 0) {
    return { label: t.timing.today, tone: "recent" };
  }

  if (days === 1) {
    return { label: t.timing.yesterday, tone: "recent" };
  }

  if (days <= 14) {
    return { label: t.timing.daysAgo(days), tone: "recent" };
  }

  return {
    label: formatHistoryDate(value, locale),
    tone: "earlier",
  };
}

export function countNoteLines(notes: string): number {
  return notes
    .split("\n")
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean).length;
}

export function toDateTimeLocal(value: string): string {
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function sortByLastMeetingThenName(a: { lastMeetingAt: string; name: string }, b: { lastMeetingAt: string; name: string }) {
  const aTime = a.lastMeetingAt ? new Date(a.lastMeetingAt).getTime() : 0;
  const bTime = b.lastMeetingAt ? new Date(b.lastMeetingAt).getTime() : 0;
  if (aTime !== bTime) return bTime - aTime;
  return a.name.localeCompare(b.name);
}
