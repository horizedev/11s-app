export type Relationship =
  | "manager"
  | "direct-report"
  | "peer"
  | "mentor"
  | "friend";

export type DiscussionMood = "energized" | "positive" | "neutral" | "tough";

export type PrepCategory =
  | "Follow up"
  | "Growth"
  | "Support"
  | "Alignment"
  | "Personal"
  | "Small talk";

export type PrepIdeaKind = "lead" | "support" | "stall";

export type TalkingPointSource = "manual" | "ai";

export interface TalkingPoint {
  id: string;
  body: string;
  source: TalkingPointSource;
}

export type MeetingIntent =
  | "career"
  | "catch-up"
  | "hard-talk"
  | "repair"
  | "just-warm";

export type PrepRefineMode = "warmer" | "shorter" | "more-career";

export type CareerNeedStatus = "open" | "routed" | "done";

export interface Discussion {
  id: string;
  date: string;
  title: string;
  summary: string;
  topics: string[];
  followUps: string[];
  mood: DiscussionMood;
}

export interface PrepIdea {
  id: string;
  category: PrepCategory;
  title: string;
  rationale: string;
  prompt: string;
  kind: PrepIdeaKind;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  organization: string;
  relationship: Relationship;
  lastMeetingAt: string;
  notes: string;
  /** Notes archived after the last meeting was marked done. */
  lastNotes: string;
  /** Free-typed professional background / pasted LinkedIn profile text. */
  background: string;
  /** Optional LinkedIn profile URL. */
  linkedinUrl: string;
  /** Emoji used as the contact avatar. */
  avatarEmoji: string | null;
  color: string;
  discussions: Discussion[];
  prepIdeas: PrepIdea[];
  /** Curated final talking points: promoted AI ideas and manual entries. */
  talkingPoints: TalkingPoint[];
}

export type PrepQuota = {
  used: number;
  limit: number | null;
};

export interface PrepResponse {
  opening: string;
  ideas: PrepIdea[];
  source: "ai" | "starter";
}

export interface GeneralPrep {
  opening: string;
  ideas: PrepIdea[];
  source: PrepResponse["source"] | null;
}

export interface CareerNeed {
  id: string;
  body: string;
  status: CareerNeedStatus;
  createdAt: string;
}

export interface CareerProfile {
  direction: string;
  targetRole: string;
  timeline: string;
  bragDoc: string;
  needs: CareerNeed[];
}

export interface WhoToAskSuggestion {
  personId: string;
  personName: string;
  relationship: Relationship;
  why: string;
  suggestedAsk: string;
}

export interface WhoToAskResponse {
  suggestions: WhoToAskSuggestion[];
  source: "ai" | "starter";
}

export type PeopleFilter = "all" | "work" | "personal";

export const MEETING_INTENTS: MeetingIntent[] = [
  "career",
  "catch-up",
  "hard-talk",
  "repair",
  "just-warm",
];

export const CONTEXT_BANK_SLOTS = [
  "Job",
  "Energy",
  "Learning",
  "Career",
  "Wins",
  "People",
  "Personal",
  "Plans",
] as const;

export type ContextBankSlot = (typeof CONTEXT_BANK_SLOTS)[number];
