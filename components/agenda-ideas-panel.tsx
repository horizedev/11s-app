"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AGENDA_ITEM_CATEGORY_LABELS } from "@/lib/agenda/types";
import type { AgendaIdeasState } from "@/lib/ai/state";

type AgendaIdeasPanelProps = {
  generateAction: (state: AgendaIdeasState, payload: FormData) => Promise<AgendaIdeasState>;
  addAction: (payload: FormData) => Promise<void>;
  initialState: AgendaIdeasState;
};

export function AgendaIdeasPanel({
  generateAction,
  addAction,
  initialState,
}: AgendaIdeasPanelProps) {
  const [state, formAction] = useActionState(generateAction, initialState);

  return (
    <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          AI assist
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">AI agenda ideas</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Generate context-aware conversation ideas. If generation fails, manual agenda entry still works.
        </p>
      </div>

      <form action={formAction} className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="grid gap-2">
          <Label htmlFor="agendaIdeaPrompt">Optional prompt</Label>
          <input
            id="agendaIdeaPrompt"
            name="prompt"
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            placeholder="Help me discuss promotion, blockers, or reconnecting."
          />
        </div>
        <GenerateButton />
      </form>

      {state.formError ? (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {state.formError}
        </p>
      ) : null}

      <div className="mt-6 space-y-3">
        {state.ideas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 bg-background/80 p-5">
            <p className="text-sm font-medium text-foreground">No AI ideas generated yet.</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Generate ideas or keep adding agenda items manually.
            </p>
          </div>
        ) : (
          state.ideas.map((idea) => (
            <article key={`${idea.category}-${idea.title}`} className="rounded-2xl border border-border/70 bg-background p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    {AGENDA_ITEM_CATEGORY_LABELS[idea.category]}
                  </p>
                  <h3 className="text-base font-semibold text-foreground">{idea.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{idea.description}</p>
                </div>
                <form action={addAction}>
                  <input type="hidden" name="title" value={idea.title} />
                  <input type="hidden" name="description" value={idea.description} />
                  <input type="hidden" name="category" value={idea.category} />
                  <input type="hidden" name="source" value="ai" />
                  <Button type="submit" variant="outline" size="sm">
                    Add to agenda
                  </Button>
                </form>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function GenerateButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="self-end" disabled={pending}>
      {pending ? "Generating..." : "Generate ideas"}
    </Button>
  );
}
