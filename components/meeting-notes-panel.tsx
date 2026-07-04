"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { MeetingNotesFormState } from "@/lib/meeting-notes/validation";

type MeetingNotesPanelProps = {
  action: (
    state: MeetingNotesFormState,
    payload: FormData,
  ) => Promise<MeetingNotesFormState>;
  initialState: MeetingNotesFormState;
};

export function MeetingNotesPanel({
  action,
  initialState,
}: MeetingNotesPanelProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-3xl border border-border/70 bg-card p-6 shadow-sm"
    >
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Notes
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">Meeting notes</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Save the shareable recap for follow-up, then keep separate private notes
          for context you do not want copied into a summary by default.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="shareableNotes">Shareable notes</Label>
          <textarea
            id="shareableNotes"
            name="shareableNotes"
            defaultValue={state.values.shareableNotes}
            rows={6}
            className="flex min-h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            placeholder="Recap what you covered, follow-up context, and anything safe to share back out."
          />
        </div>

        <div className="grid gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <Label htmlFor="privateNotes">Private notes</Label>
          <textarea
            id="privateNotes"
            name="privateNotes"
            defaultValue={state.values.privateNotes}
            rows={6}
            className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            placeholder="Keep sensitive coaching notes, tone, or context here."
          />
          <p className="text-sm leading-6 text-muted-foreground">
            Private notes stay out of follow-up summaries by default.
          </p>
        </div>
      </div>

      {state.formError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {state.formError}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? "Saving notes..." : "Save notes"}
    </Button>
  );
}
