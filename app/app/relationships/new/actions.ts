"use server";

import { redirect } from "next/navigation";

import { createRelationship } from "@/lib/relationships/repository";
import { trackProductEvent } from "@/lib/analytics/repository";
import { getBillingUsage } from "@/lib/billing/repository";
import { getUpgradeMessage } from "@/lib/billing/entitlements";
import { rethrowIfRedirectError } from "@/lib/navigation/redirect-error";
import {
  getEmptyRelationshipFormState,
  toRelationshipFormValues,
  type RelationshipFormState,
  validateRelationshipInput,
} from "@/lib/relationships/validation";
import { createClient } from "@/lib/supabase/server";

export async function createRelationshipAction(
  _previousState: RelationshipFormState,
  formData: FormData,
): Promise<RelationshipFormState> {
  const validation = validateRelationshipInput({
    personName: formData.get("personName"),
    relationshipType: formData.get("relationshipType"),
    personContext: formData.get("personContext"),
    relationshipGoal: formData.get("relationshipGoal"),
    cadence: formData.get("cadence"),
  });

  if (!validation.success) {
    return validation.state;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=%2Fapp%2Frelationships%2Fnew");
  }

  const usage = await getBillingUsage({ supabase, userId: user.id });

  if (!usage.canCreateRelationship) {
    return {
      ...getEmptyRelationshipFormState(),
      formError: getUpgradeMessage("relationship"),
      values: toRelationshipFormValues(validation.data),
    };
  }

  try {
    const relationship = await createRelationship({
      input: validation.data,
      supabase,
      userId: user.id,
    });

    await trackProductEvent({
      supabase,
      userId: user.id,
      eventName: "relationship_created",
      entityType: "relationship",
      entityId: relationship.id,
    });

    redirect(`/app/relationships/${relationship.id}`);
  } catch (error) {
    rethrowIfRedirectError(error);
    return {
      ...getEmptyRelationshipFormState(),
      formError:
        "We couldn't save this relationship right now. Try again or add it manually in a moment.",
      values: toRelationshipFormValues(validation.data),
    };
  }
}
