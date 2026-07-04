import Link from "next/link";

import { Button } from "@/components/ui/button";

type DashboardRelationship = {
  id: string;
  personName: string;
  relationshipTypeLabel: string;
  cadenceLabel: string | null;
  personContext: string | null;
  relationshipGoal: string | null;
};

export function DashboardRelationshipsList({
  relationships,
}: {
  relationships: DashboardRelationship[];
}) {
  return (
    <section className="space-y-6 rounded-3xl border border-border/60 bg-card/95 p-8 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Workspace
          </p>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Your relationships
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Open any relationship to prepare the next 1:1, review context,
              and keep continuity across meetings.
            </p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href="/app/relationships/new">Create another 1:1</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {relationships.map((relationship) => (
          <article
            key={relationship.id}
            className="rounded-2xl border border-border/70 bg-background p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold tracking-tight">
                  {relationship.personName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {relationship.relationshipTypeLabel}
                  {relationship.cadenceLabel
                    ? ` • ${relationship.cadenceLabel}`
                    : ""}
                </p>
              </div>
              <Link
                href={`/app/relationships/${relationship.id}`}
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                aria-label={`Open ${relationship.personName}`}
              >
                Open
              </Link>
            </div>

            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                {relationship.personContext ??
                  relationship.relationshipGoal ??
                  "No meeting context added yet. Open this relationship to continue building it."}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
