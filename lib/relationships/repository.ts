import "server-only";

import type { createClient } from "@/lib/supabase/server";
import {
  RELATIONSHIP_CADENCE_LABELS,
  RELATIONSHIP_TYPE_LABELS,
  type RelationshipCadence,
  type RelationshipType,
} from "@/lib/relationships/types";
import type { CreateRelationshipInput } from "@/lib/relationships/validation";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type RelationshipRecord = {
  id: string;
  person_name: string;
  relationship_type: RelationshipType;
  person_context: string | null;
  relationship_goal: string | null;
  cadence: RelationshipCadence | null;
  status: "active" | "archived";
  created_at: string;
  updated_at: string;
};

export type Relationship = {
  id: string;
  personName: string;
  relationshipType: RelationshipType;
  relationshipTypeLabel: string;
  personContext: string | null;
  relationshipGoal: string | null;
  cadence: RelationshipCadence | null;
  cadenceLabel: string | null;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
};

export async function createRelationship(params: {
  input: CreateRelationshipInput;
  supabase: SupabaseServerClient;
  userId: string;
}) {
  const { data, error } = await params.supabase
    .from("relationships")
    .insert({
      user_id: params.userId,
      person_name: params.input.personName,
      relationship_type: params.input.relationshipType,
      person_context: params.input.personContext,
      relationship_goal: params.input.relationshipGoal,
      cadence: params.input.cadence,
      status: "active",
    })
    .select(
      "id, person_name, relationship_type, person_context, relationship_goal, cadence, status, created_at, updated_at",
    )
    .single();

  if (error || !data) {
    throw new Error("Failed to create relationship.");
  }

  return mapRelationshipRecord(data as RelationshipRecord);
}

export async function getRelationshipById(params: {
  relationshipId: string;
  supabase: SupabaseServerClient;
  userId: string;
}) {
  const { data, error } = await params.supabase
    .from("relationships")
    .select(
      "id, person_name, relationship_type, person_context, relationship_goal, cadence, status, created_at, updated_at",
    )
    .eq("id", params.relationshipId)
    .eq("user_id", params.userId)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to load relationship.");
  }

  if (!data) {
    return null;
  }

  return mapRelationshipRecord(data as RelationshipRecord);
}

export async function listActiveRelationships(params: {
  supabase: SupabaseServerClient;
  userId: string;
}) {
  const { data, error } = await params.supabase
    .from("relationships")
    .select(
      "id, person_name, relationship_type, person_context, relationship_goal, cadence, status, created_at, updated_at",
    )
    .eq("user_id", params.userId)
    .eq("status", "active")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error("Failed to load relationships.");
  }

  return (data ?? []).map((record) =>
    mapRelationshipRecord(record as RelationshipRecord),
  );
}

function mapRelationshipRecord(record: RelationshipRecord): Relationship {
  return {
    id: record.id,
    personName: record.person_name,
    relationshipType: record.relationship_type,
    relationshipTypeLabel: RELATIONSHIP_TYPE_LABELS[record.relationship_type],
    personContext: record.person_context,
    relationshipGoal: record.relationship_goal,
    cadence: record.cadence,
    cadenceLabel: record.cadence
      ? RELATIONSHIP_CADENCE_LABELS[record.cadence]
      : null,
    status: record.status,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}
