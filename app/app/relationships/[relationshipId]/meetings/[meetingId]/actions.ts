"use server";

import { redirect } from "next/navigation";

import { createAgendaItem, listAgendaItemsForMeeting } from "@/lib/agenda/repository";
import {
  getEmptyAgendaItemFormState,
  toAgendaItemFormValues,
  type AgendaItemFormState,
  validateAgendaItemInput,
} from "@/lib/agenda/validation";
import { buildAgendaIdeas, buildFollowUpSummary } from "@/lib/ai/generation";
import {
  getEmptyAgendaIdeasState,
  getEmptyFollowUpSummaryState,
  type AgendaIdeasState,
  type FollowUpSummaryState,
  type FollowUpSummaryTone,
} from "@/lib/ai/state";
import { trackProductEvent } from "@/lib/analytics/repository";
import { createActionItem, listActionItemsForMeeting, listOpenActionItemsByRelationship } from "@/lib/action-items/repository";
import {
  getEmptyActionItemFormState,
  toActionItemFormValues,
  type ActionItemFormState,
  validateActionItemInput,
} from "@/lib/action-items/validation";
import {
  createDecision,
  getMeetingNotesBundle,
  saveMeetingNotes,
} from "@/lib/meeting-notes/repository";
import {
  getEmptyDecisionFormState,
  getEmptyMeetingNotesFormState,
  toDecisionFormValues,
  toMeetingNotesFormValues,
  type DecisionFormState,
  type MeetingNotesFormState,
  validateDecisionInput,
  validateMeetingNotesInput,
} from "@/lib/meeting-notes/validation";
import { getMeetingById, completeMeeting } from "@/lib/meetings/repository";
import { getRelationshipById } from "@/lib/relationships/repository";
import { createClient } from "@/lib/supabase/server";

export async function createAgendaItemAction(
  relationshipId: string,
  meetingId: string,
  _previousState: AgendaItemFormState,
  formData: FormData,
): Promise<AgendaItemFormState> {
  const validation = validateAgendaItemInput({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
  });

  if (!validation.success) {
    return validation.state;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth/login?next=%2Fapp%2Frelationships%2F${relationshipId}%2Fmeetings%2F${meetingId}`,
    );
  }

  const meeting = await getMeetingById({
    meetingId,
    relationshipId,
    supabase,
    userId: user.id,
  });

  if (!meeting) {
    redirect(`/app/relationships/${relationshipId}`);
  }

  try {
    await createAgendaItem({
      input: validation.data,
      meetingId,
      relationshipId,
      supabase,
      userId: user.id,
    });

    await trackProductEvent({
      supabase,
      userId: user.id,
      eventName: "ai_suggestion_added_to_agenda",
      entityType: "meeting",
      entityId: meetingId,
      metadata: { source: formData.get("source") === "ai" ? "ai" : "manual" },
    });
  } catch {
    return {
      ...getEmptyAgendaItemFormState(),
      formError:
        "We couldn't save that agenda item right now. Try again in a moment.",
      values: toAgendaItemFormValues(validation.data),
    };
  }

  redirect(`/app/relationships/${relationshipId}/meetings/${meetingId}`);
}

export async function createActionItemAction(
  relationshipId: string,
  meetingId: string,
  _previousState: ActionItemFormState,
  formData: FormData,
): Promise<ActionItemFormState> {
  const validation = validateActionItemInput({
    title: formData.get("title"),
    owner: formData.get("owner"),
    dueDate: formData.get("dueDate"),
    notes: formData.get("notes"),
  });

  if (!validation.success) {
    return validation.state;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth/login?next=%2Fapp%2Frelationships%2F${relationshipId}%2Fmeetings%2F${meetingId}`,
    );
  }

  const meeting = await getMeetingById({
    meetingId,
    relationshipId,
    supabase,
    userId: user.id,
  });

  if (!meeting) {
    redirect(`/app/relationships/${relationshipId}`);
  }

  try {
    await createActionItem({
      input: validation.data,
      meetingId,
      relationshipId,
      supabase,
      userId: user.id,
    });

    await trackProductEvent({
      supabase,
      userId: user.id,
      eventName: "action_item_created",
      entityType: "meeting",
      entityId: meetingId,
    });
  } catch {
    return {
      ...getEmptyActionItemFormState(),
      formError:
        "We couldn't save that action item right now. Try again in a moment.",
      values: toActionItemFormValues(validation.data),
    };
  }

  redirect(`/app/relationships/${relationshipId}/meetings/${meetingId}`);
}

export async function saveMeetingNotesAction(
  relationshipId: string,
  meetingId: string,
  _previousState: MeetingNotesFormState,
  formData: FormData,
): Promise<MeetingNotesFormState> {
  const validation = validateMeetingNotesInput({
    shareableNotes: formData.get("shareableNotes"),
    privateNotes: formData.get("privateNotes"),
  });

  if (!validation.success) {
    return validation.state;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth/login?next=%2Fapp%2Frelationships%2F${relationshipId}%2Fmeetings%2F${meetingId}`,
    );
  }

  const meeting = await getMeetingById({
    meetingId,
    relationshipId,
    supabase,
    userId: user.id,
  });

  if (!meeting) {
    redirect(`/app/relationships/${relationshipId}`);
  }

  try {
    await saveMeetingNotes({
      input: validation.data,
      meetingId,
      relationshipId,
      supabase,
      userId: user.id,
    });
  } catch {
    return {
      ...getEmptyMeetingNotesFormState(),
      formError:
        "We couldn't save those notes right now. Try again in a moment.",
      values: toMeetingNotesFormValues(validation.data),
    };
  }

  redirect(`/app/relationships/${relationshipId}/meetings/${meetingId}`);
}

export async function createDecisionAction(
  relationshipId: string,
  meetingId: string,
  _previousState: DecisionFormState,
  formData: FormData,
): Promise<DecisionFormState> {
  const validation = validateDecisionInput({
    body: formData.get("body"),
  });

  if (!validation.success) {
    return validation.state;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth/login?next=%2Fapp%2Frelationships%2F${relationshipId}%2Fmeetings%2F${meetingId}`,
    );
  }

  const meeting = await getMeetingById({
    meetingId,
    relationshipId,
    supabase,
    userId: user.id,
  });

  if (!meeting) {
    redirect(`/app/relationships/${relationshipId}`);
  }

  try {
    await createDecision({
      input: validation.data,
      meetingId,
      relationshipId,
      supabase,
      userId: user.id,
    });
  } catch {
    return {
      ...getEmptyDecisionFormState(),
      formError:
        "We couldn't save that decision right now. Try again in a moment.",
      values: toDecisionFormValues(validation.data),
    };
  }

  redirect(`/app/relationships/${relationshipId}/meetings/${meetingId}`);
}

export async function addAgendaSuggestionAction(
  relationshipId: string,
  meetingId: string,
  formData: FormData,
): Promise<void> {
  await createAgendaItemAction(
    relationshipId,
    meetingId,
    getEmptyAgendaItemFormState(),
    formData,
  );
}

export async function generateAgendaIdeasAction(
  relationshipId: string,
  meetingId: string,
  _previousState: AgendaIdeasState,
  formData: FormData,
): Promise<AgendaIdeasState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth/login?next=%2Fapp%2Frelationships%2F${relationshipId}%2Fmeetings%2F${meetingId}`,
    );
  }

  try {
    const [relationship, meeting, openActionItems, notes] = await Promise.all([
      getRelationshipById({ relationshipId, supabase, userId: user.id }),
      getMeetingById({ meetingId, relationshipId, supabase, userId: user.id }),
      listOpenActionItemsByRelationship({ relationshipId, supabase, userId: user.id }),
      getMeetingNotesBundle({ meetingId, relationshipId, supabase, userId: user.id }),
    ]);

    if (!relationship || !meeting) {
      return {
        ...getEmptyAgendaIdeasState(),
        formError: "We couldn't find that meeting. Go back to the relationship and try again.",
      };
    }

    const ideas = buildAgendaIdeas({
      relationship,
      openActionItems,
      optionalPrompt: String(formData.get("prompt") ?? ""),
      priorMeetingHighlights: [
        notes.shareableNotes ?? "",
        ...notes.decisions.map((decision) => decision.body),
      ],
    });

    await supabase.from("ai_generations").insert({
      user_id: user.id,
      relationship_id: relationshipId,
      meeting_id: meetingId,
      generation_type: "agenda_ideas",
      input_context_summary: `relationship:${relationship.relationshipTypeLabel}; open_actions:${openActionItems.length}`,
      output_text: ideas.map((idea) => `${idea.title}: ${idea.description}`).join("\n"),
      status: "succeeded",
    });
    await trackProductEvent({
      supabase,
      userId: user.id,
      eventName: "ai_ideas_generated",
      entityType: "meeting",
      entityId: meetingId,
      metadata: { count: ideas.length },
    });

    return { ideas, formError: null };
  } catch {
    return {
      ...getEmptyAgendaIdeasState(),
      formError: "We couldn't generate ideas right now. You can still add agenda items manually.",
    };
  }
}

export async function generateFollowUpSummaryAction(
  relationshipId: string,
  meetingId: string,
  _previousState: FollowUpSummaryState,
  formData: FormData,
): Promise<FollowUpSummaryState> {
  const tone = parseTone(formData.get("tone"));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth/login?next=%2Fapp%2Frelationships%2F${relationshipId}%2Fmeetings%2F${meetingId}`,
    );
  }

  try {
    const [relationship, meeting, agendaItems, notes, actionItems] = await Promise.all([
      getRelationshipById({ relationshipId, supabase, userId: user.id }),
      getMeetingById({ meetingId, relationshipId, supabase, userId: user.id }),
      listAgendaItemsForMeeting({ meetingId, relationshipId, supabase, userId: user.id }),
      getMeetingNotesBundle({ meetingId, relationshipId, supabase, userId: user.id }),
      listActionItemsForMeeting({ meetingId, relationshipId, supabase, userId: user.id }),
    ]);

    if (!relationship || !meeting) {
      return {
        ...getEmptyFollowUpSummaryState(),
        values: { tone },
        formError: "We couldn't find that meeting. Go back to the relationship and try again.",
      };
    }

    const summary = buildFollowUpSummary({
      relationshipName: relationship.personName,
      meetingPurpose: meeting.purpose,
      agendaItems: agendaItems.map((item) => item.title),
      shareableNotes: notes.shareableNotes,
      privateNotes: notes.privateNotes,
      decisions: notes.decisions.map((decision) => decision.body),
      actionItems,
      tone,
    });

    await supabase.from("ai_generations").insert({
      user_id: user.id,
      relationship_id: relationshipId,
      meeting_id: meetingId,
      generation_type: "followup_summary",
      input_context_summary: `agenda:${agendaItems.length}; decisions:${notes.decisions.length}; actions:${actionItems.length}`,
      output_text: summary,
      status: "succeeded",
    });
    await trackProductEvent({
      supabase,
      userId: user.id,
      eventName: "followup_summary_generated",
      entityType: "meeting",
      entityId: meetingId,
    });

    return { summary, formError: null, values: { tone } };
  } catch {
    return {
      summary: null,
      formError: "We couldn't generate a summary right now. Your notes and action items are still saved and can be copied manually.",
      values: { tone },
    };
  }
}

export async function completeMeetingAction(relationshipId: string, meetingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth/login?next=%2Fapp%2Frelationships%2F${relationshipId}%2Fmeetings%2F${meetingId}`,
    );
  }

  try {
    await completeMeeting({ meetingId, relationshipId, supabase, userId: user.id });
    await trackProductEvent({
      supabase,
      userId: user.id,
      eventName: "meeting_completed",
      entityType: "meeting",
      entityId: meetingId,
    });
  } catch {
    // Keep the route usable even if completion fails in MVP.
  }

  redirect(`/app/relationships/${relationshipId}/meetings/${meetingId}`);
}

export async function summaryCopiedAction(relationshipId: string, meetingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await trackProductEvent({
    supabase,
    userId: user.id,
    eventName: "summary_copied",
    entityType: "meeting",
    entityId: meetingId,
    metadata: { relationshipId },
  });
}

function parseTone(value: FormDataEntryValue | null): FollowUpSummaryTone {
  if (value === "concise" || value === "warm" || value === "professional") {
    return value;
  }

  return "professional";
}
