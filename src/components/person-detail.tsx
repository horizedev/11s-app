"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  History,
  Lightbulb,
  LoaderCircle,
  MessageSquareText,
  NotebookPen,
  Plus,
  RefreshCw,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";

import {
  Avatar,
  CategoryPill,
  RelationshipPill,
} from "@/components/ui-kit";
import { useLocale } from "@/lib/i18n";
import type { Person, PrepIdea, PrepResponse } from "@/lib/types";
import {
  cadenceLabel,
  cn,
  countNoteLines,
  formatHistoryDate,
  formatMeetingDate,
  getMeetingTiming,
  toDateTimeLocal,
} from "@/lib/utils";

interface PersonDetailProps {
  person: Person;
  prepMeta?: Pick<PrepResponse, "opening" | "source">;
  isGenerating: boolean;
  onBack: () => void;
  onNotesChange: (notes: string) => void;
  onMeetingDateChange: (date: string) => void;
  onGeneratePrep: () => void;
  onAddIdeaToNotes: (idea: PrepIdea) => void;
  onDismissIdea: (ideaId: string) => void;
  onLogMeeting: () => void;
}

type DetailTab = "prepare" | "history";

export function PersonDetail({
  person,
  prepMeta,
  isGenerating,
  onBack,
  onNotesChange,
  onMeetingDateChange,
  onGeneratePrep,
  onAddIdeaToNotes,
  onDismissIdea,
  onLogMeeting,
}: PersonDetailProps) {
  const { locale, t } = useLocale();
  const [tab, setTab] = useState<DetailTab>("prepare");
  const [saved, setSaved] = useState(true);
  const timing = getMeetingTiming(person.nextMeetingAt, t, locale);

  function handleNotesChange(value: string) {
    setSaved(false);
    onNotesChange(value);
    window.setTimeout(() => setSaved(true), 450);
  }

  return (
    <main className="min-w-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[1180px] px-5 pb-20 pt-5 sm:px-8 lg:px-10 lg:pt-8">
        <button
          type="button"
          onClick={onBack}
          className="group -ml-2 inline-flex h-9 items-center gap-2 rounded-lg px-2 text-xs font-medium text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
        >
          <ArrowLeft className="size-3.5 transition group-hover:-translate-x-0.5" />
          {t.common.overview}
        </button>

        <header className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar name={person.name} color={person.color} size="xl" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="truncate text-2xl font-semibold tracking-[-0.04em] text-stone-950 sm:text-[2rem]">
                  {person.name}
                </h1>
                <RelationshipPill relationship={person.relationship} />
              </div>
              <p className="mt-1 text-sm text-stone-500">
                {person.role}
                {person.organization ? ` · ${person.organization}` : ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogMeeting}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-stone-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-800 hover:shadow-md sm:self-auto"
          >
            <MessageSquareText className="size-4" />
            {t.person.logMeeting}
          </button>
        </header>

        <div className="mt-8 border-b border-stone-200">
          <nav className="flex gap-6" aria-label={t.person.detailSections}>
            {(
              [
                { id: "prepare", label: t.person.prepare, icon: Sparkles },
                {
                  id: "history",
                  label: t.person.history(person.discussions.length),
                  icon: History,
                },
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "relative flex h-11 items-center gap-2 text-sm font-medium transition",
                    tab === item.id
                      ? "text-stone-900"
                      : "text-stone-400 hover:text-stone-700",
                  )}
                >
                  <Icon className="size-3.5" strokeWidth={1.8} />
                  {item.label}
                  {tab === item.id ? (
                    <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-stone-900" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {tab === "prepare" ? (
          <div className="mt-7 grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-7">
              <section className="relative overflow-hidden rounded-[24px] border border-stone-800 bg-[#24211f] px-5 py-6 text-white shadow-[0_12px_30px_rgba(28,25,23,0.1)] sm:px-7 sm:py-7">
                <span
                  className="absolute -right-14 -top-20 size-52 rounded-full opacity-30 blur-3xl"
                  style={{ backgroundColor: person.color }}
                />
                <span className="absolute right-10 top-0 h-full w-px rotate-[28deg] bg-white/[0.06]" />
                <div className="relative">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="max-w-xl">
                      <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#d7a58c]">
                        <Sparkles className="size-3.5" />
                        {t.person.coach}
                      </span>
                      <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                        {t.person.coachTitle}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-stone-400">
                        {t.person.coachBody}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onGeneratePrep}
                      disabled={isGenerating}
                      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-white px-4 text-xs font-semibold text-stone-900 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isGenerating ? (
                        <LoaderCircle className="size-3.5 animate-spin" />
                      ) : person.prepIdeas.length > 0 ? (
                        <RefreshCw className="size-3.5" />
                      ) : (
                        <Sparkles className="size-3.5" />
                      )}
                      {isGenerating
                        ? t.person.thinking
                        : person.prepIdeas.length > 0
                          ? t.person.refreshIdeas
                          : t.person.generateIdeas}
                    </button>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      {
                        icon: NotebookPen,
                        label: t.person.savedNotes(
                          countNoteLines(person.notes),
                        ),
                      },
                      {
                        icon: History,
                        label: t.person.pastDiscussions(
                          person.discussions.length,
                        ),
                      },
                      {
                        icon: Target,
                        label: t.person.cadenceLabel(
                          cadenceLabel(person.cadence, t),
                        ),
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <span
                          key={item.label}
                          className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.05] px-3 py-2.5 text-[11px] text-stone-300"
                        >
                          <Icon
                            className="size-3.5 text-stone-500"
                            strokeWidth={1.7}
                          />
                          {item.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold tracking-[-0.02em] text-stone-900">
                        {t.person.suggested}
                      </h2>
                      {person.prepIdeas.length > 0 ? (
                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-500">
                          {person.prepIdeas.length}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-stone-400">
                      {t.person.suggestedHint}
                    </p>
                  </div>
                  {prepMeta ? (
                    <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-medium text-stone-500">
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          prepMeta.source === "ai"
                            ? "bg-emerald-500"
                            : "bg-amber-500",
                        )}
                      />
                      {prepMeta.source === "ai"
                        ? t.person.aiGenerated
                        : t.person.starterIdeas}
                    </span>
                  ) : null}
                </div>

                {prepMeta?.opening ? (
                  <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#eadfd8] bg-[#fbf7f4] px-4 py-3.5">
                    <Lightbulb
                      className="mt-0.5 size-4 shrink-0 text-[#b56547]"
                      strokeWidth={1.8}
                    />
                    <p className="text-xs leading-5 text-stone-600">
                      {prepMeta.opening}
                    </p>
                  </div>
                ) : null}

                {person.prepIdeas.length > 0 ? (
                  <div className="mt-4 grid gap-3">
                    {person.prepIdeas.map((idea) => (
                      <article
                        key={idea.id}
                        className="group rounded-2xl border border-stone-200/90 bg-white p-4 transition hover:border-stone-300 hover:shadow-[0_8px_24px_rgba(28,25,23,0.05)] sm:p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <CategoryPill category={idea.category} />
                            <h3 className="mt-3 text-[15px] font-semibold tracking-[-0.015em] text-stone-900">
                              {idea.title}
                            </h3>
                            <p className="mt-1.5 text-xs leading-5 text-stone-500">
                              {idea.rationale}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onDismissIdea(idea.id)}
                            className="grid size-8 shrink-0 place-items-center rounded-lg text-stone-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 focus:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 group-hover:opacity-100"
                            aria-label={t.person.dismiss(idea.title)}
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>

                        <div className="mt-4 flex flex-col gap-3 rounded-xl bg-stone-50 px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-xs font-medium leading-5 text-stone-700">
                            “{idea.prompt}”
                          </p>
                          <button
                            type="button"
                            onClick={() => onAddIdeaToNotes(idea)}
                            className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 self-start rounded-lg border border-stone-200 bg-white px-3 text-[11px] font-semibold text-stone-600 shadow-sm transition hover:border-stone-300 hover:text-stone-900 sm:self-auto"
                          >
                            <Plus className="size-3" />
                            {t.person.addToNotes}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
                    <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-stone-100 text-stone-400">
                      <Sparkles className="size-5" />
                    </span>
                    <h3 className="mt-4 text-sm font-semibold text-stone-800">
                      {t.person.blankTitle}
                    </h3>
                    <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-stone-400">
                      {t.person.blankBody}
                    </p>
                    <button
                      type="button"
                      onClick={onGeneratePrep}
                      disabled={isGenerating}
                      className="mt-5 inline-flex h-9 items-center gap-2 rounded-xl bg-stone-900 px-3.5 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {isGenerating ? (
                        <LoaderCircle className="size-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="size-3.5" />
                      )}
                      {t.person.generatePrep}
                    </button>
                  </div>
                )}
              </section>

              {person.discussions[0] ? (
                <section>
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-stone-800">
                      {t.person.lastConversation}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setTab("history")}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-400 transition hover:text-stone-700"
                    >
                      {t.person.viewHistory}
                      <ChevronRight className="size-3" />
                    </button>
                  </div>
                  <div className="rounded-2xl border border-stone-200/80 bg-white p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-stone-800">
                          {person.discussions[0].title}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-[10px] text-stone-400">
                          <CalendarDays className="size-3" />
                          {formatHistoryDate(
                            person.discussions[0].date,
                            locale,
                          )}
                        </p>
                      </div>
                      <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-medium text-stone-500">
                        {t.mood[person.discussions[0].mood]}
                      </span>
                    </div>
                    <p className="mt-4 text-xs leading-5 text-stone-500">
                      {person.discussions[0].summary}
                    </p>
                  </div>
                </section>
              ) : null}
            </div>

            <aside className="space-y-4 xl:sticky xl:top-6">
              <section className="overflow-hidden rounded-[22px] border border-stone-200/90 bg-white shadow-[0_8px_30px_rgba(28,25,23,0.04)]">
                <div className="border-b border-stone-100 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                      <CalendarClock
                        className="size-4 text-stone-400"
                        strokeWidth={1.7}
                      />
                      {t.person.nextOneOnOne}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                        timing.tone === "overdue"
                          ? "bg-red-50 text-red-600"
                          : timing.tone === "today"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-stone-100 text-stone-500",
                      )}
                    >
                      {timing.label}
                    </span>
                  </div>
                  <p className="mt-3 text-lg font-semibold tracking-[-0.025em] text-stone-900">
                    {formatMeetingDate(person.nextMeetingAt, locale)}
                  </p>
                  <div className="mt-3">
                    <label
                      htmlFor={`next-meeting-${person.id}`}
                      className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.1em] text-stone-400"
                    >
                      {t.person.reschedule}
                    </label>
                    <input
                      id={`next-meeting-${person.id}`}
                      type="datetime-local"
                      value={toDateTimeLocal(person.nextMeetingAt)}
                      onChange={(event) =>
                        onMeetingDateChange(event.target.value)
                      }
                      className="h-9 w-full rounded-lg border border-stone-200 bg-stone-50 px-2.5 text-[11px] text-stone-600 outline-none transition focus:border-stone-300 focus:bg-white focus:ring-4 focus:ring-stone-900/[0.04]"
                    />
                  </div>
                </div>

                <div className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={`notes-${person.id}`}
                      className="flex items-center gap-2 text-xs font-semibold text-stone-800"
                    >
                      <NotebookPen
                        className="size-4 text-stone-400"
                        strokeWidth={1.7}
                      />
                      {t.person.notesForNext}
                    </label>
                    <span className="inline-flex items-center gap-1 text-[10px] text-stone-400">
                      <Check className="size-3 text-emerald-500" />
                      {saved ? t.common.saved : t.common.saving}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-4 text-stone-400">
                    {t.person.notesHint}
                  </p>
                  <textarea
                    id={`notes-${person.id}`}
                    value={person.notes}
                    onChange={(event) => handleNotesChange(event.target.value)}
                    placeholder={t.person.notesPlaceholder}
                    className="mt-3 min-h-56 w-full resize-none rounded-xl border border-stone-200 bg-[#fbfaf8] p-3.5 text-xs leading-6 text-stone-700 outline-none transition placeholder:text-stone-300 focus:border-stone-300 focus:bg-white focus:ring-4 focus:ring-stone-900/[0.04]"
                  />
                  <div className="mt-3 flex items-center justify-between text-[10px] text-stone-400">
                    <span>
                      {t.person.talkingPoints(countNoteLines(person.notes))}
                    </span>
                    <span>{t.person.privateBrowser}</span>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-stone-200/80 bg-[#f8f6f2] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                  {t.person.prepUses}
                </p>
                <div className="mt-3 space-y-2">
                  {[
                    {
                      icon: NotebookPen,
                      label: t.person.prepUsesItems[0],
                    },
                    {
                      icon: History,
                      label: t.person.prepUsesItems[1],
                    },
                    {
                      icon: Clock3,
                      label: t.person.prepUsesItems[2],
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <p
                        key={item.label}
                        className="flex items-center gap-2 text-[11px] text-stone-500"
                      >
                        <Icon className="size-3 text-stone-400" />
                        {item.label}
                      </p>
                    );
                  })}
                </div>
              </section>
            </aside>
          </div>
        ) : (
          <HistoryView person={person} onLogMeeting={onLogMeeting} />
        )}
      </div>
    </main>
  );
}

function HistoryView({
  person,
  onLogMeeting,
}: {
  person: Person;
  onLogMeeting: () => void;
}) {
  const { locale, t } = useLocale();
  const dateLocale = locale === "zh-TW" ? "zh-TW" : "en";

  return (
    <section className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400">
            {t.person.memoryEyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-stone-900">
            {t.person.historyTitle(person.name.split(" ")[0])}
          </h2>
          <p className="mt-1.5 text-sm text-stone-500">
            {t.person.historyBody}
          </p>
        </div>
        <button
          type="button"
          onClick={onLogMeeting}
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-stone-200 bg-white px-4 text-xs font-semibold text-stone-700 shadow-sm transition hover:border-stone-300 sm:self-auto"
        >
          <Plus className="size-3.5" />
          {t.person.addConversation}
        </button>
      </div>

      {person.discussions.length > 0 ? (
        <div className="relative mt-8">
          <span className="absolute bottom-8 left-[19px] top-5 w-px bg-stone-200 sm:left-[106px]" />
          <div className="space-y-5">
            {person.discussions.map((discussion) => (
              <article
                key={discussion.id}
                className="relative grid gap-4 pl-12 sm:grid-cols-[84px_minmax(0,1fr)] sm:pl-0"
              >
                <div className="hidden pt-4 text-right sm:block">
                  <p className="text-[11px] font-semibold text-stone-600">
                    {new Intl.DateTimeFormat(dateLocale, {
                      month: "short",
                      day: "numeric",
                    }).format(new Date(discussion.date))}
                  </p>
                  <p className="mt-1 text-[10px] text-stone-400">
                    {new Intl.DateTimeFormat(dateLocale, {
                      year: "numeric",
                    }).format(new Date(discussion.date))}
                  </p>
                </div>
                <span
                  className={cn(
                    "absolute left-[13px] top-5 z-10 grid size-3.5 place-items-center rounded-full border-[3px] border-[#fdfcfb] sm:left-[100px]",
                    discussion.mood === "energized"
                      ? "bg-violet-500"
                      : discussion.mood === "positive"
                        ? "bg-emerald-500"
                        : discussion.mood === "tough"
                          ? "bg-orange-500"
                          : "bg-stone-400",
                  )}
                />
                <div className="rounded-[20px] border border-stone-200/90 bg-white p-5 sm:ml-8 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[10px] font-medium text-stone-400 sm:hidden">
                        {formatHistoryDate(discussion.date, locale)}
                      </p>
                      <h3 className="mt-1 text-base font-semibold tracking-[-0.02em] text-stone-900 sm:mt-0">
                        {discussion.title}
                      </h3>
                    </div>
                    <span className="inline-flex self-start rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-medium text-stone-500">
                      {t.mood[discussion.mood]}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-stone-500">
                    {discussion.summary}
                  </p>

                  {discussion.topics.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {discussion.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[10px] font-medium text-stone-500"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {discussion.followUps.length > 0 ? (
                    <div className="mt-5 border-t border-stone-100 pt-4">
                      <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                        <CheckCircle2 className="size-3.5" />
                        {t.common.followUps}
                      </p>
                      <ul className="mt-2.5 space-y-2">
                        {discussion.followUps.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-xs leading-5 text-stone-600"
                          >
                            <span className="mt-[7px] size-1 shrink-0 rounded-full bg-stone-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
          <History className="mx-auto size-6 text-stone-300" />
          <h3 className="mt-3 text-sm font-semibold text-stone-800">
            {t.person.noHistoryTitle}
          </h3>
          <p className="mt-1 text-xs text-stone-400">
            {t.person.noHistoryBody}
          </p>
        </div>
      )}
    </section>
  );
}
