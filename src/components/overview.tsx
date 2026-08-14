"use client";

import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  MessageCircle,
  MessageSquareText,
  NotebookPen,
  Plus,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import {
  Avatar,
  RelationshipPill,
  TinyArrow,
} from "@/components/ui-kit";
import { Hint } from "@/components/hint";
import { useLocale } from "@/lib/i18n";
import type { GeneralPrep, Person } from "@/lib/types";
import {
  cn,
  countNoteLines,
  formatHistoryDate,
  formatMeetingDate,
  getLastMeetingTiming,
  sortByLastMeetingThenName,
} from "@/lib/utils";

interface OverviewProps {
  people: Person[];
  contextBank: string;
  contextSaved: boolean;
  generalPrep: GeneralPrep;
  onSelectPerson: (id: string) => void;
  onAddPerson: () => void;
  onOpenSmallTalk: () => void;
  onContextBankChange: (value: string) => void;
}

export function Overview({
  people,
  contextBank,
  contextSaved,
  generalPrep,
  onSelectPerson,
  onAddPerson,
  onOpenSmallTalk,
  onContextBankChange,
}: OverviewProps) {
  const { locale, t } = useLocale();

  const sortedPeople = people.toSorted(sortByLastMeetingThenName);
  const recentDiscussions = people
    .flatMap((person) =>
      person.discussions.map((discussion) => ({ discussion, person })),
    )
    .toSorted(
      (a, b) =>
        new Date(b.discussion.date).getTime() -
        new Date(a.discussion.date).getTime(),
    )
    .slice(0, 3);
  const previewIdeas = generalPrep.ideas.slice(0, 2);

  return (
    <main id="main-content" className="min-w-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[1180px] px-5 pb-36 pt-6 sm:px-8 lg:px-10 lg:pb-28 lg:pt-10">
        <header className="flex items-center justify-end">
          <button
            type="button"
            onClick={onAddPerson}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground shadow-[0_8px_22px_rgb(var(--shadow-color)/0.12)] transition-[transform,background-color,box-shadow] hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_10px_26px_rgb(var(--shadow-color)/0.16)]"
          >
            <Plus className="size-4" />
            {t.common.addPerson}
          </button>
        </header>

        <section className="mt-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-1.5">
              <h2 className="text-balance text-xl font-semibold tracking-[-0.03em] text-foreground sm:text-2xl">
                {t.overview.toolkitTitle}
              </h2>
              <Hint label={t.common.moreInfo}>{t.overview.toolkitBody}</Hint>
            </div>
          </div>

          <div className="mt-5 grid overflow-hidden rounded-[24px] border border-border bg-surface-raised shadow-[0_14px_40px_rgb(var(--shadow-color)/0.06)] xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
            <div className="flex min-h-[22rem] flex-col border-b border-border p-5 sm:p-6 xl:border-b-0 xl:border-r">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <NotebookPen
                      className="size-4 text-[#b56547]"
                      strokeWidth={1.7}
                    />
                    {t.overview.contextBankTitle}
                    <Hint label={t.common.moreInfo}>
                      {t.overview.contextBankBody}
                    </Hint>
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-[10px] text-muted-subtle">
                  <Check
                    className={cn(
                      "size-3",
                      contextSaved ? "text-success" : "text-muted-subtle",
                    )}
                  />
                  {contextSaved ? t.common.saved : t.common.saving}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {(
                  Object.keys(t.overview.contextSlots) as Array<
                    keyof typeof t.overview.contextSlots
                  >
                ).map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    title={t.overview.contextSlots[slot].example}
                    onClick={() => {
                      const current = contextBank.trimEnd();
                      onContextBankChange(
                        `${current}${current ? "\n" : ""}${slot}: `,
                      );
                    }}
                    className="rounded-full border border-border bg-surface-muted px-2.5 py-1 text-[10px] font-semibold text-muted transition-[border-color,color] hover:border-border-strong hover:text-foreground"
                  >
                    <Plus className="mr-1 inline size-2.5" />
                    {t.overview.contextSlots[slot].label}
                  </button>
                ))}
              </div>

              <textarea
                name="context-bank"
                value={contextBank}
                onChange={(event) => onContextBankChange(event.target.value)}
                maxLength={12_000}
                autoComplete="off"
                placeholder={t.overview.contextBankPlaceholder}
                className="mt-4 min-h-48 flex-1 resize-none rounded-2xl border border-accent/20 bg-accent-soft/35 p-4 text-sm leading-6 text-foreground outline-none transition-[border-color,background-color,box-shadow] placeholder:text-muted-subtle focus:border-accent/40 focus:bg-surface-raised focus:ring-4 focus:ring-accent/10"
              />

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted-subtle">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="size-3 text-success" />
                  <Hint label={t.common.moreInfo} side="top">
                    {t.overview.contextPrivate}
                  </Hint>
                </span>
                <span className="tabular-nums">
                  {contextBank.length.toLocaleString(locale)} / 12,000
                </span>
              </div>
            </div>

            <div className="group flex min-h-[22rem] flex-col bg-gradient-to-br from-amber-50/70 via-white to-stone-50 p-5 dark:from-amber-950/20 dark:via-stone-900 dark:to-stone-950 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <MessageCircle
                    className="size-4 text-amber-600 dark:text-amber-300"
                    strokeWidth={1.8}
                  />
                  {t.overview.smallTalkTitle}
                  <Hint label={t.common.moreInfo}>
                    {t.overview.smallTalkTeaserBody}
                  </Hint>
                </p>
                <button
                  type="button"
                  onClick={onOpenSmallTalk}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-[11px] font-semibold text-background transition-opacity hover:opacity-85"
                >
                  {t.overview.openSmallTalk}
                  <ArrowRight className="size-3.5" />
                </button>
              </div>

              {previewIdeas.length > 0 ? (
                <button
                  type="button"
                  onClick={onOpenSmallTalk}
                  className="mt-5 flex flex-1 flex-col space-y-2.5 text-left"
                >
                  {previewIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className="rounded-2xl border border-border bg-surface/90 px-4 py-3"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {idea.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-muted">
                        {idea.prompt}
                      </p>
                    </div>
                  ))}
                  {generalPrep.ideas.length > previewIdeas.length ? (
                    <p className="pt-1 text-[11px] text-muted-subtle">
                      {t.overview.smallTalkMore(
                        generalPrep.ideas.length - previewIdeas.length,
                      )}
                    </p>
                  ) : null}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenSmallTalk}
                  className="mt-5 flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-amber-200 bg-surface/60 px-5 py-8 text-center transition-colors hover:border-amber-300 dark:border-amber-500/20"
                >
                  <span className="grid size-10 place-items-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300">
                    <MessageCircle className="size-4" />
                  </span>
                  <p className="mt-3 max-w-xs text-xs leading-5 text-muted-subtle">
                    {t.overview.smallTalkTeaserEmpty}
                  </p>
                </button>
              )}
            </div>
          </div>
        </section>

        {people.length > 0 ? (
          <div className="mt-9 grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
          <section className="min-w-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-[-0.01em] text-foreground">
                {t.overview.peopleList}
              </h2>
              <span className="text-[11px] text-muted-subtle">
                {t.overview.sortedByRecent}
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-surface-raised">
              {sortedPeople.map((person, index) => {
                const timing = getLastMeetingTiming(
                  person.lastMeetingAt,
                  t,
                  locale,
                );
                const notes = countNoteLines(person.notes);
                return (
                  <button
                    type="button"
                    key={person.id}
                    onClick={() => onSelectPerson(person.id)}
                    className={cn(
                      "group flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-surface-muted sm:px-5",
                      index > 0 && "border-t border-border",
                    )}
                  >
                    <Avatar
                      name={person.name}
                      color={person.color}
                      size="md"
                      emoji={person.avatarEmoji}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-semibold text-foreground">
                          {person.name}
                        </span>
                        <RelationshipPill
                          relationship={person.relationship}
                          compact
                        />
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-subtle">
                        <Clock3 className="size-3" />
                        {person.lastMeetingAt
                          ? formatMeetingDate(person.lastMeetingAt, locale)
                          : timing.label}
                      </span>
                    </span>
                    <span className="hidden text-right sm:block">
                      <span
                        className={cn(
                          "block text-[11px] font-semibold",
                          timing.tone === "recent"
                            ? "text-emerald-600"
                            : timing.tone === "none"
                            ? "text-muted-subtle"
                            : "text-muted",
                        )}
                      >
                        {timing.label}
                      </span>
                      <span className="mt-1 block text-[10px] text-muted-subtle">
                        {t.overview.notesReady(notes)}
                      </span>
                    </span>
                    <ChevronRight className="size-4 text-muted-subtle transition group-hover:translate-x-0.5 group-hover:text-muted" />
                  </button>
                );
              })}
            </div>
          </section>

          <section className="min-w-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-[-0.01em] text-foreground">
                {t.overview.recent}
              </h2>
              <MessageSquareText
                className="size-3.5 text-muted-subtle"
                strokeWidth={1.7}
              />
            </div>
            <div className="space-y-2.5">
              {recentDiscussions.map(({ discussion, person }) => (
                <button
                  type="button"
                  key={discussion.id}
                  onClick={() => onSelectPerson(person.id)}
                  className="group flex w-full items-start gap-3 rounded-2xl border border-border bg-surface-raised p-4 text-left transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-sm"
                >
                  <Avatar
                    name={person.name}
                    color={person.color}
                    size="sm"
                    emoji={person.avatarEmoji}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-foreground">
                      {discussion.title}
                    </span>
                    <span className="mt-1 block text-[10px] text-muted-subtle">
                      {person.name} ·{" "}
                      {formatHistoryDate(discussion.date, locale)}
                    </span>
                  </span>
                  <TinyArrow />
                </button>
              ))}
            </div>
          </section>
          </div>
        ) : (
          <section className="mt-9 rounded-[24px] border border-dashed border-border-strong bg-gradient-to-br from-[#fff8f4] via-white to-[#f4f1fa] px-6 py-12 text-center dark:from-accent-soft/55 dark:via-surface-raised dark:to-secondary-soft/50">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent">
              <UsersRound className="size-6" />
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-foreground">
              {t.overview.emptyTitle}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-6 text-muted">
              {t.overview.emptyBody}
            </p>
            <button
              type="button"
              onClick={onAddPerson}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              <Plus className="size-4" />
              {t.overview.emptyCta}
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
