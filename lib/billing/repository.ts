import "server-only";

import type { createClient } from "@/lib/supabase/server";
import { evaluateUsage, resolvePlan } from "@/lib/billing/entitlements";
import { normalizePlan, normalizeSubscriptionStatus, type UserSubscription } from "@/lib/billing/plans";
import { mapStripeSubscriptionToRecord, type StripeSubscriptionLike } from "@/lib/billing/stripe-events";
import { createStripeCustomer } from "@/lib/billing/stripe";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type UserSubscriptionRecord = {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  plan: string | null;
  status: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};

export async function getUserSubscription(params: {
  supabase: SupabaseServerClient;
  userId: string;
}): Promise<UserSubscription | null> {
  const { data, error } = await params.supabase
    .from("user_subscriptions")
    .select(
      "id, user_id, stripe_customer_id, stripe_subscription_id, stripe_price_id, plan, status, current_period_end, created_at, updated_at",
    )
    .eq("user_id", params.userId)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to load subscription.");
  }

  return data ? mapUserSubscriptionRecord(data as UserSubscriptionRecord) : null;
}

export async function getOrCreateStripeCustomerId(params: {
  supabase: SupabaseServerClient;
  userId: string;
  email?: string | null;
}) {
  const subscription = await getUserSubscription({
    supabase: params.supabase,
    userId: params.userId,
  });

  if (subscription?.stripeCustomerId) {
    return subscription.stripeCustomerId;
  }

  const customerId = await createStripeCustomer({
    email: params.email,
    userId: params.userId,
  });

  const { error } = await params.supabase
    .from("user_subscriptions")
    .upsert(
      {
        user_id: params.userId,
        stripe_customer_id: customerId,
        plan: "free",
        status: "inactive",
      },
      { onConflict: "user_id" },
    );

  if (error) {
    throw new Error("Failed to save Stripe customer.");
  }

  return customerId;
}

export async function ensureStripeCustomerForUser(params: {
  supabase: SupabaseServerClient;
  userId: string;
  stripeCustomerId: string;
}) {
  const { error } = await params.supabase
    .from("user_subscriptions")
    .upsert(
      {
        user_id: params.userId,
        stripe_customer_id: params.stripeCustomerId,
        plan: "free",
        status: "inactive",
      },
      { onConflict: "user_id" },
    );

  if (error) {
    throw new Error("Failed to save Stripe checkout customer.");
  }
}

export async function upsertSubscriptionFromStripe(params: {
  supabase: SupabaseServerClient;
  subscription: StripeSubscriptionLike;
}) {
  const record = mapStripeSubscriptionToRecord(params.subscription);

  if (!record.stripeCustomerId) {
    throw new Error("Stripe subscription is missing customer id.");
  }

  const existing = await getSubscriptionOwnerByCustomerId({
    supabase: params.supabase,
    stripeCustomerId: record.stripeCustomerId,
  });
  const userId = existing?.userId ?? params.subscription.metadata?.user_id ?? null;

  if (!userId) {
    throw new Error("Stripe subscription is missing user ownership metadata.");
  }

  const { error } = await params.supabase
    .from("user_subscriptions")
    .upsert(
      {
        user_id: userId,
        stripe_customer_id: record.stripeCustomerId,
        stripe_subscription_id: record.stripeSubscriptionId,
        stripe_price_id: record.stripePriceId,
        plan: record.plan,
        status: record.status,
        current_period_end: record.currentPeriodEnd,
      },
      { onConflict: "user_id" },
    );

  if (error) {
    throw new Error("Failed to upsert Stripe subscription.");
  }
}

async function getSubscriptionOwnerByCustomerId(params: {
  supabase: SupabaseServerClient;
  stripeCustomerId: string;
}) {
  const { data, error } = await params.supabase
    .from("user_subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", params.stripeCustomerId)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to load Stripe customer owner.");
  }

  return data ? { userId: (data as { user_id: string }).user_id } : null;
}

export async function getBillingUsage(params: {
  supabase: SupabaseServerClient;
  userId: string;
  now?: Date;
}) {
  const [subscription, activeRelationships, totalMeetings, monthlyAiGenerations] =
    await Promise.all([
      getUserSubscription({ supabase: params.supabase, userId: params.userId }),
      countActiveRelationships(params),
      countTotalMeetings(params),
      countMonthlyAiGenerations(params),
    ]);

  return evaluateUsage({
    plan: resolvePlan(subscription),
    activeRelationships,
    totalMeetings,
    monthlyAiGenerations,
  });
}

export async function countActiveRelationships(params: {
  supabase: SupabaseServerClient;
  userId: string;
}) {
  const { count, error } = await params.supabase
    .from("relationships")
    .select("id", { count: "exact", head: true })
    .eq("user_id", params.userId)
    .eq("status", "active")
    .order("id", { ascending: true });

  if (error) {
    throw new Error("Failed to count relationships.");
  }

  return count ?? 0;
}

export async function countTotalMeetings(params: {
  supabase: SupabaseServerClient;
  userId: string;
}) {
  const { count, error } = await params.supabase
    .from("meetings")
    .select("id", { count: "exact", head: true })
    .eq("user_id", params.userId)
    .order("id", { ascending: true });

  if (error) {
    throw new Error("Failed to count meetings.");
  }

  return count ?? 0;
}

export async function countMonthlyAiGenerations(params: {
  supabase: SupabaseServerClient;
  userId: string;
  now?: Date;
}) {
  const monthStart = getUtcMonthStart(params.now ?? new Date());
  const { count, error } = await params.supabase
    .from("ai_generations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", params.userId)
    .eq("status", "succeeded")
    .gte("created_at", monthStart.toISOString())
    .order("id", { ascending: true });

  if (error) {
    throw new Error("Failed to count AI generations.");
  }

  return count ?? 0;
}

function getUtcMonthStart(now: Date) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

function mapUserSubscriptionRecord(record: UserSubscriptionRecord): UserSubscription {
  return {
    id: record.id,
    userId: record.user_id,
    stripeCustomerId: record.stripe_customer_id,
    stripeSubscriptionId: record.stripe_subscription_id,
    stripePriceId: record.stripe_price_id,
    plan: normalizePlan(record.plan),
    status: normalizeSubscriptionStatus(record.status),
    currentPeriodEnd: record.current_period_end,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}
