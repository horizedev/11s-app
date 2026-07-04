import "server-only";

import type { createClient } from "@/lib/supabase/server";
import {
  AGENDA_ITEM_CATEGORY_LABELS,
  type AgendaItemCategory,
} from "@/lib/agenda/types";
import type { CreateAgendaItemInput } from "@/lib/agenda/validation";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type AgendaItemRecord = {
  id: string;
  meeting_id: string;
  relationship_id: string;
  title: string;
  description: string | null;
  category: AgendaItemCategory | null;
  position: number;
  is_discussed: boolean;
  created_at: string;
  updated_at: string;
};

export type AgendaItem = {
  id: string;
  meetingId: string;
  relationshipId: string;
  title: string;
  description: string | null;
  category: AgendaItemCategory | null;
  categoryLabel: string | null;
  position: number;
  isDiscussed: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function createAgendaItem(params: {
  input: CreateAgendaItemInput;
  meetingId: string;
  relationshipId: string;
  supabase: SupabaseServerClient;
  userId: string;
}) {
  const { data: existingItems, error: existingItemsError } = await params.supabase
    .from("agenda_items")
    .select("position")
    .eq("meeting_id", params.meetingId)
    .eq("relationship_id", params.relationshipId)
    .eq("user_id", params.userId)
    .order("position", { ascending: false })
    .limit(1);

  if (existingItemsError) {
    throw new Error("Failed to load agenda item order.");
  }

  const nextPosition =
    existingItems && existingItems.length > 0 ? existingItems[0].position + 1 : 0;

  const { data, error } = await params.supabase
    .from("agenda_items")
    .insert({
      user_id: params.userId,
      meeting_id: params.meetingId,
      relationship_id: params.relationshipId,
      title: params.input.title,
      description: params.input.description,
      category: params.input.category,
      position: nextPosition,
      is_discussed: false,
    })
    .select(
      "id, meeting_id, relationship_id, title, description, category, position, is_discussed, created_at, updated_at",
    )
    .single();

  if (error || !data) {
    throw new Error("Failed to create agenda item.");
  }

  return mapAgendaItemRecord(data as AgendaItemRecord);
}

export async function listAgendaItemsForMeeting(params: {
  meetingId: string;
  relationshipId: string;
  supabase: SupabaseServerClient;
  userId: string;
}) {
  const { data, error } = await params.supabase
    .from("agenda_items")
    .select(
      "id, meeting_id, relationship_id, title, description, category, position, is_discussed, created_at, updated_at",
    )
    .eq("meeting_id", params.meetingId)
    .eq("relationship_id", params.relationshipId)
    .eq("user_id", params.userId)
    .order("position", { ascending: true });

  if (error) {
    throw new Error("Failed to load agenda items.");
  }

  return (data ?? []).map((record) => mapAgendaItemRecord(record as AgendaItemRecord));
}

function mapAgendaItemRecord(record: AgendaItemRecord): AgendaItem {
  return {
    id: record.id,
    meetingId: record.meeting_id,
    relationshipId: record.relationship_id,
    title: record.title,
    description: record.description,
    category: record.category,
    categoryLabel: record.category
      ? AGENDA_ITEM_CATEGORY_LABELS[record.category]
      : null,
    position: record.position,
    isDiscussed: record.is_discussed,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}
