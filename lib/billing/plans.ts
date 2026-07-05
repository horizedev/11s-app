export const PLAN_IDS = ["free", "pro"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export const SUBSCRIPTION_STATUSES = [
  "inactive",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "incomplete",
  "incomplete_expired",
  "unpaid",
] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export type UserSubscription = {
  id?: string;
  userId?: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  plan: PlanId;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export const PLAN_LABELS: Record<PlanId, string> = {
  free: "Free",
  pro: "Pro",
};

export function normalizePlan(value: unknown): PlanId {
  return value === "pro" ? "pro" : "free";
}

export function normalizeSubscriptionStatus(value: unknown): SubscriptionStatus {
  if (SUBSCRIPTION_STATUSES.includes(value as SubscriptionStatus)) {
    return value as SubscriptionStatus;
  }

  return "inactive";
}

export function isPaidSubscriptionStatus(status: SubscriptionStatus) {
  return status === "active" || status === "trialing";
}
