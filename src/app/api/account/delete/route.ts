import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Permanently deletes the signed-in user's account. All 11s data rows
 * reference auth.users with ON DELETE CASCADE, so removing the auth user
 * wipes people, discussions, prep ideas, talking points, preferences,
 * career needs, usage metering, and referral rows in one shot. Any active
 * Stripe subscription is cancelled first so billing stops.
 */
export async function POST() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = data.claims.sub;
  const admin = createAdminClient();

  const { data: preferences } = await admin
    .from("11s_preferences")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();

  const stripe = getStripe();
  if (stripe && preferences?.stripe_customer_id) {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: preferences.stripe_customer_id,
        status: "all",
        limit: 100,
      });
      for (const subscription of subscriptions.data) {
        if (subscription.status === "active" || subscription.status === "trialing" || subscription.status === "past_due") {
          await stripe.subscriptions.cancel(subscription.id);
        }
      }
      await stripe.customers.del(preferences.stripe_customer_id).catch(() => {
        // Customer cleanup is best effort; the account deletion proceeds.
      });
    } catch (stripeError) {
      console.error("Could not cancel Stripe subscription on delete", stripeError);
    }
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
  if (deleteError) {
    console.error("Account deletion failed", deleteError);
    return Response.json(
      { error: "Account deletion failed." },
      { status: 500 },
    );
  }

  return Response.json({ deleted: true });
}
