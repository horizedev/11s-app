import "server-only";

import type { createClient } from "@/lib/supabase/server";
import type {
  CreateDecisionInput,
  SaveMeetingNotesInput,
} from "@/lib/meeting-notes/validation";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type MeetingNoteRecord = {
  id: string;
  note_type: "shareable" | "private" | "decision";
  body: string;
  position: number;
  created_at: string;
  updated_at: string;
};

type MeetingNoteInsert = {
  user_id: string;
  relationship_id: string;
  meeting_id: string;
  note_type: "shareable" | "private" | "decision";
  body: string;
  position: number;
};

export type Decision = {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type MeetingNotesBundle = {
  shareableNotes: string | null;
  privateNotes: string | null;
  decisions: Decision[];
};

export async function getMeetingNotesBundle(params: {
  meetingId: string;
  relationshipId: string;
  supabase: SupabaseServerClient;
  userId: string;
}) {
  const { data, error } = await params.supabase
    .from("meeting_notes")
    .select("id, note_type, body, position, created_at, updated_at")
    .eq("meeting_id", params.meetingId)
    .eq("relationship_id", params.relationshipId)
    .eq("user_id", params.userId)
    .order("position", { ascending: true });

  if (error) {
    throw new Error("Failed to load meeting notes.");
  }

  const notes = (data ?? []) as MeetingNoteRecord[];

  const shareableNote = notes.find((note) => note.note_type === "shareable");
  const privateNote = notes.find((note) => note.note_type === "private");
  const decisions = notes
    .filter((note) => note.note_type === "decision")
    .map((note) => ({
      id: note.id,
      body: note.body,
      createdAt: note.created_at,
      updatedAt: note.updated_at,
    }));

  return {
    shareableNotes: shareableNote?.body ?? null,
    privateNotes: privateNote?.body ?? null,
    decisions,
  } satisfies MeetingNotesBundle;
}

export async function saveMeetingNotes(params: {
  input: SaveMeetingNotesInput;
  meetingId: string;
  relationshipId: string;
  supabase: SupabaseServerClient;
  userId: string;
}) {
  const singletonTypes = ["shareable", "private"];

  const { error: deleteError } = await params.supabase
    .from("meeting_notes")
    .delete()
    .eq("meeting_id", params.meetingId)
    .eq("relationship_id", params.relationshipId)
    .eq("user_id", params.userId)
    .in("note_type", singletonTypes);

  if (deleteError) {
    throw new Error("Failed to replace meeting notes.");
  }

  const rows: MeetingNoteInsert[] = [];

  if (params.input.shareableNotes) {
    rows.push({
      user_id: params.userId,
      relationship_id: params.relationshipId,
      meeting_id: params.meetingId,
      note_type: "shareable",
      body: params.input.shareableNotes,
      position: 0,
    });
  }

  if (params.input.privateNotes) {
    rows.push({
      user_id: params.userId,
      relationship_id: params.relationshipId,
      meeting_id: params.meetingId,
      note_type: "private",
      body: params.input.privateNotes,
      position: 0,
    });
  }

  if (rows.length === 0) {
    return;
  }

  const { error } = await params.supabase.from("meeting_notes").insert(rows);

  if (error) {
    throw new Error("Failed to save meeting notes.");
  }
}

export async function createDecision(params: {
  input: CreateDecisionInput;
  meetingId: string;
  relationshipId: string;
  supabase: SupabaseServerClient;
  userId: string;
}) {
  const { data: latestDecision, error: latestDecisionError } = await params.supabase
    .from("meeting_notes")
    .select("position")
    .eq("meeting_id", params.meetingId)
    .eq("relationship_id", params.relationshipId)
    .eq("user_id", params.userId)
    .eq("note_type", "decision")
    .order("position", { ascending: false })
    .limit(1);

  if (latestDecisionError) {
    throw new Error("Failed to determine the next decision position.");
  }

  const nextPosition =
    latestDecision && latestDecision.length > 0 ? latestDecision[0].position + 1 : 0;

  const { data, error } = await params.supabase
    .from("meeting_notes")
    .insert({
      user_id: params.userId,
      relationship_id: params.relationshipId,
      meeting_id: params.meetingId,
      note_type: "decision",
      body: params.input.body,
      position: nextPosition,
    })
    .select("id, note_type, body, position, created_at, updated_at")
    .single();

  if (error || !data) {
    throw new Error("Failed to save decision.");
  }

  return {
    id: data.id,
    body: data.body,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } satisfies Decision;
}
