import "server-only";

import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type PrepBriefRecord = {
  id: string;
  relationship_id: string;
  meeting_id: string;
  content_markdown: string;
  included_private_notes: boolean;
  model: string | null;
  input_snapshot: Record<string, unknown>;
  created_at: string;
};

export type PrepBrief = {
  id: string;
  relationshipId: string;
  meetingId: string;
  contentMarkdown: string;
  includedPrivateNotes: boolean;
  model: string | null;
  inputSnapshot: Record<string, unknown>;
  createdAt: string;
};

export async function getLatestPrepBriefForMeeting(params: {
  meetingId: string;
  relationshipId: string;
  supabase: SupabaseServerClient;
  userId: string;
}) {
  const { data, error } = await params.supabase
    .from("ai_prep_briefs")
    .select(
      "id, relationship_id, meeting_id, content_markdown, included_private_notes, model, input_snapshot, created_at",
    )
    .eq("meeting_id", params.meetingId)
    .eq("relationship_id", params.relationshipId)
    .eq("user_id", params.userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to load prep brief.");
  }

  return data ? mapPrepBriefRecord(data as PrepBriefRecord) : null;
}

export async function createPrepBrief(params: {
  meetingId: string;
  relationshipId: string;
  userId: string;
  contentMarkdown: string;
  includedPrivateNotes: boolean;
  model: string | null;
  inputSnapshot: Record<string, unknown>;
  supabase: SupabaseServerClient;
}) {
  const { data, error } = await params.supabase
    .from("ai_prep_briefs")
    .insert({
      user_id: params.userId,
      relationship_id: params.relationshipId,
      meeting_id: params.meetingId,
      content_markdown: params.contentMarkdown,
      included_private_notes: params.includedPrivateNotes,
      model: params.model,
      input_snapshot: params.inputSnapshot,
    })
    .select(
      "id, relationship_id, meeting_id, content_markdown, included_private_notes, model, input_snapshot, created_at",
    )
    .single();

  if (error || !data) {
    throw new Error("Failed to save prep brief.");
  }

  return mapPrepBriefRecord(data as PrepBriefRecord);
}

function mapPrepBriefRecord(record: PrepBriefRecord): PrepBrief {
  return {
    id: record.id,
    relationshipId: record.relationship_id,
    meetingId: record.meeting_id,
    contentMarkdown: record.content_markdown,
    includedPrivateNotes: record.included_private_notes,
    model: record.model,
    inputSnapshot: record.input_snapshot,
    createdAt: record.created_at,
  };
}
