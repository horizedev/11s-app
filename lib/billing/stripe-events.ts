import { normalizeSubscriptionStatus, type PlanId, type SubscriptionStatus } from "@/lib/billing/plans";

export type StripeSubscriptionLike = {
  id: string;
  customer: string | { id?: string | null } | null;
  status: string | null;
  current_period_end?: number | null;
  metadata?: { user_id?: string | null } | null;
  items?: {
    data?: Array<{
      price?: {
        id?: string | null;
      } | null;
    }>;
  } | null;
};

export type StripeSubscriptionRecord = {
  stripeCustomerId: string | null;
  stripeSubscriptionId: string;
  stripePriceId: string | null;
  plan: PlanId;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
};

export function mapStripeSubscriptionToRecord(
  subscription: StripeSubscriptionLike,
): StripeSubscriptionRecord {
  const status = normalizeSubscriptionStatus(subscription.status);
  const stripePriceId = subscription.items?.data?.[0]?.price?.id ?? null;

  return {
    stripeCustomerId: getStripeCustomerId(subscription.customer),
    stripeSubscriptionId: subscription.id,
    stripePriceId,
    plan: status === "active" || status === "trialing" ? "pro" : "free",
    status,
    currentPeriodEnd: subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : null,
  };
}

function getStripeCustomerId(customer: StripeSubscriptionLike["customer"]) {
  if (typeof customer === "string") {
    return customer;
  }

  return customer?.id ?? null;
}
