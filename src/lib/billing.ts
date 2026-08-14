export type Plan = "free" | "pro";
export type BillingInterval = "month" | "year";
export type SubscriptionStatus =
  | "none"
  | "active"
  | "trialing"
  | "past_due"
  | "canceled";

export const FREE_PEOPLE_LIMIT = 20;
export const FREE_PREPS_PER_30_DAYS = 10;

/** Successful referrals needed to redeem one free month of Pro. */
export const REFERRAL_QUOTA_PER_CREDIT = 3;

export function isPlan(value: unknown): value is Plan {
  return value === "free" || value === "pro";
}

type PlanPreferences = {
  plan?: string | null;
  subscription_status?: string | null;
  stripe_customer_id?: string | null;
  current_period_end?: string | null;
};

export function planFromPreferences(
  preferences: PlanPreferences | null,
): Plan {
  if (!preferences) return "free";
  if (preferences.plan !== "pro") return "free";
  // A pro row with a failed/cancelled subscription falls back to free.
  const status = preferences.subscription_status ?? "none";
  if (status !== "active" && status !== "trialing") return "free";
  // Referral-granted pro has no Stripe customer and expires at
  // current_period_end; Stripe-managed pro stays pro until the webhook
  // moves the subscription status.
  if (!preferences.stripe_customer_id) {
    const periodEnd = preferences.current_period_end;
    if (!periodEnd) return "free";
    return new Date(periodEnd).getTime() > Date.now() ? "pro" : "free";
  }
  return "pro";
}

/** True when pro access comes from redeemed referral credit, not Stripe. */
export function isReferralPro(
  preferences: PlanPreferences | null,
): boolean {
  return (
    planFromPreferences(preferences) === "pro" &&
    !preferences?.stripe_customer_id
  );
}

export function subscriptionStatusFromPreferences(
  preferences: { subscription_status?: string | null } | null,
): SubscriptionStatus {
  const status = preferences?.subscription_status ?? "none";
  if (
    status === "active" ||
    status === "trialing" ||
    status === "past_due" ||
    status === "canceled"
  ) {
    return status;
  }
  return "none";
}

export function prepWindowStartIso(now = Date.now()) {
  return new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
}
