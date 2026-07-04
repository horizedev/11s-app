import "server-only";

import type { createClient } from "@/lib/supabase/server";
import {
  ACTION_ITEM_OWNER_LABELS,
  type ActionItemOwner,
  type ActionItemStatus,
} from "@/lib/action-items/types";
import type { CreateActionItemInput } from "@/lib/action-items/validation";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type ActionItemRecord = {
  id: string;
  relationship_id: string;
  meeting_id: string;
  title: string;
  owner: ActionItemOwner;
  due_date: string | null;
  notes: string | null;
  status: ActionItemStatus;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ActionItem = {
  id: string;
  relationshipId: string;
  meetingId: string;
  title: string;
  owner: ActionItemOwner;
  ownerLabel: string;
  dueDate: string | null;
  notes: string | null;
  status: ActionItemStatus;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function createActionItem(params: {
  input: CreateActionItemInput;
  meetingId: string;
  relationshipId: string;
  supabase: SupabaseServerClient;
  userId: string;
}) {
  const { data, error } = await params.supabase
    .from("action_items")
    .insert({
      user_id: params.userId,
      relationship_id: params.relationshipId,
      meeting_id: params.meetingId,
      title: params.input.title,
      owner: params.input.owner,
      due_date: params.input.dueDate,
      notes: params.input.notes,
      status: "open",
    })
    .select(
      "id, relationship_id, meeting_id, title, owner, due_date, notes, status, completed_at, created_at, updated_at",
    )
    .single();

  if (error || !data) {
    throw new Error("Failed to create action item.");
  }

  return mapActionItemRecord(data as ActionItemRecord);
}

export async function listActionItemsForMeeting(params: {
  meetingId: string;
  relationshipId: string;
  supabase: SupabaseServerClient;
  userId: string;
}) {
  const { data, error } = await params.supabase
    .from("action_items")
    .select(
      "id, relationship_id, meeting_id, title, owner, due_date, notes, status, completed_at, created_at, updated_at",
    )
    .eq("meeting_id", params.meetingId)
    .eq("relationship_id", params.relationshipId)
    .eq("user_id", params.userId)
    .neq("status", "cancelled")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error("Failed to load action items.");
  }

  return (data ?? []).map((record) => mapActionItemRecord(record as ActionItemRecord));
}

export async function listOpenActionItemsByRelationship(params: {
  relationshipId: string;
  supabase: SupabaseServerClient;
  userId: string;
}) {
  const { data, error } = await params.supabase
    .from("action_items")
    .select(
      "id, relationship_id, meeting_id, title, owner, due_date, notes, status, completed_at, created_at, updated_at",
    )
    .eq("relationship_id", params.relationshipId)
    .eq("user_id", params.userId)
    .eq("status", "open")
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to load open action items.");
  }

  return (data ?? []).map((record) => mapActionItemRecord(record as ActionItemRecord));
}

export async function listOpenActionItems(params: {
  supabase: SupabaseServerClient;
  userId: string;
}) {
  const { data, error } = await params.supabase
    .from("action_items")
    .select(
      "id, relationship_id, meeting_id, title, owner, due_date, notes, status, completed_at, created_at, updated_at",
    )
    .eq("user_id", params.userId)
    .eq("status", "open")
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to load action items.");
  }

  return (data ?? []).map((record) => mapActionItemRecord(record as ActionItemRecord));
}

export async function completeActionItem(params: {
  actionItemId: string;
  supabase: SupabaseServerClient;
  userId: string;
}) {
  const { error } = await params.supabase
    .from("action_items")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", params.actionItemId)
    .eq("user_id", params.userId);

  if (error) {
    throw new Error("Failed to complete action item.");
  }
}

function mapActionItemRecord(record: ActionItemRecord): ActionItem {
  return {
    id: record.id,
    relationshipId: record.relationship_id,
    meetingId: record.meeting_id,
    title: record.title,
    owner: record.owner,
    ownerLabel: ACTION_ITEM_OWNER_LABELS[record.owner],
    dueDate: record.due_date,
    notes: record.notes,
    status: record.status,
    completedAt: record.completed_at,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}
