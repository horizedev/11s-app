"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RELATIONSHIP_CADENCE_LABELS,
  RELATIONSHIP_CADENCES,
  RELATIONSHIP_TYPE_LABELS,
  RELATIONSHIP_TYPES,
} from "@/lib/relationships/types";
import type { RelationshipFormState } from "@/lib/relationships/validation";

type RelationshipFormProps = {
  action: (
    state: RelationshipFormState,
    payload: FormData,
  ) => Promise<RelationshipFormState>;
  initialState: RelationshipFormState;
};

export function RelationshipForm({
  action,
  initialState,
}: RelationshipFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <div className="inline-flex rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          First relationship
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Create your first 1:1
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Start with the person you meet most often. You can add the meeting
            context now and fill in the deeper notes once the relationship is
            saved.
          </p>
        </div>
      </div>

      <form
        action={formAction}
        className="space-y-6 rounded-3xl border border-border/70 bg-card p-6 shadow-sm"
      >
        <div className="grid gap-2">
          <Label htmlFor="personName">Person name</Label>
          <Input
            id="personName"
            name="personName"
            defaultValue={state.values.personName}
            aria-invalid={Boolean(state.fieldErrors.personName)}
            aria-describedby={state.fieldErrors.personName ? "personName-error" : undefined}
            placeholder="Alex Morgan"
            required
          />
          {state.fieldErrors.personName ? (
            <p id="personName-error" className="text-sm text-destructive">
              {state.fieldErrors.personName}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="relationshipType">Relationship type</Label>
          <select
            id="relationshipType"
            name="relationshipType"
            defaultValue={state.values.relationshipType}
            aria-invalid={Boolean(state.fieldErrors.relationshipType)}
            aria-describedby={
              state.fieldErrors.relationshipType
                ? "relationshipType-error"
                : undefined
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            required
          >
            <option value="">Select one</option>
            {RELATIONSHIP_TYPES.map((type) => (
              <option key={type} value={type}>
                {RELATIONSHIP_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
          {state.fieldErrors.relationshipType ? (
            <p id="relationshipType-error" className="text-sm text-destructive">
              {state.fieldErrors.relationshipType}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="personContext">Role or context</Label>
          <Input
            id="personContext"
            name="personContext"
            defaultValue={state.values.personContext}
            placeholder="Design manager on the growth team"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="relationshipGoal">Relationship goal</Label>
          <textarea
            id="relationshipGoal"
            name="relationshipGoal"
            defaultValue={state.values.relationshipGoal}
            rows={4}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Build trust, align on priorities, and keep career growth visible."
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="cadence">Meeting cadence</Label>
          <select
            id="cadence"
            name="cadence"
            defaultValue={state.values.cadence}
            aria-invalid={Boolean(state.fieldErrors.cadence)}
            aria-describedby={state.fieldErrors.cadence ? "cadence-error" : undefined}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">No cadence yet</option>
            {RELATIONSHIP_CADENCES.map((cadence) => (
              <option key={cadence} value={cadence}>
                {RELATIONSHIP_CADENCE_LABELS[cadence]}
              </option>
            ))}
          </select>
          {state.fieldErrors.cadence ? (
            <p id="cadence-error" className="text-sm text-destructive">
              {state.fieldErrors.cadence}
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
      {pending ? "Saving relationship..." : "Save relationship"}
    </Button>
  );
}
