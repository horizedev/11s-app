import { Suspense } from "react";

import { openCustomerPortalAction, startCheckoutAction } from "@/app/app/billing/actions";
import { BillingStatusCard } from "@/components/billing-status-card";
import { PlanComparison } from "@/components/plan-comparison";
import { getBillingUsage } from "@/lib/billing/repository";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type BillingPageProps = {
  searchParams: Promise<{
    checkout?: string;
    portal?: string;
  }>;
};

async function BillingContent({ searchParams }: BillingPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=%2Fapp%2Fbilling");
  }

  const usage = await getBillingUsage({ supabase, userId: user.id });

  return (
    <div className="space-y-8">
      {params.checkout === "success" ? (
        <Notice title="Checkout started" body="Stripe is processing your subscription. Your Pro access will appear here after the webhook confirms payment." />
      ) : null}
      {params.checkout === "cancelled" ? (
        <Notice title="Checkout cancelled" body="No changes were made. You can upgrade to Pro whenever you are ready." />
      ) : null}
      {params.portal === "missing-customer" ? (
        <Notice title="No Stripe customer yet" body="Start a Pro subscription first, then billing management will be available here." />
      ) : null}
      <BillingStatusCard usage={usage} />
      <PlanComparison
        isPro={usage.plan === "pro"}
        onSubscribe={startCheckoutAction}
        onManage={openCustomerPortalAction}
      />
    </div>
  );
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-2xl border border-border/70 bg-secondary/40 p-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p>
    </section>
  );
}

function BillingFallback() {
  return (
    <section className="rounded-3xl border border-border/70 bg-card p-8 shadow-sm">
      <div className="h-6 w-40 rounded-2xl bg-muted" />
      <div className="mt-4 h-24 rounded-2xl bg-muted" />
    </section>
  );
}

export default function BillingPage(props: BillingPageProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Billing</p>
        <h1 className="text-3xl font-semibold tracking-tight">Plan and billing</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Upgrade to Pro, review your usage, and manage your Stripe subscription.
        </p>
      </div>
      <Suspense fallback={<BillingFallback />}>
        <BillingContent {...props} />
      </Suspense>
    </div>
  );
}
