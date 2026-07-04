import "server-only";

import type { createClient } from "@/lib/supabase/server";
import type { CreateMeetingInput } from "@/lib/meetings/validation";
import type { MeetingStatus } from "@/lib/meetings/types";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type MeetingRecord = {
  id: string;
  relationship_id: string;
  purpose: string | null;
  scheduled_at: string | null;
  status: MeetingStatus;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
};

export type Meeting = {
  id: string;
  relationshipId: string;
  purpose: string | null;
  scheduledAt: string | null;
  status: MeetingStatus;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export async function createMeeting(params: {
  input: CreateMeetingInput;
  relationshipId: string;
  supabase: SupabaseServerClient;
  userId: string;
}) {
  const { data, error } = await params.supabase
    .from("meetings")
    .insert({
      user_id: params.userId,
      relationship_id: params.relationshipId,
      purpose: params.input.purpose,
      scheduled_at: params.input.scheduledAt,
      status: "draft",
    })
    .select(
      "id, relationship_id, purpose, scheduled_at, status, created_at, updated_at, completed_at",
    )
    .single();

  if (error || !data) {
    throw new Error("Failed to create meeting.");
  }

  return mapMeetingRecord(data as MeetingRecord);
}

export async function getMeetingById(params: {
  meetingId: string;
  relationshipId: string;
  supabase: SupabaseServerClient;
  userId: string;
}) {
  const { data, error } = await params.supabase
    .from("meetings")
    .select(
      "id, relationship_id, purpose, scheduled_at, status, created_at, updated_at, completed_at",
    )
    .eq("id", params.meetingId)
    .eq("relationship_id", params.relationshipId)
    .eq("user_id", params.userId)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to load meeting.");
  }

  if (!data) {
    return null;
  }

  return mapMeetingRecord(data as MeetingRecord);
}

export async function completeMeeting(params: {
  meetingId: string;
  relationshipId: string;
  supabase: SupabaseServerClient;
  userId: string;
}) {
  const { error } = await params.supabase
    .from("meetings")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", params.meetingId)
    .eq("relationship_id", params.relationshipId)
    .eq("user_id", params.userId);

  if (error) {
    throw new Error("Failed to complete meeting.");
  }
}

function mapMeetingRecord(record: MeetingRecord): Meeting {
  return {
    id: record.id,
    relationshipId: record.relationship_id,
    purpose: record.purpose,
    scheduledAt: record.scheduled_at,
    status: record.status,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    completedAt: record.completed_at,
  };
}
