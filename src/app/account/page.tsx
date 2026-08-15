import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AccountPage } from "@/components/account-page";
import {
  isReferralPro,
  planFromPreferences,
  subscriptionStatusFromPreferences,
} from "@/lib/billing";
import { createClient } from "@/lib/supabase/server";
import { loadPrepQuota } from "@/lib/workspace-data";

export const metadata: Metadata = {
  title: "Plan status — 11s / 訂閱狀態",
  description: "View your 11s subscription plan and usage. 查看你的 11s 訂閱方案與使用量。",
};

export default async function AccountRoute() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/login?next=/account");
  }

  const [
    { data: preferences },
    { count: peopleCount },
    { count: referralCount },
  ] = await Promise.all([
    supabase
      .from("11s_preferences")
      .select(
        "plan, subscription_status, current_period_end, stripe_customer_id, referral_redeemed_count, is_admin",
      )
      .eq("user_id", data.claims.sub)
      .maybeSingle(),
    supabase
      .from("11s_people")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("11s_referrals")
      .select("id", { count: "exact", head: true }),
  ]);

  const plan = planFromPreferences(preferences);
  const prepQuota = await loadPrepQuota(supabase, plan);

  const headerList = await headers();
  const host =
    headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "";
  const proto = headerList.get("x-forwarded-proto") ?? "https";
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ?? (host ? `${proto}://${host}` : "");
  const referralLink = `${origin}/?ref=${data.claims.sub}`;

  const planIsReferral = isReferralPro(preferences);
  const rawStatus = subscriptionStatusFromPreferences(preferences);
  // An expired referral period still reads "active" in the raw row; show it
  // as no subscription once it has lapsed.
  const status =
    plan === "free" &&
    !preferences?.stripe_customer_id &&
    (rawStatus === "active" || rawStatus === "trialing")
      ? "none"
      : rawStatus;

  return (
    <AccountPage
      plan={plan}
      status={status}
      currentPeriodEnd={preferences?.current_period_end ?? null}
      planIsReferral={planIsReferral}
      referralLink={referralLink}
      referralCount={referralCount ?? 0}
      referralRedeemed={preferences?.referral_redeemed_count ?? 0}
      peopleCount={peopleCount ?? 0}
      prepQuota={prepQuota}
      userEmail={
        typeof data.claims.email === "string" ? data.claims.email : undefined
      }
      isAdmin={preferences?.is_admin === true}
    />
  );
}
