import { completeActionItemAction } from "@/app/app/actions";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DashboardOpenActionItems } from "@/components/dashboard-open-action-items";
import { listOpenActionItemsByRelationship } from "@/lib/action-items/repository";
import { createClient } from "@/lib/supabase/server";
import { getRelationshipById } from "@/lib/relationships/repository";

type RelationshipDetailPageProps = {
  params: Promise<{
    relationshipId: string;
  }>;
};

async function RelationshipDetailContent({
  params,
}: RelationshipDetailPageProps) {
  const { relationshipId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const relationship = await getRelationshipById({
    relationshipId,
    supabase,
    userId: user.id,
  });

  if (!relationship) {
    notFound();
  }

  const openActionItems = await listOpenActionItemsByRelationship({
    relationshipId,
    supabase,
    userId: user.id,
  });

  return (
    <>
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {relationship.personName}
        </h1>
        <p className="text-base text-muted-foreground">
          {relationship.relationshipTypeLabel}
          {relationship.cadenceLabel ? ` • ${relationship.cadenceLabel}` : ""}
        </p>
      </div>

      <section className="grid gap-4 rounded-3xl border border-border/70 bg-card p-6 shadow-sm sm:grid-cols-2">
        <InfoBlock
          label="Role or context"
          value={relationship.personContext ?? "No context added yet."}
        />
        <InfoBlock
          label="Relationship goal"
          value={
            relationship.relationshipGoal ??
            "No relationship goal added yet."
          }
        />
      </section>

      <section className="rounded-3xl border border-dashed border-border bg-background/70 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Relationship created
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
              This relationship is ready for meeting prep. Start the next 1:1
              and build the agenda from there.
            </p>
          </div>
          <Button asChild>
            <Link href={`/app/relationships/${relationship.id}/meetings/new`}>
              Prepare next 1:1
            </Link>
          </Button>
        </div>
      </section>

      <DashboardOpenActionItems
        completeAction={completeActionItemAction.bind(
          null,
          `/app/relationships/${relationshipId}`,
        )}
        groups={[
          {
            relationshipId,
            relationshipName: relationship.personName,
            items: openActionItems,
          },
        ]}
      />
    </>
  );
}

function RelationshipDetailFallback() {
  return (
    <>
      <div className="space-y-3">
        <div className="h-10 w-64 rounded-2xl bg-muted" />
        <div className="h-5 w-40 rounded-2xl bg-muted" />
      </div>

      <section className="grid gap-4 rounded-3xl border border-border/70 bg-card p-6 shadow-sm sm:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-border/70 bg-background p-4">
          <div className="h-4 w-32 rounded-2xl bg-muted" />
          <div className="h-16 rounded-2xl bg-muted" />
        </div>
        <div className="space-y-3 rounded-2xl border border-border/70 bg-background p-4">
          <div className="h-4 w-32 rounded-2xl bg-muted" />
          <div className="h-16 rounded-2xl bg-muted" />
        </div>
      </section>
    </>
  );
}

export default function RelationshipDetailPage({
  params,
}: RelationshipDetailPageProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
          Relationship
        </p>
      </div>
      <Suspense fallback={<RelationshipDetailFallback />}>
        <RelationshipDetailContent params={params} />
      </Suspense>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2 rounded-2xl border border-border/70 bg-background p-4">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <p className="text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  );
}
