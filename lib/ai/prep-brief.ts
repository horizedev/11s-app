import type { AgendaItem } from "@/lib/agenda/repository";
import { requestDeepSeekMarkdown, type DeepSeekMarkdownResult } from "@/lib/ai/deepseek";
import type { ActionItem } from "@/lib/action-items/repository";
import type { Meeting } from "@/lib/meetings/repository";
import type { Relationship } from "@/lib/relationships/repository";

type PrepBriefAgendaItem = Pick<AgendaItem, "title" | "description" | "categoryLabel">;
type PrepBriefActionItem = Pick<
  ActionItem,
  "title" | "ownerLabel" | "dueDate" | "status" | "meetingId"
>;

export type PrepBriefInputSnapshot = {
  relationship: {
    id: string;
    personName: string;
    relationshipTypeLabel: string;
    personContext: string | null;
    relationshipGoal: string | null;
    status: string;
  };
  meeting: {
    id: string;
    purpose: string | null;
    scheduledAt: string | null;
    status: string;
  };
  agendaItems: Array<{
    title: string;
    description: string | null;
    categoryLabel: string | null;
  }>;
  priorShareableNotes: string[];
  priorDecisions: string[];
  openActionItems: Array<{
    title: string;
    ownerLabel: string;
    dueDate: string | null;
    status: string;
    meetingId: string;
  }>;
  privateNotes: string[];
  includedPrivateNotes: boolean;
};

export type GeneratePrepBriefResult =
  | ({
      ok: true;
      inputSnapshot: PrepBriefInputSnapshot;
    } & Extract<DeepSeekMarkdownResult, { ok: true }>)
  | Extract<DeepSeekMarkdownResult, { ok: false }>;

export function buildPrepBriefInputSnapshot(params: {
  relationship: Pick<
    Relationship,
    | "id"
    | "personName"
    | "relationshipTypeLabel"
    | "personContext"
    | "relationshipGoal"
    | "status"
  >;
  meeting: Pick<Meeting, "id" | "purpose" | "scheduledAt" | "status">;
  agendaItems: PrepBriefAgendaItem[];
  priorShareableNotes: string[];
  priorDecisions: string[];
  openActionItems: PrepBriefActionItem[];
  privateNotes: string[];
  includePrivateNotes: boolean;
}): PrepBriefInputSnapshot {
  return {
    relationship: {
      id: params.relationship.id,
      personName: params.relationship.personName,
      relationshipTypeLabel: params.relationship.relationshipTypeLabel,
      personContext: params.relationship.personContext,
      relationshipGoal: params.relationship.relationshipGoal,
      status: params.relationship.status,
    },
    meeting: {
      id: params.meeting.id,
      purpose: params.meeting.purpose,
      scheduledAt: params.meeting.scheduledAt,
      status: params.meeting.status,
    },
    agendaItems: params.agendaItems.map((item) => ({
      title: item.title,
      description: item.description,
      categoryLabel: item.categoryLabel,
    })),
    priorShareableNotes: params.priorShareableNotes.filter(Boolean),
    priorDecisions: params.priorDecisions.filter(Boolean),
    openActionItems: params.openActionItems.map((item) => ({
      title: item.title,
      ownerLabel: item.ownerLabel,
      dueDate: item.dueDate,
      status: item.status,
      meetingId: item.meetingId,
    })),
    privateNotes: params.includePrivateNotes ? params.privateNotes.filter(Boolean) : [],
    includedPrivateNotes: params.includePrivateNotes,
  };
}

export function buildPrepBriefPrompt(snapshot: PrepBriefInputSnapshot): string {
  const contextLines = [
    `Relationship: ${snapshot.relationship.personName} (${snapshot.relationship.relationshipTypeLabel})`,
    `Relationship goal: ${snapshot.relationship.relationshipGoal ?? "Not provided"}`,
    `Person context: ${snapshot.relationship.personContext ?? "Not provided"}`,
    `Meeting purpose: ${snapshot.meeting.purpose ?? "Not provided"}`,
    `Meeting scheduled at: ${snapshot.meeting.scheduledAt ?? "Not scheduled"}`,
    `Agenda items: ${formatList(snapshot.agendaItems.map((item) => item.title))}`,
    `Prior shareable notes: ${formatList(snapshot.priorShareableNotes)}`,
    `Prior decisions: ${formatList(snapshot.priorDecisions)}`,
    `Open action items: ${formatList(
      snapshot.openActionItems.map(
        (item) =>
          `${item.title} (${item.ownerLabel}${item.dueDate ? `, due ${item.dueDate}` : ""})`,
      ),
    )}`,
  ];

  if (snapshot.includedPrivateNotes) {
    contextLines.push(`Private notes: ${formatList(snapshot.privateNotes)}`);
  }

  return [
    "Generate a concise markdown prep brief for an upcoming 1:1.",
    "",
    "Required sections:",
    "## Situation snapshot",
    "## Open loops",
    "## Suggested agenda",
    "## Smart questions",
    "## Tone and risk notes",
    "## Recommended next step",
    "",
    "Constraints:",
    "- Do not invent facts.",
    "- If context is thin, say what is missing and provide a lightweight generic prep plan.",
    "- Treat private notes as user-only context and never suggest sharing them verbatim.",
    "- Avoid medical, legal, therapeutic, or HR-compliance claims.",
    "- Make advice actionable and specific to supplied context.",
    "- Avoid pretending certainty about emotions, intent, performance, or legal/HR obligations.",
    "",
    "Context:",
    ...contextLines,
  ].join("\n");
}

export async function generatePrepBrief(
  params: Parameters<typeof buildPrepBriefInputSnapshot>[0],
): Promise<GeneratePrepBriefResult> {
  const inputSnapshot = buildPrepBriefInputSnapshot(params);
  const prompt = buildPrepBriefPrompt(inputSnapshot);
  const result = await requestDeepSeekMarkdown({ prompt });

  if (!result.ok) {
    return result;
  }

  return {
    ...result,
    ok: true,
    inputSnapshot,
  };
}

function formatList(items: string[]) {
  if (items.length === 0) {
    return "None";
  }

  return items.join(" | ");
}
