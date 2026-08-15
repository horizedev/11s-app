import { z } from "zod";

import type { BillingInterval } from "@/lib/billing";
import { getAppUrl, getPriceId, getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const bodySchema = z.object({
  interval: z.enum(["month", "quarter", "year"]),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData?.claims?.sub) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid billing interval." }, { status: 400 });
  }

  const stripe = getStripe();
  const priceId = getPriceId(parsed.data.interval as BillingInterval);
  if (!stripe || !priceId) {
    return Response.json(
      { error: "Billing is not configured yet." },
      { status: 503 },
    );
  }

  const userId = authData.claims.sub;
  const email =
    typeof authData.claims.email === "string" ? authData.claims.email : undefined;

  const { data: preferences } = await supabase
    .from("11s_preferences")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();

  let customerId = preferences?.stripe_customer_id ?? null;

  if (customerId) {
    const existing = await stripe.customers.retrieve(customerId).catch(() => null);
    if (!existing || existing.deleted) customerId = null;
  }

  if (!customerId) {
    const customer = await stripe.customers.create({
      email,
      metadata: { app: "11s", user_id: userId },
    });
    customerId = customer.id;

    await supabase.from("11s_preferences").upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      updated_at: new Date().toISOString(),
    });
  }

  const appUrl = getAppUrl(new URL(request.url).origin);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: userId,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${appUrl}/workspace?upgraded=1`,
    cancel_url: `${appUrl}/pricing`,
    subscription_data: {
      metadata: { app: "11s", user_id: userId },
    },
  });

  return Response.json({ url: session.url });
}
