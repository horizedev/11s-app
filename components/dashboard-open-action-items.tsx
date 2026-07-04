"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { ActionItem } from "@/lib/action-items/repository";

export type DashboardActionItemGroup = {
  relationshipId: string;
  relationshipName: string;
  items: ActionItem[];
};

export function DashboardOpenActionItems({
  completeAction,
  groups,
}: {
  completeAction: (actionItemId: string) => Promise<void>;
  groups: DashboardActionItemGroup[];
}) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6 rounded-3xl border border-border/60 bg-card/95 p-8 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Follow-through
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">Open action items</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Keep the outstanding commitments visible before the next 1:1 slips onto the calendar.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {groups.map((group) => (
          <article
            key={group.relationshipId}
            className="space-y-4 rounded-2xl border border-border/70 bg-background p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold tracking-tight">
                  {group.relationshipName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {group.items.length} open {group.items.length === 1 ? "item" : "items"}
                </p>
              </div>
              <Link
                href={`/app/relationships/${group.relationshipId}`}
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Open relationship
              </Link>
            </div>

            <div className="space-y-3">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.ownerLabel}
                      {item.dueDate
                        ? ` • Due ${new Date(item.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}`
                        : ""}
                    </p>
                  </div>
                  <form action={completeAction.bind(null, item.id)}>
                    <Button type="submit" variant="outline" size="sm">
                      Mark complete
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
