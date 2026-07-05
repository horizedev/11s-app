"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import type { PrepBriefState } from "@/lib/ai/state";

type AiPrepBriefPanelProps = {
  copyEventAction: () => Promise<void>;
  generateAction: (state: PrepBriefState, payload: FormData) => Promise<PrepBriefState>;
  initialState: PrepBriefState;
  isPro: boolean;
};

export function AiPrepBriefPanel({
  copyEventAction,
  generateAction,
  initialState,
  isPro,
}: AiPrepBriefPanelProps) {
  const [state, formAction] = useActionState(generateAction, initialState);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const brief = state.brief;

  async function copyBrief() {
    if (!brief) {
      return;
    }

    try {
      await navigator.clipboard.writeText(brief.contentMarkdown);
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
          AI assist
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">AI Prep Brief</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Generate a relationship-aware prep brief before this 1:1.
        </p>
      </div>

      {isPro ? (
        <form action={formAction} className="mt-5 space-y-4">
          <label className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/80 p-4">
            <input
              type="checkbox"
              name="includePrivateNotes"
              defaultChecked={state.values.includePrivateNotes}
              className="mt-1 h-4 w-4 rounded border-input"
            />
            <span className="space-y-1">
              <span className="block text-sm font-medium text-foreground">
                Include my private notes for this generation
              </span>
              <span className="block text-sm leading-6 text-muted-foreground">
                Private notes stay opt-in and should not be suggested for sharing verbatim.
              </span>
            </span>
          </label>
          <GeneratePrepBriefButton hasBrief={Boolean(brief)} />
        </form>
      ) : (
        <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm leading-6 text-foreground">
            AI Prep Brief is a Pro feature. Upgrade to turn your relationship history,
            notes, and open actions into a focused 1:1 prep plan.
          </p>
          <Button asChild className="mt-4" variant="outline">
            <Link href="/app/billing">Upgrade to Pro</Link>
          </Button>
        </div>
      )}

      {state.formError ? (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {state.formError}
        </p>
      ) : null}

      <div className="mt-6 rounded-2xl border border-border/70 bg-background p-4">
        {brief ? (
          <div className="space-y-4">
            <pre className="max-h-96 whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
              {brief.contentMarkdown}
            </pre>
            {brief.includedPrivateNotes ? (
              <p className="text-sm text-muted-foreground">
                Private notes included in this generation.
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" variant="outline" onClick={copyBrief}>
                Copy prep brief
              </Button>
              {copyStatus === "copied" ? (
                <p className="text-sm text-muted-foreground">Copied markdown prep brief.</p>
              ) : null}
              {copyStatus === "failed" ? (
                <p className="text-sm text-destructive">
                  Copy failed. Select the markdown and copy it manually.
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/70 bg-card/60 p-5">
            <p className="text-sm font-medium text-foreground">No prep brief generated yet.</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Generate a brief to pull together relationship context, open loops, and
              suggested questions before the meeting.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function GeneratePrepBriefButton({ hasBrief }: { hasBrief: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending
        ? "Generating prep brief..."
        : hasBrief
          ? "Regenerate prep brief"
          : "Generate prep brief"}
    </Button>
  );
}
