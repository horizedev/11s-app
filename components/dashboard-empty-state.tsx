import Link from "next/link";

import { Button } from "@/components/ui/button";

export function DashboardEmptyState() {
  return (
    <section className="rounded-3xl border border-border/60 bg-card/95 p-8 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            First meeting
          </p>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Prepare your next 1:1
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              Start with one person and keep your agenda, notes, and action
              items together from the first meeting onward.
            </p>
          </div>
        </div>
        <Button asChild size="lg">
          <Link href="/app/relationships/new">Create your first 1:1</Link>
        </Button>
      </div>
    </section>
  );
}
