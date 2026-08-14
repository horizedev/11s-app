import type { Metadata } from "next";

import { PricingPage } from "@/components/pricing-page";
import { planFromPreferences } from "@/lib/billing";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Pricing — 11s / 方案與價格",
  description:
    "Free for a few conversations that matter; Pro for everyone you keep close. 免費照顧最重要的對話,Pro 給每一位你在乎的人。",
};

export default async function PricingRoute() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  let signedIn = false;
  let plan: "free" | "pro" = "free";

  if (data?.claims?.sub) {
    signedIn = true;
    const { data: preferences } = await supabase
      .from("11s_preferences")
      .select("plan, subscription_status, stripe_customer_id, current_period_end")
      .eq("user_id", data.claims.sub)
      .maybeSingle();
    plan = planFromPreferences(preferences);
  }

  return <PricingPage signedIn={signedIn} plan={plan} />;
}
