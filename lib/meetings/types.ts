export const MEETING_STATUSES = ["draft", "completed", "archived"] as const;

export type MeetingStatus = (typeof MEETING_STATUSES)[number];
