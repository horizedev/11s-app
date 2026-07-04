export const AGENDA_ITEM_CATEGORIES = [
  "update",
  "blocker",
  "decision",
  "feedback",
  "growth",
  "personal",
  "other",
] as const;

export type AgendaItemCategory = (typeof AGENDA_ITEM_CATEGORIES)[number];

export const AGENDA_ITEM_CATEGORY_LABELS: Record<AgendaItemCategory, string> = {
  update: "Update",
  blocker: "Blocker",
  decision: "Decision",
  feedback: "Feedback",
  growth: "Growth",
  personal: "Personal",
  other: "Other",
};
