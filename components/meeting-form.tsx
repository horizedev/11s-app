"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MeetingFormState } from "@/lib/meetings/validation";

type MeetingFormProps = {
  action: (
    state: MeetingFormState,
    payload: FormData,
  ) => Promise<MeetingFormState>;
  initialState: MeetingFormState;
  relationshipName: string;
};

export function MeetingForm({
  action,
  initialState,
  relationshipName,
}: MeetingFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <div className="inline-flex rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Draft meeting
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Prepare the next 1:1
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Start a draft meeting for {relationshipName}. You can add the date
            or purpose now and fill in agenda items once the meeting is ready.
          </p>
        </div>
      </div>

      <form
        action={formAction}
        className="space-y-6 rounded-3xl border border-border/70 bg-card p-6 shadow-sm"
      >
        <div className="grid gap-2">
          <Label htmlFor="purpose">Meeting purpose</Label>
          <Input
            id="purpose"
            name="purpose"
            defaultValue={state.values.purpose}
            placeholder="Promotion check-in, weekly sync, or reconnect after a gap"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="scheduledAt">Meeting date and time</Label>
          <Input
            id="scheduledAt"
            name="scheduledAt"
            type="datetime-local"
            defaultValue={state.values.scheduledAt}
            aria-invalid={Boolean(state.fieldErrors.scheduledAt)}
            aria-describedby={state.fieldErrors.scheduledAt ? "scheduledAt-error" : undefined}
          />
          {state.fieldErrors.scheduledAt ? (
            <p id="scheduledAt-error" className="text-sm text-destructive">
              {state.fieldErrors.scheduledAt}
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
      {pending ? "Creating draft meeting..." : "Create draft meeting"}
    </Button>
  );
}
