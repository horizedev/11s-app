"use server";

import { redirect } from "next/navigation";

import { completeActionItem } from "@/lib/action-items/repository";
import { trackProductEvent } from "@/lib/analytics/repository";
import { createClient } from "@/lib/supabase/server";

export async function completeActionItemAction(
  redirectTo: string,
  actionItemId: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?next=${encodeURIComponent(redirectTo)}`);
  }

  try {
    await completeActionItem({
      actionItemId,
      supabase,
      userId: user.id,
    });
    await trackProductEvent({
      supabase,
      userId: user.id,
      eventName: "action_item_completed",
      entityType: "action_item",
      entityId: actionItemId,
    });
  } catch {
    // Completion failure should not surface as a broken route transition in MVP.
  }

  redirect(redirectTo);
}
