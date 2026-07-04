import type { AgendaItemCategory } from "@/lib/agenda/types";
import type { ActionItemStatus } from "@/lib/action-items/types";

export type AgendaIdea = {
  title: string;
  description: string;
  category: AgendaItemCategory;
};

type AgendaRelationshipContext = {
  personName: string;
  relationshipTypeLabel: string;
  personContext: string | null;
  relationshipGoal: string | null;
};

type AgendaActionContext = {
  title: string;
  ownerLabel: string;
  dueDate: string | null;
};

export function buildAgendaIdeas(params: {
  relationship: AgendaRelationshipContext;
  openActionItems: AgendaActionContext[];
  priorMeetingHighlights: string[];
  optionalPrompt?: string | null;
}): AgendaIdea[] {
  const { relationship, openActionItems, optionalPrompt, priorMeetingHighlights } = params;
  const context = relationship.personContext?.trim();
  const goal = relationship.relationshipGoal?.trim();
  const prompt = optionalPrompt?.trim();
  const firstOpenAction = openActionItems[0];
  const firstHighlight = priorMeetingHighlights.find((highlight) => highlight.trim().length > 0);

  const ideas: AgendaIdea[] = [];

  if (firstOpenAction) {
    ideas.push({
      category: "update",
      title: `Follow up on: ${firstOpenAction.title}`,
      description: `Check progress, blockers, and whether ${firstOpenAction.ownerLabel.toLowerCase()} still owns the next step${firstOpenAction.dueDate ? ` due ${firstOpenAction.dueDate}` : ""}.`,
    });
  }

  if (prompt) {
    ideas.push({
      category: "other",
      title: `Explore: ${prompt}`,
      description: `Use the user's prompt as the main thread and turn it into a specific next step with ${relationship.personName}.`,
    });
  }

  if (goal) {
    ideas.push({
      category: "growth",
      title: `Make progress on ${goal}`,
      description: `Ask what would make this relationship goal more concrete before the next 1:1.`,
    });
  }

  if (firstHighlight) {
    ideas.push({
      category: "feedback",
      title: "Reconnect to the previous conversation",
      description: `Start from this prior context: ${firstHighlight}`,
    });
  }

  ideas.push(
    {
      category: "update",
      title: `What has changed since the last 1:1 with ${relationship.personName}?`,
      description: "Create room for updates, surprises, and context shifts before diving into decisions.",
    },
    {
      category: "blocker",
      title: "Where are they blocked or waiting on you?",
      description: `Ask for one practical blocker connected to the ${relationship.relationshipTypeLabel.toLowerCase()} relationship and agree on the next move.`,
    },
    {
      category: "decision",
      title: "What decision should come out of this conversation?",
      description: "Name the decision or tradeoff that would make the meeting feel useful by the end.",
    },
    {
      category: "personal",
      title: `How is the relationship with ${relationship.personName} feeling right now?`,
      description: context
        ? `Use the known context (${context}) to ask a human check-in that strengthens continuity.`
        : "Add a lightweight check-in so the meeting is not only task-focused.",
    },
  );

  return dedupeIdeas(ideas).slice(0, 8);
}

export function buildAgendaMarkdown(params: {
  relationshipName: string;
  meetingPurpose: string | null;
  agendaItems: Array<{ title: string; description: string | null; categoryLabel: string | null }>;
}) {
  const title = params.meetingPurpose?.trim() || `1:1 with ${params.relationshipName}`;
  const lines = [`# Agenda: ${title}`, ""];

  if (params.agendaItems.length === 0) {
    lines.push("No agenda items yet.");
    return lines.join("\n");
  }

  params.agendaItems.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.title}${item.categoryLabel ? ` (${item.categoryLabel})` : ""}`);
    if (item.description) {
      lines.push(`   - ${item.description}`);
    }
  });

  return lines.join("\n");
}

export function buildFollowUpSummary(params: {
  relationshipName: string;
  meetingPurpose: string | null;
  agendaItems: string[];
  shareableNotes: string | null;
  privateNotes?: string | null;
  decisions: string[];
  actionItems: Array<{
    title: string;
    ownerLabel: string;
    dueDate: string | null;
    status: ActionItemStatus;
  }>;
  tone: "concise" | "warm" | "professional";
}) {
  const title = params.meetingPurpose?.trim() || `1:1 with ${params.relationshipName}`;
  const lines = [`# Follow-up: ${title}`, ""];

  lines.push("## Recap");
  if (params.shareableNotes?.trim()) {
    lines.push(params.shareableNotes.trim());
  } else if (params.agendaItems.length > 0) {
    lines.push(`We covered: ${params.agendaItems.join(", ")}.`);
  } else {
    lines.push("Add more notes for a richer recap. This lightweight summary is based on the available meeting context.");
  }
  lines.push("");

  lines.push("## Decisions");
  if (params.decisions.length > 0) {
    params.decisions.forEach((decision) => lines.push(`- ${decision}`));
  } else {
    lines.push("- No decisions captured yet.");
  }
  lines.push("");

  lines.push("## Action items");
  const visibleActionItems = params.actionItems.filter((item) => item.status !== "cancelled");
  if (visibleActionItems.length > 0) {
    visibleActionItems.forEach((item) => {
      lines.push(`- ${item.title} — ${item.ownerLabel}${item.dueDate ? `, due ${item.dueDate}` : ""}${item.status === "completed" ? " (completed)" : ""}`);
    });
  } else {
    lines.push("- No action items captured yet.");
  }
  lines.push("");

  lines.push("## Suggested follow-up message");
  lines.push(buildFollowUpMessage(params.relationshipName, params.tone, visibleActionItems));

  return lines.join("\n");
}

function buildFollowUpMessage(
  relationshipName: string,
  tone: "concise" | "warm" | "professional",
  actionItems: Array<{ title: string; ownerLabel: string; dueDate: string | null }>,
) {
  const actionSentence =
    actionItems.length > 0
      ? `I'll keep track of the next steps: ${actionItems.map((item) => item.title).join("; ")}.`
      : "I'll keep track of any next steps we add.";

  if (tone === "concise") {
    return `Thanks for the conversation, ${relationshipName}. ${actionSentence}`;
  }

  if (tone === "warm") {
    return `Thanks again for making the time, ${relationshipName}. I appreciated the conversation. ${actionSentence}`;
  }

  return `Thanks for the productive 1:1, ${relationshipName}. ${actionSentence}`;
}

function dedupeIdeas(ideas: AgendaIdea[]) {
  const seen = new Set<string>();
  return ideas.filter((idea) => {
    const key = idea.title.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
