"use server";

import { redirect } from "next/navigation";

import { getOrCreateStripeCustomerId, getUserSubscription } from "@/lib/billing/repository";
import { createCheckoutSession, createCustomerPortalSession } from "@/lib/billing/stripe";
import { createClient } from "@/lib/supabase/server";

export async function startCheckoutAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=%2Fapp%2Fbilling");
  }

  const customerId = await getOrCreateStripeCustomerId({
    supabase,
    userId: user.id,
    email: user.email,
  });
  const checkoutUrl = await createCheckoutSession({
    customerId,
    userId: user.id,
  });

  redirect(checkoutUrl);
}

export async function openCustomerPortalAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=%2Fapp%2Fbilling");
  }

  const subscription = await getUserSubscription({ supabase, userId: user.id });

  if (!subscription?.stripeCustomerId) {
    redirect("/app/billing?portal=missing-customer");
  }

  const portalUrl = await createCustomerPortalSession({
    customerId: subscription.stripeCustomerId,
  });

  redirect(portalUrl);
}
