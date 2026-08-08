"use client";

import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  MessageSquareText,
  NotebookPen,
  Plus,
  Sparkles,
  UsersRound,
} from "lucide-react";

import {
  Avatar,
  RelationshipPill,
  TinyArrow,
} from "@/components/ui-kit";
import { useLocale } from "@/lib/i18n";
import type { PeopleFilter, Person } from "@/lib/types";
import {
  cadenceLabel,
  cn,
  countNoteLines,
  formatHistoryDate,
  formatMeetingDate,
  getMeetingTiming,
} from "@/lib/utils";

interface OverviewProps {
  people: Person[];
  filter: PeopleFilter;
  onSelectPerson: (id: string) => void;
  onAddPerson: () => void;
}

export function Overview({
  people,
  filter,
  onSelectPerson,
  onAddPerson,
}: OverviewProps) {
  const { locale, t } = useLocale();

  const sortedPeople = people.toSorted(
    (a, b) =>
      new Date(a.nextMeetingAt).getTime() -
      new Date(b.nextMeetingAt).getTime(),
  );
  const nextPerson = sortedPeople[0];
  const noteCount = people.reduce(
    (total, person) => total + countNoteLines(person.notes),
    0,
  );
  const openFollowUps = people.reduce(
    (total, person) =>
      total +
      person.discussions.reduce(
        (discussionTotal, discussion) =>
          discussionTotal + discussion.followUps.length,
        0,
      ),
    0,
  );
  const preparedCount = people.filter(
    (person) => person.prepIdeas.length > 0,
  ).length;
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
  const copy = t.overview.filters[filter];

  if (people.length === 0) {
    return (
      <main className="flex min-h-full flex-1 items-center justify-center p-6">
        <div className="max-w-md text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-stone-100 text-stone-500">
            <UsersRound className="size-6" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-stone-900">
            {t.overview.emptyTitle}
          </h1>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            {t.overview.emptyBody}
          </p>
          <button
            type="button"
            onClick={onAddPerson}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-stone-900 px-4 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            <Plus className="size-4" />
            {t.overview.emptyCta}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-w-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[1180px] px-5 pb-16 pt-8 sm:px-8 lg:px-10 lg:pt-11">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
              {copy.eyebrow}
            </p>
            <h1 className="mt-3 text-[2.15rem] font-semibold leading-[1.08] tracking-[-0.045em] text-stone-950 sm:text-[2.75rem]">
              {copy.title}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-stone-500 sm:text-[15px]">
              {copy.description}
            </p>
          </div>
          <button
            type="button"
            onClick={onAddPerson}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-stone-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 sm:self-auto"
          >
            <Plus className="size-4" />
            {t.common.addPerson}
          </button>
        </header>

        <section
          className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4"
          aria-label={t.overview.ariaStats}
        >
          {[
            {
              label: t.overview.stats.people,
              value: people.length,
              icon: UsersRound,
              note:
                filter === "all"
                  ? t.overview.stats.inCircle
                  : t.overview.stats.inFilter(
                      filter === "work" ? t.common.work : t.common.personal,
                    ),
            },
            {
              label: t.overview.stats.ready,
              value: noteCount,
              icon: NotebookPen,
              note: t.overview.stats.talkingPoints,
            },
            {
              label: t.overview.stats.followUps,
              value: openFollowUps,
              icon: Check,
              note: t.overview.stats.fromPast,
            },
            {
              label: t.overview.stats.prepared,
              value: preparedCount,
              icon: Sparkles,
              note: t.overview.stats.ofConversations(people.length),
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-stone-200/80 bg-white px-4 py-4 shadow-[0_1px_2px_rgba(28,25,23,0.02)] sm:px-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-stone-500">
                    {stat.label}
                  </p>
                  <Icon className="size-3.5 text-stone-400" strokeWidth={1.7} />
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-stone-900">
                  {stat.value}
                </p>
                <p className="mt-1 truncate text-[10px] text-stone-400">
                  {stat.note}
                </p>
              </div>
            );
          })}
        </section>

        {nextPerson ? (
          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-[-0.01em] text-stone-800">
                {t.overview.nextUp}
              </h2>
              <span className="text-[11px] text-stone-400">
                {
                  getMeetingTiming(nextPerson.nextMeetingAt, t, locale)
                    .label
                }
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectPerson(nextPerson.id)}
              className="group relative w-full overflow-hidden rounded-[24px] bg-[#22201e] p-5 text-left text-white shadow-[0_14px_40px_rgba(28,25,23,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(28,25,23,0.16)] sm:p-7"
            >
              <span
                className="absolute -right-20 -top-24 size-72 rounded-full opacity-30 blur-2xl"
                style={{ backgroundColor: nextPerson.color }}
              />
              <span className="absolute right-20 top-0 h-full w-px rotate-[24deg] bg-white/[0.06]" />
              <span className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex min-w-0 items-center gap-4">
                  <Avatar
                    name={nextPerson.name}
                    color={nextPerson.color}
                    size="xl"
                  />
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="block truncate text-xl font-semibold tracking-[-0.03em]">
                        {nextPerson.name}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-medium text-stone-200">
                        {cadenceLabel(nextPerson.cadence, t)}
                      </span>
                    </span>
                    <span className="mt-1 block text-xs text-stone-400">
                      {nextPerson.role} · {nextPerson.organization}
                    </span>
                  </span>
                </span>

                <span className="grid grid-cols-2 gap-3 sm:min-w-[350px]">
                  <span className="rounded-2xl border border-white/[0.08] bg-white/[0.06] px-4 py-3.5 backdrop-blur">
                    <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.1em] text-stone-500">
                      <CalendarDays className="size-3.5" />
                      {t.overview.scheduled}
                    </span>
                    <span className="mt-2 block text-xs font-medium text-stone-100 sm:text-sm">
                      {formatMeetingDate(nextPerson.nextMeetingAt, locale)}
                    </span>
                  </span>
                  <span className="rounded-2xl border border-white/[0.08] bg-white/[0.06] px-4 py-3.5 backdrop-blur">
                    <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.1em] text-stone-500">
                      <NotebookPen className="size-3.5" />
                      {t.overview.prepared}
                    </span>
                    <span className="mt-2 block text-xs font-medium text-stone-100 sm:text-sm">
                      {t.overview.preparedLine(
                        countNoteLines(nextPerson.notes),
                        nextPerson.prepIdeas.length,
                      )}
                    </span>
                  </span>
                </span>

                <span className="absolute bottom-0 right-0 hidden items-center gap-2 text-xs font-semibold text-white sm:flex sm:translate-y-12">
                  {t.overview.openPreparation}
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </span>
            </button>
          </section>
        ) : null}

        <div className="mt-9 grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
          <section className="min-w-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-[-0.01em] text-stone-800">
                {t.overview.upcoming}
              </h2>
              <span className="text-[11px] text-stone-400">
                {t.overview.sortedByNext}
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white">
              {sortedPeople.slice(0, 5).map((person, index) => {
                const timing = getMeetingTiming(
                  person.nextMeetingAt,
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
                      "group flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-stone-50 sm:px-5",
                      index > 0 && "border-t border-stone-100",
                    )}
                  >
                    <Avatar
                      name={person.name}
                      color={person.color}
                      size="md"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-semibold text-stone-800">
                          {person.name}
                        </span>
                        <RelationshipPill
                          relationship={person.relationship}
                          compact
                        />
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 text-[11px] text-stone-400">
                        <Clock3 className="size-3" />
                        {formatMeetingDate(person.nextMeetingAt, locale)}
                      </span>
                    </span>
                    <span className="hidden text-right sm:block">
                      <span
                        className={cn(
                          "block text-[11px] font-semibold",
                          timing.tone === "overdue"
                            ? "text-red-600"
                            : timing.tone === "today"
                              ? "text-emerald-600"
                              : "text-stone-600",
                        )}
                      >
                        {timing.label}
                      </span>
                      <span className="mt-1 block text-[10px] text-stone-400">
                        {t.overview.notesReady(notes)}
                      </span>
                    </span>
                    <ChevronRight className="size-4 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-stone-500" />
                  </button>
                );
              })}
            </div>
          </section>

          <section className="min-w-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-[-0.01em] text-stone-800">
                {t.overview.recent}
              </h2>
              <MessageSquareText
                className="size-3.5 text-stone-400"
                strokeWidth={1.7}
              />
            </div>
            <div className="space-y-2.5">
              {recentDiscussions.map(({ discussion, person }) => (
                <button
                  type="button"
                  key={discussion.id}
                  onClick={() => onSelectPerson(person.id)}
                  className="group flex w-full items-start gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 text-left transition hover:border-stone-300 hover:shadow-sm"
                >
                  <Avatar
                    name={person.name}
                    color={person.color}
                    size="sm"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-stone-800">
                      {discussion.title}
                    </span>
                    <span className="mt-1 block text-[10px] text-stone-400">
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
      </div>
    </main>
  );
}
