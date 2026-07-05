import "server-only";

import {
  getDeepSeekConfig,
  requestDeepSeekCompletion,
} from "@/lib/ai/deepseek";
import type { ActionItemStatus } from "@/lib/action-items/types";
import type { MeetingStatus } from "@/lib/meetings/types";

type PrepBriefRelationshipContext = {
  personName: string;
  relationshipTypeLabel: string;
  personContext: string | null;
  relationshipGoal: string | null;
  status: "active" | "archived";
};

type PrepBriefMeetingContext = {
  purpose: string | null;
  scheduledAt: string | null;
  status: MeetingStatus;
};

type PrepBriefAgendaItem = {
  title: string;
  description: string | null;
};

type PrepBriefDecision = {
  body: string;
};

type PrepBriefActionItem = {
  title: string;
  ownerLabel: string;
  dueDate: string | null;
  status: ActionItemStatus;
  meetingId?: string | null;
};

type PrepBriefNotesBundle = {
  shareableNotes: string | null;
  privateNotes: string | null;
  decisions: PrepBriefDecision[];
};

export type PrepBriefInputSnapshot = {
  relationship: PrepBriefRelationshipContext;
  meeting: PrepBriefMeetingContext;
  agendaItems: PrepBriefAgendaItem[];
  currentMeetingShareableNotes: string[];
  priorShareableNotes: string[];
  decisions: string[];
  priorDecisions: string[];
  openActionItems: PrepBriefActionItem[];
  includedPrivateNotes: boolean;
  privateNotes?: string[];
};

type GeneratePrepBriefParams = {
  relationship: PrepBriefRelationshipContext;
  meeting: PrepBriefMeetingContext;
  agendaItems: PrepBriefAgendaItem[];
  currentMeetingNotes: PrepBriefNotesBundle;
  priorShareableNotes: string[];
  priorDecisions: string[];
  openActionItems: PrepBriefActionItem[];
  includePrivateNotes: boolean;
};

type GeneratePrepBriefResult =
  | {
      status: "success";
      contentMarkdown: string;
      model: string;
      inputSnapshot: PrepBriefInputSnapshot;
    }
  | {
      status: "config_error" | "provider_error";
      message: string;
    };

export function buildPrepBriefInputSnapshot(
  params: GeneratePrepBriefParams,
): PrepBriefInputSnapshot {
  const snapshot: PrepBriefInputSnapshot = {
    relationship: params.relationship,
    meeting: params.meeting,
    agendaItems: params.agendaItems,
    currentMeetingShareableNotes: params.currentMeetingNotes.shareableNotes
      ? [params.currentMeetingNotes.shareableNotes]
      : [],
    priorShareableNotes: params.priorShareableNotes.filter(Boolean),
    decisions: params.currentMeetingNotes.decisions.map((decision) => decision.body),
    priorDecisions: params.priorDecisions.filter(Boolean),
    openActionItems: params.openActionItems,
    includedPrivateNotes: params.includePrivateNotes,
  };

  if (params.includePrivateNotes && params.currentMeetingNotes.privateNotes) {
    snapshot.privateNotes = [params.currentMeetingNotes.privateNotes];
  }

  return snapshot;
}

export function buildPrepBriefPrompts(snapshot: PrepBriefInputSnapshot) {
  return {
    systemPrompt: [
      "You are generating a concise meeting prep brief in markdown.",
      "Do not invent facts.",
      "If context is thin, say what is missing and give a lightweight prep plan.",
      "Do not quote private notes verbatim.",
      "Avoid medical, legal, therapeutic, or HR-compliance claims.",
      "Keep the advice actionable and grounded in the supplied relationship context.",
    ].join(" "),
    userPrompt: [
      "Create a markdown prep brief using this context:",
      JSON.stringify(snapshot, null, 2),
      "",
      "Return markdown with these exact sections:",
      "## Situation snapshot",
      "## Open loops",
      "## Suggested agenda",
      "## Smart questions",
      "## Tone and risk notes",
      "## Recommended next step",
    ].join("\n"),
  };
}

export async function generatePrepBrief(
  params: GeneratePrepBriefParams,
): Promise<GeneratePrepBriefResult> {
  const config = getDeepSeekConfig();

  if (!config) {
    return {
      status: "config_error",
      message: "AI Prep Brief is not configured yet. Please try again later.",
    };
  }

  const inputSnapshot = buildPrepBriefInputSnapshot(params);
  const prompts = buildPrepBriefPrompts(inputSnapshot);

  try {
    const contentMarkdown = await requestDeepSeekCompletion(prompts);

    return {
      status: "success",
      contentMarkdown,
      model: config.model,
      inputSnapshot,
    };
  } catch {
    return {
      status: "provider_error",
      message:
        "We couldn't generate the prep brief right now. Your meeting data is saved, so try again in a moment.",
    };
  }
}
