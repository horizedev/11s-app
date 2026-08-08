export type Relationship =
  | "manager"
  | "direct-report"
  | "peer"
  | "mentor"
  | "friend";

export type Cadence =
  | "Weekly"
  | "Every 2 weeks"
  | "Monthly"
  | "Quarterly"
  | "Flexible";

export type DiscussionMood = "energized" | "positive" | "neutral" | "tough";

export type PrepCategory =
  | "Follow up"
  | "Growth"
  | "Support"
  | "Alignment"
  | "Personal";

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
}

export interface Person {
  id: string;
  name: string;
  role: string;
  organization: string;
  relationship: Relationship;
  cadence: Cadence;
  nextMeetingAt: string;
  lastMeetingAt: string;
  notes: string;
  color: string;
  discussions: Discussion[];
  prepIdeas: PrepIdea[];
}

export interface PrepResponse {
  opening: string;
  ideas: PrepIdea[];
  source: "ai" | "starter";
}

export type PeopleFilter = "all" | "work" | "personal";
