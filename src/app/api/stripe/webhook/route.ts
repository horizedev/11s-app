import type Stripe from "stripe";

import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

export const runtime = "nodejs";

type AdminClient = SupabaseClient<Database>;

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

function readPeriodEnd(subscription: Stripe.Subscription): string | null {
  const fromItem = subscription.items?.data?.[0]?.current_period_end;
  const legacy = (
    subscription as Stripe.Subscription & { current_period_end?: number }
  ).current_period_end;
  const seconds = fromItem ?? legacy;
  return seconds ? new Date(seconds * 1000).toISOString() : null;
}

async function applySubscription(
  admin: AdminClient,
  subscription: Stripe.Subscription,
  fallbackUserId?: string | null,
) {
  const status = subscription.status;
  const plan = ACTIVE_STATUSES.has(status) ? "pro" : "free";
  const row = {
    plan,
    subscription_status: status,
    stripe_customer_id:
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id,
    current_period_end: readPeriodEnd(subscription),
    updated_at: new Date().toISOString(),
  };

  const userId = subscription.metadata?.user_id ?? fallbackUserId ?? null;
  if (userId) {
    const result = await admin
      .from("11s_preferences")
      .upsert({ user_id: userId, ...row });
    if (!result.error) return;
  }

  // Fall back to locating the user through the stored customer id.
  const { data: preferences } = await admin
    .from("11s_preferences")
    .select("user_id")
    .eq("stripe_customer_id", row.stripe_customer_id)
    .maybeSingle();

  if (preferences?.user_id) {
    await admin
      .from("11s_preferences")
      .update(row)
      .eq("user_id", preferences.user_id);
  }
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!stripe || !webhookSecret || !signature) {
    return Response.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  const admin = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription" || !session.subscription) break;

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);
        await applySubscription(admin, subscription, session.client_reference_id);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await applySubscription(
          admin,
          event.data.object as Stripe.Subscription,
        );
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const legacy = invoice as Stripe.Invoice & {
          subscription?: string | { id: string } | null;
        };
        const subscriptionRef =
          invoice.parent?.subscription_details?.subscription ??
          legacy.subscription ??
          null;
        const subscriptionId =
          typeof subscriptionRef === "string"
            ? subscriptionRef
            : subscriptionRef?.id;

        if (subscriptionId) {
          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId);
          await applySubscription(admin, subscription);
        }
        break;
      }

      default:
        break;
    }
  } catch (handlerError) {
    console.error("Stripe webhook handler failed", handlerError);
    return Response.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return Response.json({ received: true });
}
