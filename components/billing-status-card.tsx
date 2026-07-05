import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EntitlementSnapshot } from "@/lib/billing/entitlements";
import { PLAN_LABELS } from "@/lib/billing/plans";

export function BillingStatusCard({ usage }: { usage: EntitlementSnapshot }) {
  const isPro = usage.plan === "pro";

  return (
    <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Billing
            </p>
            <Badge variant={isPro ? "default" : "secondary"}>
              {PLAN_LABELS[usage.plan]}
            </Badge>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              {isPro ? "Pro workspace enabled" : "Free workspace"}
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {isPro
                ? "Unlimited relationships and meetings, with 100 AI generations each month."
                : "Free includes 1 relationship, 3 meetings, and 5 AI generations each month."}
            </p>
          </div>
        </div>
        <Button asChild variant={isPro ? "outline" : "default"}>
          <Link href="/app/billing">{isPro ? "Manage billing" : "Upgrade to Pro"}</Link>
        </Button>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <UsageStat label="Relationships" value={formatUsage(usage.activeRelationships, usage.relationshipLimit)} />
        <UsageStat label="Meetings" value={formatUsage(usage.totalMeetings, usage.meetingLimit)} />
        <UsageStat label="AI this month" value={formatUsage(usage.monthlyAiGenerations, usage.aiGenerationLimit)} />
      </div>
    </section>
  );
}

function UsageStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function formatUsage(value: number, limit: number | null) {
  return limit === null ? `${value} / unlimited` : `${value} / ${limit}`;
}
