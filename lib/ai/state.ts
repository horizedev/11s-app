import type { AgendaIdea } from "@/lib/ai/generation";
import type { PrepBrief } from "@/lib/ai/prep-brief-repository";

export type AgendaIdeasState = {
  ideas: AgendaIdea[];
  formError: string | null;
};

export type FollowUpSummaryTone = "concise" | "warm" | "professional";

export type FollowUpSummaryState = {
  summary: string | null;
  formError: string | null;
  values: {
    tone: FollowUpSummaryTone;
  };
};

export type PrepBriefState = {
  brief: PrepBrief | null;
  formError: string | null;
  values: {
    includePrivateNotes: boolean;
  };
};

export function getEmptyAgendaIdeasState(): AgendaIdeasState {
  return {
    ideas: [],
    formError: null,
  };
}

export function getEmptyFollowUpSummaryState(): FollowUpSummaryState {
  return {
    summary: null,
    formError: null,
    values: {
      tone: "professional",
    },
  };
}

export function getEmptyPrepBriefState(brief: PrepBrief | null = null): PrepBriefState {
  return {
    brief,
    formError: null,
    values: {
      includePrivateNotes: false,
    },
  };
}
