"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { ActionItem } from "@/lib/action-items/repository";
import {
  ACTION_ITEM_OWNER_LABELS,
  ACTION_ITEM_OWNERS,
} from "@/lib/action-items/types";
import type { ActionItemFormState } from "@/lib/action-items/validation";

type ActionItemsPanelProps = {
  action: (
    state: ActionItemFormState,
    payload: FormData,
  ) => Promise<ActionItemFormState>;
  completeAction: (actionItemId: string) => Promise<void>;
  initialState: ActionItemFormState;
  items: ActionItem[];
};

export function ActionItemsPanel({
  action,
  completeAction,
  initialState,
  items,
}: ActionItemsPanelProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Follow-through
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">Action items</h2>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Track the commitments that should survive beyond this meeting and
            close them out as they happen.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/70 bg-background/80 p-5">
              <p className="text-sm font-medium text-foreground">No action items yet.</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Capture the next step, who owns it, and when it should be done.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-border/70 bg-background p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
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
                    {item.notes ? (
                      <p className="text-sm leading-6 text-muted-foreground">{item.notes}</p>
                    ) : null}
                  </div>
                  {item.status === "open" ? (
                    <form action={completeAction.bind(null, item.id)}>
                      <Button type="submit" variant="outline" size="sm">
                        Mark complete
                      </Button>
                    </form>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      <form
        action={formAction}
        className="space-y-5 rounded-3xl border border-border/70 bg-card p-6 shadow-sm"
      >
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight">Add action item</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            Save the follow-up work before it slips into chat history or memory.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="title">Action item</Label>
          <textarea
            id="title"
            name="title"
            defaultValue={state.values.title}
            rows={3}
            aria-invalid={Boolean(state.fieldErrors.title)}
            aria-describedby={state.fieldErrors.title ? "action-title-error" : undefined}
            className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            placeholder="Send the pricing recap with enterprise packaging options."
          />
          {state.fieldErrors.title ? (
            <p id="action-title-error" className="text-sm text-destructive">
              {state.fieldErrors.title}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="owner">Owner</Label>
          <select
            id="owner"
            name="owner"
            defaultValue={state.values.owner}
            aria-invalid={Boolean(state.fieldErrors.owner)}
            aria-describedby={state.fieldErrors.owner ? "action-owner-error" : undefined}
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {ACTION_ITEM_OWNERS.map((owner) => (
              <option key={owner} value={owner}>
                {ACTION_ITEM_OWNER_LABELS[owner]}
              </option>
            ))}
          </select>
          {state.fieldErrors.owner ? (
            <p id="action-owner-error" className="text-sm text-destructive">
              {state.fieldErrors.owner}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="dueDate">Due date</Label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={state.values.dueDate}
            aria-invalid={Boolean(state.fieldErrors.dueDate)}
            aria-describedby={state.fieldErrors.dueDate ? "action-dueDate-error" : undefined}
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
          {state.fieldErrors.dueDate ? (
            <p id="action-dueDate-error" className="text-sm text-destructive">
              {state.fieldErrors.dueDate}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            name="notes"
            defaultValue={state.values.notes}
            rows={4}
            className="flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            placeholder="Add supporting context, blockers, or dependencies."
          />
        </div>

        {state.formError ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {state.formError}
          </p>
        ) : null}

        <SubmitButton />
      </form>
    </section>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? "Saving action item..." : "Add action item"}
    </Button>
  );
}
