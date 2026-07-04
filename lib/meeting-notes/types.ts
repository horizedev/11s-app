export const MEETING_NOTE_TYPES = ["shareable", "private", "decision"] as const;

export type MeetingNoteType = (typeof MEETING_NOTE_TYPES)[number];

export const MEETING_NOTE_TYPE_LABELS: Record<MeetingNoteType, string> = {
  shareable: "Shareable notes",
  private: "Private notes",
  decision: "Decision",
};
