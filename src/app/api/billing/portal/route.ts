import { getAppUrl, getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData?.claims?.sub) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return Response.json(
      { error: "Billing is not configured yet." },
      { status: 503 },
    );
  }

  const { data: preferences } = await supabase
    .from("11s_preferences")
    .select("stripe_customer_id")
    .eq("user_id", authData.claims.sub)
    .maybeSingle();

  const customerId = preferences?.stripe_customer_id;
  if (!customerId) {
    return Response.json(
      { error: "No billing account found for this user." },
      { status: 404 },
    );
  }

  const appUrl = getAppUrl(new URL(request.url).origin);

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/workspace`,
  });

  return Response.json({ url: session.url });
}
