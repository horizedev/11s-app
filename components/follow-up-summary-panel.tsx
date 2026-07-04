"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { FollowUpSummaryState } from "@/lib/ai/state";

type FollowUpSummaryPanelProps = {
  generateAction: (
    state: FollowUpSummaryState,
    payload: FormData,
  ) => Promise<FollowUpSummaryState>;
  copyEventAction: () => Promise<void>;
  initialState: FollowUpSummaryState;
};

export function FollowUpSummaryPanel({
  generateAction,
  copyEventAction,
  initialState,
}: FollowUpSummaryPanelProps) {
  const [state, formAction] = useActionState(generateAction, initialState);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const summary = state.summary ?? "";
  const plainPreview = useMemo(() => summary.replace(/^#+\s+/gm, "").trim(), [summary]);

  async function copySummary() {
    if (!summary) {
      return;
    }

    try {
      await navigator.clipboard.writeText(summary);
      setCopyStatus("copied");
      await copyEventAction();
    } catch {
      setCopyStatus("failed");
    }
  }

  return (
    <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Follow-up
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">Follow-up summary</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Generate a shareable markdown summary. Private notes are excluded by default.
        </p>
      </div>

      <form action={formAction} className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="grid gap-2 sm:w-64">
          <Label htmlFor="summaryTone">Tone</Label>
          <select
            id="summaryTone"
            name="tone"
            defaultValue={state.values.tone}
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="professional">Professional</option>
            <option value="concise">Concise</option>
            <option value="warm">Warm</option>
          </select>
        </div>
        <GenerateSummaryButton hasSummary={Boolean(summary)} />
      </form>

      {state.formError ? (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {state.formError}
        </p>
      ) : null}

      <div className="mt-6 rounded-2xl border border-border/70 bg-background p-4">
        {summary ? (
          <div className="space-y-4">
            <pre className="max-h-80 whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
              {plainPreview}
            </pre>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" variant="outline" onClick={copySummary}>
                Copy summary
              </Button>
              {copyStatus === "copied" ? (
                <p className="text-sm text-muted-foreground">Copied markdown summary.</p>
              ) : null}
              {copyStatus === "failed" ? (
                <p className="text-sm text-destructive">Copy failed. Select the text and copy manually.</p>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/70 bg-card/60 p-5">
            <p className="text-sm font-medium text-foreground">No summary generated yet.</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Add notes, decisions, or action items, then generate a follow-up summary.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function GenerateSummaryButton({ hasSummary }: { hasSummary: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Generating summary..." : hasSummary ? "Regenerate summary" : "Generate summary"}
    </Button>
  );
}
