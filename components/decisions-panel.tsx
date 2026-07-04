"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Decision } from "@/lib/meeting-notes/repository";
import type { DecisionFormState } from "@/lib/meeting-notes/validation";

type DecisionsPanelProps = {
  action: (
    state: DecisionFormState,
    payload: FormData,
  ) => Promise<DecisionFormState>;
  decisions: Decision[];
  initialState: DecisionFormState;
};

export function DecisionsPanel({
  action,
  decisions,
  initialState,
}: DecisionsPanelProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <section className="space-y-5 rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Decisions
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">Decisions</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Capture the decisions that should survive beyond the raw notes.
        </p>
      </div>

      <div className="space-y-3">
        {decisions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 bg-background/80 p-5">
            <p className="text-sm font-medium text-foreground">No decisions saved yet.</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Add the outcomes, approvals, or commitments that came out of this 1:1.
            </p>
          </div>
        ) : (
          decisions.map((decision, index) => (
            <article
              key={decision.id}
              className="rounded-2xl border border-border/70 bg-background p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Decision {index + 1}
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground">{decision.body}</p>
            </article>
          ))
        )}
      </div>

      <form action={formAction} className="space-y-4 rounded-2xl border border-border/70 bg-background p-4">
        <div className="grid gap-2">
          <Label htmlFor="body">Decision</Label>
          <textarea
            id="body"
            name="body"
            defaultValue={state.values.body}
            rows={4}
            aria-invalid={Boolean(state.fieldErrors.body)}
            aria-describedby={state.fieldErrors.body ? "decision-body-error" : undefined}
            className="flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            placeholder="Approved the pilot scope and agreed to revisit pricing next Friday."
          />
          {state.fieldErrors.body ? (
            <p id="decision-body-error" className="text-sm text-destructive">
              {state.fieldErrors.body}
            </p>
          ) : null}
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
      {pending ? "Saving decision..." : "Add decision"}
    </Button>
  );
}
