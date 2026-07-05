import type { PlanId, SubscriptionStatus } from "@/lib/billing/plans";
import { isPaidSubscriptionStatus, normalizePlan, normalizeSubscriptionStatus } from "@/lib/billing/plans";

export const FREE_RELATIONSHIPS_LIMIT = 1;
export const FREE_MEETINGS_LIMIT = 3;
export const FREE_AI_GENERATIONS_PER_MONTH = 5;
export const PRO_AI_GENERATIONS_PER_MONTH = 100;

export type SubscriptionLike = {
  plan?: string | null;
  status?: string | null;
} | null;

export type UsageInput = {
  plan: PlanId;
  activeRelationships: number;
  totalMeetings: number;
  monthlyAiGenerations: number;
};

export type EntitlementSnapshot = UsageInput & {
  relationshipLimit: number | null;
  meetingLimit: number | null;
  aiGenerationLimit: number;
  canCreateRelationship: boolean;
  canCreateMeeting: boolean;
  canGenerateAi: boolean;
};

export function resolvePlan(subscription: SubscriptionLike): PlanId {
  if (!subscription) {
    return "free";
  }

  const status = normalizeSubscriptionStatus(subscription.status);
  const plan = normalizePlan(subscription.plan);

  if (plan === "pro" && isPaidSubscriptionStatus(status as SubscriptionStatus)) {
    return "pro";
  }

  return "free";
}

export function evaluateUsage(input: UsageInput): EntitlementSnapshot {
  if (input.plan === "pro") {
    return {
      ...input,
      relationshipLimit: null,
      meetingLimit: null,
      aiGenerationLimit: PRO_AI_GENERATIONS_PER_MONTH,
      canCreateRelationship: true,
      canCreateMeeting: true,
      canGenerateAi: input.monthlyAiGenerations < PRO_AI_GENERATIONS_PER_MONTH,
    };
  }

  return {
    ...input,
    relationshipLimit: FREE_RELATIONSHIPS_LIMIT,
    meetingLimit: FREE_MEETINGS_LIMIT,
    aiGenerationLimit: FREE_AI_GENERATIONS_PER_MONTH,
    canCreateRelationship: input.activeRelationships < FREE_RELATIONSHIPS_LIMIT,
    canCreateMeeting: input.totalMeetings < FREE_MEETINGS_LIMIT,
    canGenerateAi: input.monthlyAiGenerations < FREE_AI_GENERATIONS_PER_MONTH,
  };
}

export function getUpgradeMessage(kind: "relationship" | "meeting" | "ai") {
  if (kind === "relationship") {
    return "Free includes 1 active relationship. Upgrade to Pro for unlimited relationships.";
  }

  if (kind === "meeting") {
    return "Free includes 3 meetings. Upgrade to Pro for unlimited meeting history and prep.";
  }

  return "You've reached this month's AI generation allowance. Upgrade to Pro for 100 AI generations per month.";
}
