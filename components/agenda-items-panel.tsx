"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildAgendaMarkdown } from "@/lib/ai/generation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AgendaItem } from "@/lib/agenda/repository";
import type { AgendaItemFormState } from "@/lib/agenda/validation";
import { AGENDA_ITEM_CATEGORY_LABELS, AGENDA_ITEM_CATEGORIES } from "@/lib/agenda/types";

type AgendaItemsPanelProps = {
  action: (
    state: AgendaItemFormState,
    payload: FormData,
  ) => Promise<AgendaItemFormState>;
  initialState: AgendaItemFormState;
  items: AgendaItem[];
  relationshipName?: string;
  meetingPurpose?: string | null;
};

export function AgendaItemsPanel({
  action,
  initialState,
  items,
  relationshipName = "this 1:1",
  meetingPurpose = null,
}: AgendaItemsPanelProps) {
  const [state, formAction] = useActionState(action, initialState);
  const agendaMarkdown = buildAgendaMarkdown({
    relationshipName,
    meetingPurpose,
    agendaItems: items,
  });

  return (
    <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Agenda
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">Agenda</h2>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Capture the talking points for this 1:1 before the conversation starts.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border border-border/70 bg-background p-4">
            <Label htmlFor="agendaMarkdown">Copy agenda markdown/plain text</Label>
            <textarea
              id="agendaMarkdown"
              readOnly
              rows={Math.max(4, items.length + 2)}
              value={agendaMarkdown}
              className="mt-2 flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
            />
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Select and copy this agenda for email, docs, or chat.
            </p>
          </div>
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/70 bg-background/80 p-5">
              <p className="text-sm font-medium text-foreground">No agenda items yet.</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Start with the top priority topic, blocker, or decision you want to cover.
              </p>
            </div>
          ) : (
            items.map((item, index) => (
              <article
                key={item.id}
                className="rounded-2xl border border-border/70 bg-background p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        Item {index + 1}
                      </span>
                      {item.categoryLabel ? (
                        <Badge variant="outline">{item.categoryLabel}</Badge>
                      ) : null}
                      {item.isDiscussed ? (
                        <Badge variant="secondary">Discussed</Badge>
                      ) : null}
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                  </div>
                </div>
                {item.description ? (
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}
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
          <h3 className="text-lg font-semibold tracking-tight">Add agenda item</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            Save the key talking points in the order you want to cover them.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="title">Agenda item</Label>
          <Input
            id="title"
            name="title"
            defaultValue={state.values.title}
            placeholder="Discuss launch blockers"
            aria-invalid={Boolean(state.fieldErrors.title)}
            aria-describedby={state.fieldErrors.title ? "agenda-title-error" : undefined}
          />
          {state.fieldErrors.title ? (
            <p id="agenda-title-error" className="text-sm text-destructive">
              {state.fieldErrors.title}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Details</Label>
          <textarea
            id="description"
            name="description"
            defaultValue={state.values.description}
            rows={4}
            className="flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            placeholder="Add helpful context, decisions to make, or specific follow-up you need."
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            defaultValue={state.values.category}
            aria-invalid={Boolean(state.fieldErrors.category)}
            aria-describedby={state.fieldErrors.category ? "agenda-category-error" : undefined}
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="">No category</option>
            {AGENDA_ITEM_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {AGENDA_ITEM_CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
          {state.fieldErrors.category ? (
            <p id="agenda-category-error" className="text-sm text-destructive">
              {state.fieldErrors.category}
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
      {pending ? "Saving agenda item..." : "Add agenda item"}
    </Button>
  );
}
