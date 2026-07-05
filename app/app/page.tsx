import { redirect } from "next/navigation";
import { Suspense } from "react";

import { completeActionItemAction } from "@/app/app/actions";
import { BillingStatusCard } from "@/components/billing-status-card";
import { DashboardOpenActionItems } from "@/components/dashboard-open-action-items";
import { DashboardEmptyState } from "@/components/dashboard-empty-state";
import { DashboardRelationshipsList } from "@/components/dashboard-relationships-list";
import { listOpenActionItems } from "@/lib/action-items/repository";
import { getProtectedRouteRedirect } from "@/lib/auth/access";
import { getBillingUsage } from "@/lib/billing/repository";
import { listActiveRelationships } from "@/lib/relationships/repository";
import { createClient } from "@/lib/supabase/server";

async function DashboardContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const redirectTarget = getProtectedRouteRedirect({
    pathname: "/app",
    hasUser: Boolean(user),
  });

  if (redirectTarget) {
    redirect(redirectTarget);
  }

  if (!user) {
    redirect("/auth/login?next=%2Fapp");
  }

  const [relationships, openActionItems, usage] = await Promise.all([
    listActiveRelationships({
      supabase,
      userId: user.id,
    }),
    listOpenActionItems({
      supabase,
      userId: user.id,
    }),
    getBillingUsage({
      supabase,
      userId: user.id,
    }),
  ]);
  const relationshipNames = new Map(
    relationships.map((relationship) => [relationship.id, relationship.personName]),
  );
  const actionItemGroups = Array.from(
    openActionItems.reduce((groups, item) => {
      const relationshipName = relationshipNames.get(item.relationshipId);

      if (!relationshipName) {
        return groups;
      }

      const group = groups.get(item.relationshipId);

      if (group) {
        group.items.push(item);
        return groups;
      }

      groups.set(item.relationshipId, {
        relationshipId: item.relationshipId,
        relationshipName,
        items: [item],
      });

      return groups;
    }, new Map<string, {
      relationshipId: string;
      relationshipName: string;
      items: typeof openActionItems;
    }>()).values(),
  );

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          {user?.email ? `Welcome back, ${user.email}` : "Welcome to 11s"}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Track the relationships that matter, prepare the next 1:1, and keep
          the context that should follow you from one meeting to the next.
        </p>
      </div>
      <BillingStatusCard usage={usage} />
      {relationships.length > 0 ? (
        <>
          <DashboardOpenActionItems
            completeAction={completeActionItemAction.bind(null, "/app")}
            groups={actionItemGroups}
          />
          <DashboardRelationshipsList relationships={relationships} />
        </>
      ) : (
        <DashboardEmptyState />
      )}
    </section>
  );
}

function DashboardFallback() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Loading your workspace...</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          11s is checking your session and preparing your recurring 1:1 workspace.
        </p>
      </div>
      <DashboardEmptyState />
    </section>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
          Dashboard
        </p>
      </div>
      <Suspense fallback={<DashboardFallback />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
