import type { Cadence, Relationship } from "@/lib/types";
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

export function cadenceLabel(cadence: Cadence, t: Dictionary): string {
  return t.cadence[cadence];
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

export function getMeetingTiming(
  value: string,
  t: Dictionary,
  locale: Locale = "en",
  now = new Date(),
): { label: string; tone: "today" | "soon" | "later" | "overdue" } {
  const meeting = startOfDay(new Date(value));
  const today = startOfDay(now);
  const days = Math.round(
    (meeting.getTime() - today.getTime()) / (24 * 60 * 60 * 1000),
  );

  if (days < 0) {
    return {
      label: t.timing.overdue(Math.abs(days)),
      tone: "overdue",
    };
  }

  if (days === 0) {
    return { label: t.timing.today, tone: "today" };
  }

  if (days === 1) {
    return { label: t.timing.tomorrow, tone: "soon" };
  }

  if (days <= 7) {
    return { label: t.timing.inDays(days), tone: "soon" };
  }

  return {
    label: formatHistoryDate(value, locale).replace(
      locale === "zh-TW"
        ? `${meeting.getFullYear()}年`
        : `, ${meeting.getFullYear()}`,
      "",
    ),
    tone: "later",
  };
}

export function countNoteLines(notes: string): number {
  return notes
    .split("\n")
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean).length;
}

export function addCadence(value: string, cadence: Cadence): string {
  const next = new Date(value);

  switch (cadence) {
    case "Weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "Every 2 weeks":
      next.setDate(next.getDate() + 14);
      break;
    case "Monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "Quarterly":
      next.setMonth(next.getMonth() + 3);
      break;
    case "Flexible":
      next.setMonth(next.getMonth() + 1);
      break;
  }

  return next.toISOString();
}

export function toDateTimeLocal(value: string): string {
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}
