import { NextResponse } from "next/server";

import { ensureStripeCustomerForUser, upsertSubscriptionFromStripe } from "@/lib/billing/repository";
import { constructStripeWebhookEvent } from "@/lib/billing/stripe";
import type { StripeSubscriptionLike } from "@/lib/billing/stripe-events";
import { createAdminClient } from "@/lib/supabase/admin";

const SUBSCRIPTION_EVENTS = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

type CheckoutSessionLike = {
  customer?: string | null;
  metadata?: { user_id?: string | null } | null;
};

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const payload = await request.text();
  let event: Awaited<ReturnType<typeof constructStripeWebhookEvent>>;

  try {
    event = await constructStripeWebhookEvent(payload, signature);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe webhook." }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as CheckoutSessionLike;
    if (session.customer && session.metadata?.user_id) {
      await ensureStripeCustomerForUser({
        supabase,
        userId: session.metadata.user_id,
        stripeCustomerId: session.customer,
      });
    }
  }

  if (SUBSCRIPTION_EVENTS.has(event.type)) {
    await upsertSubscriptionFromStripe({
      supabase,
      subscription: event.data.object as StripeSubscriptionLike,
    });
  }

  return NextResponse.json({ received: true });
}
