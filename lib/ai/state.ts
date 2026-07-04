import type { AgendaIdea } from "@/lib/ai/generation";

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
