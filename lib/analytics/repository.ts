import "server-only";

import type { createClient } from "@/lib/supabase/server";

export const PRODUCT_EVENT_NAMES = [
  "user_signed_up",
  "relationship_created",
  "meeting_created",
  "ai_ideas_generated",
  "ai_suggestion_added_to_agenda",
  "meeting_completed",
  "action_item_created",
  "action_item_completed",
  "followup_summary_generated",
  "summary_copied",
] as const;

export type ProductEventName = (typeof PRODUCT_EVENT_NAMES)[number];

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export async function trackProductEvent(params: {
  supabase: SupabaseServerClient;
  userId: string;
  eventName: ProductEventName;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, string | number | boolean | null>;
}) {
  try {
    await params.supabase.from("product_events").insert({
      user_id: params.userId,
      event_name: params.eventName,
      entity_type: params.entityType ?? null,
      entity_id: params.entityId ?? null,
      metadata: params.metadata ?? {},
    });
  } catch {
    // Analytics must never block the core MVP workflow.
  }
}
