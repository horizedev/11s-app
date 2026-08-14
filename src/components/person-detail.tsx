"use client";

import { useMemo, useRef, useState } from "react";
import {
  Archive,
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Eraser,
  Eye,
  History,
  Lightbulb,
  LoaderCircle,
  MessageSquareText,
  NotebookPen,
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";

import {
  Avatar,
  CategoryPill,
  RelationshipPill,
} from "@/components/ui-kit";
import { Hint } from "@/components/hint";
import { useLocale } from "@/lib/i18n";
import type {
  MeetingIntent,
  Person,
  PrepIdea,
  PrepQuota,
  PrepRefineMode,
  PrepResponse,
} from "@/lib/types";
import { MEETING_INTENTS } from "@/lib/types";
import {
  cn,
  countNoteLines,
  formatHistoryDate,
  formatMeetingDate,
  getLastMeetingTiming,
} from "@/lib/utils";

interface PersonDetailProps {
  person: Person;
  prepMeta?: Pick<PrepResponse, "opening" | "source">;
  prepQuota: PrepQuota;
  isGenerating: boolean;
  isRefining: boolean;
  intent: MeetingIntent;
  onIntentChange: (intent: MeetingIntent) => void;
  onBack: () => void;
  onEditPerson: () => void;
  onNotesChange: (notes: string) => void;
  onClearNotes: () => void;
  onArchiveNotes: () => void;
  onRestoreLastNotes: () => void;
  onGeneratePrep: () => void;
  onRefinePrep: (mode: PrepRefineMode) => void;
  onAddIdeaToNotes: (idea: PrepIdea) => void;
  onDismissIdea: (ideaId: string) => void;
  onLogMeeting: () => void;
  onQuickClose: () => void;
  onEditMeeting: (discussionId: string) => void;
  onAgendaCopied: () => void;
}

type DetailTab = "prepare" | "history";

export function PersonDetail({
  person,
  prepMeta,
  prepQuota,
  isGenerating,
  isRefining,
  intent,
  onIntentChange,
  onBack,
  onEditPerson,
  onNotesChange,
  onClearNotes,
  onArchiveNotes,
  onRestoreLastNotes,
  onGeneratePrep,
  onRefinePrep,
  onAddIdeaToNotes,
  onDismissIdea,
  onLogMeeting,
  onQuickClose,
  onEditMeeting,
  onAgendaCopied,
}: PersonDetailProps) {
  const { locale, t } = useLocale();
  const [tab, setTab] = useState<DetailTab>("prepare");
  const [saved, setSaved] = useState(true);
  const [glanceMode, setGlanceMode] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const timing = getLastMeetingTiming(person.lastMeetingAt, t, locale);
  const remaining =
    prepQuota.limit == null
      ? null
      : Math.max(0, prepQuota.limit - prepQuota.used);

  const lead = useMemo(
    () =>
      person.prepIdeas.find((idea) => idea.kind === "lead") ??
      (person.prepIdeas.some((idea) => idea.kind === "support" || idea.kind === "stall")
        ? undefined
        : person.prepIdeas[0]),
    [person.prepIdeas],
  );
  const stalls = useMemo(
    () => person.prepIdeas.filter((idea) => idea.kind === "stall"),
    [person.prepIdeas],
  );
  const supports = useMemo(() => {
    const hasKinds = person.prepIdeas.some(
      (idea) => idea.kind === "lead" || idea.kind === "stall" || idea.kind === "support",
    );
    if (!hasKinds) return person.prepIdeas.slice(1);
    return person.prepIdeas.filter((idea) => idea.kind === "support");
  }, [person.prepIdeas]);
  const displaySupports = supports;

  function handleNotesChange(value: string) {
    setSaved(false);
    onNotesChange(value);
    window.setTimeout(() => setSaved(true), 450);
  }

  function copyAgenda() {
    const lines = [
      ...person.notes
        .split("\n")
        .map((line) => line.replace(/^[-•]\s*/, "").trim())
        .filter(Boolean),
      ...(lead ? [lead.prompt] : []),
      ...displaySupports.slice(0, 3).map((idea) => idea.prompt),
    ].slice(0, 4);
    if (lines.length === 0) return;
    void navigator.clipboard.writeText(lines.map((line) => `• ${line}`).join("\n"));
    onAgendaCopied();
  }

  function requestGenerate() {
    setPreviewOpen(true);
  }

  function confirmGenerate() {
    setPreviewOpen(false);
    onGeneratePrep();
  }

  return (
    <main id="main-content" className="min-w-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[1180px] px-5 pb-28 pt-5 sm:px-8 lg:px-10 lg:pb-20 lg:pt-8">
        <button
          type="button"
          onClick={onBack}
          className="group -ml-2 inline-flex h-9 items-center gap-2 rounded-lg px-2 text-xs font-medium text-muted transition-[background-color,color] hover:bg-surface-muted hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 transition group-hover:-translate-x-0.5" />
          {t.common.overview}
        </button>

        <header className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar
              name={person.name}
              color={person.color}
              size="xl"
              emoji={person.avatarEmoji}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="truncate text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-[2rem]">
                  {person.name}
                </h1>
                <RelationshipPill relationship={person.relationship} />
              </div>
              <p className="mt-1 text-sm text-muted">
                {person.role}
                {person.organization ? ` · ${person.organization}` : ""}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setGlanceMode((current) => !current)}
              className={cn(
                "inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold shadow-sm transition",
                glanceMode
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground",
              )}
            >
              <Eye className="size-3.5" />
              {glanceMode ? t.person.fullPrepMode : t.person.glanceMode}
            </button>
            <button
              type="button"
              onClick={onEditPerson}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-muted shadow-sm transition-[border-color,color] hover:border-border-strong hover:text-foreground"
            >
              <Pencil className="size-3.5" />
              {t.person.editPerson}
            </button>
            <button
              type="button"
              onClick={onQuickClose}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-muted shadow-sm transition-[border-color,color] hover:border-border-strong hover:text-foreground"
            >
              <CheckCircle2 className="size-4" />
              {t.person.closeQuickTitle}
            </button>
            <button
              type="button"
              onClick={onLogMeeting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground shadow-[0_8px_22px_rgb(var(--shadow-color)/0.12)] transition-[transform,background-color,box-shadow] hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_10px_26px_rgb(var(--shadow-color)/0.16)]"
            >
              <MessageSquareText className="size-4" />
              {t.person.logMeeting}
            </button>
          </div>
        </header>

        <div className="mt-8 border-b border-border">
          <nav
            className="flex gap-6"
            aria-label={t.person.detailSections}
            role="tablist"
          >
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
                  id={`person-detail-tab-${item.id}`}
                  role="tab"
                  aria-selected={tab === item.id}
                  aria-controls={`person-detail-panel-${item.id}`}
                  tabIndex={tab === item.id ? 0 : -1}
                  onClick={() => setTab(item.id)}
                  onKeyDown={(event) => {
                    if (
                      event.key !== "ArrowLeft" &&
                      event.key !== "ArrowRight" &&
                      event.key !== "Home" &&
                      event.key !== "End"
                    ) {
                      return;
                    }

                    event.preventDefault();
                    const nextTab: DetailTab =
                      event.key === "Home"
                        ? "prepare"
                        : event.key === "End"
                          ? "history"
                          : item.id === "prepare"
                            ? "history"
                            : "prepare";
                    setTab(nextTab);
                    document
                      .getElementById(`person-detail-tab-${nextTab}`)
                      ?.focus();
                  }}
                  className={cn(
                    "relative flex h-11 items-center gap-2 text-sm font-medium transition",
                    tab === item.id
                      ? "text-foreground"
                      : "text-muted-subtle hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5" strokeWidth={1.8} />
                  {item.label}
                  {tab === item.id ? (
                    <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-accent" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {tab === "prepare" && glanceMode ? (
          <GlanceView
            person={person}
            opening={prepMeta?.opening}
            lead={lead}
            supports={displaySupports.slice(0, 3)}
            stalls={stalls}
            onExit={() => setGlanceMode(false)}
          />
        ) : null}

        {tab === "prepare" && !glanceMode ? (
          <div
            id="person-detail-panel-prepare"
            role="tabpanel"
            aria-labelledby="person-detail-tab-prepare"
            className="mt-6 space-y-4"
          >
            <section className="flex flex-col gap-3 rounded-2xl border border-stone-200/80 bg-[#24211f] px-4 py-3 text-white sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#d7a58c]">
                    <Sparkles className="size-3" />
                    {t.person.coach}
                    <Hint
                      label={t.common.moreInfo}
                      className="text-[#d7a58c]/70 [&_button]:text-[#d7a58c]/70 [&_button]:hover:bg-white/10 [&_button]:hover:text-[#f0d2c0]"
                    >
                      {t.person.coachBody}
                    </Hint>
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-stone-100">
                    {t.person.coachTitle}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-stone-300">
                    {remaining == null
                      ? t.person.prepQuotaUnlimited
                      : t.person.prepQuota(remaining, prepQuota.limit ?? 0)}
                  </span>
                  <button
                    type="button"
                    onClick={copyAgenda}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 text-xs font-semibold text-stone-100"
                  >
                    <Copy className="size-3.5" />
                    {t.person.copyAgenda}
                  </button>
                  <button
                    type="button"
                    onClick={requestGenerate}
                    disabled={isGenerating}
                    className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#fff] px-3.5 text-xs font-semibold text-[#1c1917] transition-colors hover:bg-[#f5f5f4] disabled:opacity-70"
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
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                    {t.person.intentLabel}
                  </p>
                  <Hint
                    label={t.common.moreInfo}
                    className="text-stone-400 [&_button]:text-stone-400 [&_button]:hover:bg-white/10 [&_button]:hover:text-stone-200"
                  >
                    {t.person.intentHint}
                  </Hint>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {MEETING_INTENTS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => onIntentChange(value)}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[10px] font-semibold transition",
                        intent === value
                          ? "bg-[#fff] text-[#1c1917]"
                          : "bg-white/10 text-stone-300 hover:bg-white/15",
                      )}
                    >
                      {t.person.intents[value]}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {previewOpen ? (
              <ContextPreview
                person={person}
                onCancel={() => setPreviewOpen(false)}
                onConfirm={confirmGenerate}
              />
            ) : null}

            <section className="overflow-hidden rounded-[24px] border border-border bg-surface-raised shadow-[0_14px_40px_rgb(var(--shadow-color)/0.06)]">
              <div className="border-b border-border bg-gradient-to-r from-[#fff9f5] via-white to-violet-50/60 px-5 py-4 dark:from-accent-soft/45 dark:via-surface-raised dark:to-secondary-soft/40 sm:px-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-base font-semibold tracking-[-0.02em] text-foreground">
                      {t.person.prepWorkspaceTitle}
                    </h2>
                    <Hint label={t.common.moreInfo}>
                      {t.person.prepWorkspaceBody}
                    </Hint>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-subtle">
                    <Clock3 className="size-3" />
                    <span>
                      {person.lastMeetingAt
                        ? formatMeetingDate(person.lastMeetingAt, locale)
                        : t.person.noLastConversation}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 font-semibold",
                        timing.tone === "recent"
                          ? "bg-success-soft text-success"
                          : "bg-surface-muted text-muted",
                      )}
                    >
                      {timing.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2">
                <div className="flex min-h-[28rem] flex-col border-b border-border lg:border-b-0 lg:border-r">
                  <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5 sm:px-6">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <label
                          htmlFor={`notes-${person.id}`}
                          className="flex items-center gap-2 text-xs font-semibold text-foreground"
                        >
                          <NotebookPen
                            className="size-3.5 text-[#b56547]"
                            strokeWidth={1.7}
                          />
                          {t.person.notesForNext}
                        </label>
                        <Hint label={t.common.moreInfo}>
                          {t.person.notesHint}
                        </Hint>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-subtle">
                      <Check className="size-3 text-success" />
                      {saved ? t.common.saved : t.common.saving}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col px-5 py-4 sm:px-6">
                    <textarea
                      ref={notesRef}
                      id={`notes-${person.id}`}
                      name={`notes-${person.id}`}
                      value={person.notes}
                      onChange={(event) =>
                        handleNotesChange(event.target.value)
                      }
                      autoComplete="off"
                      placeholder={t.person.notesPlaceholder}
                      className="min-h-0 w-full flex-1 resize-none rounded-xl border border-accent/20 bg-accent-soft/35 p-3.5 text-xs leading-6 text-foreground outline-none transition-[border-color,background-color,box-shadow] placeholder:text-muted-subtle focus:border-accent/40 focus:bg-surface-raised focus:ring-4 focus:ring-accent/10"
                    />

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] text-muted-subtle">
                        {t.person.talkingPoints(countNoteLines(person.notes))}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`${t.person.clearNotes}?`)) {
                              onClearNotes();
                            }
                          }}
                          disabled={!person.notes.trim()}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-[11px] font-semibold text-muted transition-[border-color,color] hover:border-border-strong hover:text-foreground disabled:opacity-40"
                        >
                          <Eraser className="size-3" />
                          {t.person.clearNotes}
                        </button>
                        <button
                          type="button"
                          onClick={onArchiveNotes}
                          disabled={!person.notes.trim()}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-[11px] font-semibold text-muted transition-[border-color,color] hover:border-border-strong hover:text-foreground disabled:opacity-40"
                        >
                          <Archive className="size-3" />
                          {t.person.archiveNotes}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-dashed border-border bg-surface-muted/80 px-3.5 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                          {t.person.lastNotesTitle}
                        </p>
                        {person.lastNotes.trim() ? (
                          <button
                            type="button"
                            onClick={onRestoreLastNotes}
                            className="text-[10px] font-semibold text-muted transition-colors hover:text-foreground"
                          >
                            {t.person.restoreLastNote}
                          </button>
                        ) : null}
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-[11px] leading-5 text-muted">
                        {person.lastNotes.trim() || t.person.lastNotesEmpty}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex min-h-[28rem] flex-col bg-gradient-to-br from-violet-50/40 via-white to-white dark:from-secondary-soft/35 dark:via-surface-raised dark:to-surface-raised">
                  <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5 sm:px-6">
                    <div>
                      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-secondary">
                        <Sparkles className="size-3" />
                        {t.person.aiIdeation}
                      </p>
                      <h3 className="mt-1 text-xs font-semibold text-foreground">
                        {t.person.suggested}
                        {person.prepIdeas.length > 0
                          ? ` · ${person.prepIdeas.length}`
                          : ""}
                      </h3>
                    </div>
                    {prepMeta ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/20 bg-surface/80 px-2.5 py-1 text-[10px] font-semibold text-secondary">
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

                  <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4 sm:px-6">
                    {person.prepIdeas.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        <span className="mr-1 self-center text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                          {t.person.refineLabel}
                        </span>
                        {(
                          [
                            ["warmer", t.person.refineWarmer],
                            ["shorter", t.person.refineShorter],
                            ["more-career", t.person.refineMoreCareer],
                          ] as const
                        ).map(([mode, label]) => (
                          <button
                            key={mode}
                            type="button"
                            disabled={isRefining || isGenerating}
                            onClick={() => onRefinePrep(mode)}
                            className="rounded-full border border-secondary/20 bg-surface px-2.5 py-1 text-[10px] font-semibold text-secondary transition-colors hover:border-secondary/40 disabled:opacity-50"
                          >
                            {isRefining ? "…" : label}
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {prepMeta?.opening ? (
                      <div className="flex items-start gap-3 rounded-2xl border border-secondary/20 bg-surface/80 px-4 py-3">
                        <Lightbulb
                          className="mt-0.5 size-4 shrink-0 text-secondary"
                          strokeWidth={1.8}
                        />
                        <p className="text-xs leading-5 text-muted">
                          {prepMeta.opening}
                        </p>
                      </div>
                    ) : null}

                    {person.prepIdeas.length > 0 ? (
                      <>
                        {lead ? (
                          <div>
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">
                              {t.person.leadQuestion}
                            </p>
                            <IdeaCard
                              idea={lead}
                              emphasis
                              onAdd={() => onAddIdeaToNotes(lead)}
                              onDismiss={() => onDismissIdea(lead.id)}
                            />
                          </div>
                        ) : null}

                        {displaySupports.length > 0 ? (
                          <div>
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-secondary">
                              {t.person.supportingThreads}
                            </p>
                            <div className="space-y-3">
                              {displaySupports.map((idea) => (
                                <IdeaCard
                                  key={idea.id}
                                  idea={idea}
                                  onAdd={() => onAddIdeaToNotes(idea)}
                                  onDismiss={() => onDismissIdea(idea.id)}
                                />
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {stalls.length > 0 ? (
                          <div>
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                              {t.person.stallCards}
                            </p>
                            <div className="space-y-2">
                              {stalls.map((idea) => (
                                <article
                                  key={idea.id}
                                  className="rounded-xl border border-dashed border-border bg-surface-muted/80 px-3.5 py-3"
                                >
                                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                                    {t.person.stallIfNeeded}
                                  </p>
                                  <p className="mt-1 text-xs font-medium text-foreground">
                                    {idea.prompt}
                                  </p>
                                  <div className="mt-2 flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => onAddIdeaToNotes(idea)}
                                      className="text-[10px] font-semibold text-muted transition-colors hover:text-foreground"
                                    >
                                      {t.person.addToNotes}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => onDismissIdea(idea.id)}
                                      className="text-[10px] font-semibold text-muted-subtle transition-colors hover:text-danger"
                                    >
                                      {t.person.dismiss(idea.title)}
                                    </button>
                                  </div>
                                </article>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-secondary/25 bg-surface/70 px-6 py-10 text-center">
                        <span className="grid size-11 place-items-center rounded-2xl bg-secondary-soft text-secondary">
                          <Sparkles className="size-5" />
                        </span>
                        <h3 className="mt-4 text-sm font-semibold text-foreground">
                          {t.person.blankTitle}
                        </h3>
                        <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-muted-subtle">
                          {t.person.blankBody}
                        </p>
                        <button
                          type="button"
                          onClick={requestGenerate}
                          disabled={isGenerating}
                          className="mt-5 inline-flex h-9 items-center gap-2 rounded-xl bg-accent px-3.5 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-60"
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
                  </div>
                </div>
              </div>
            </section>

            {person.discussions[0] ? (
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">
                    {t.person.lastConversation}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setTab("history")}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-subtle transition-colors hover:text-foreground"
                  >
                    {t.person.viewHistory}
                    <ChevronRight className="size-3" />
                  </button>
                </div>
                <div className="group rounded-2xl border border-border bg-surface-raised p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {person.discussions[0].title}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-subtle">
                        <CalendarDays className="size-3" />
                        {formatHistoryDate(person.discussions[0].date, locale)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-medium text-muted">
                        {t.mood[person.discussions[0].mood]}
                      </span>
                      <button
                        type="button"
                        onClick={() => onEditMeeting(person.discussions[0].id)}
                        className="grid size-8 place-items-center rounded-lg text-muted-subtle opacity-100 transition-[background-color,color,opacity] hover:bg-surface-muted hover:text-foreground focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                        aria-label={t.person.editConversation}
                      >
                        <Pencil className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-4 text-xs leading-5 text-muted">
                    {person.discussions[0].summary}
                  </p>
                </div>
              </section>
            ) : null}
          </div>
        ) : tab === "history" ? (
          <HistoryView
            person={person}
            onLogMeeting={onLogMeeting}
            onEditMeeting={onEditMeeting}
          />
        ) : null}
      </div>
    </main>
  );
}

function IdeaCard({
  idea,
  emphasis = false,
  onAdd,
  onDismiss,
}: {
  idea: PrepIdea;
  emphasis?: boolean;
  onAdd: () => void;
  onDismiss: () => void;
}) {
  const { t } = useLocale();
  return (
    <article
      className={cn(
        "group rounded-2xl border bg-surface-raised/95 p-4 transition",
        emphasis
          ? "border-amber-300/70 shadow-[0_8px_24px_rgba(180,83,9,0.08)] dark:border-amber-400/30"
          : "border-secondary/15 hover:border-secondary/30 hover:shadow-[0_8px_24px_rgba(109,40,217,0.07)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <CategoryPill category={idea.category} />
          <h4 className="mt-2.5 text-sm font-semibold tracking-[-0.015em] text-foreground">
            {idea.title}
          </h4>
          <p className="mt-1 text-[11px] leading-5 text-muted">
            {idea.rationale}
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="grid size-7 shrink-0 place-items-center rounded-lg text-muted-subtle opacity-100 transition-[background-color,color,opacity] hover:bg-danger-soft hover:text-danger focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
          aria-label={t.person.dismiss(idea.title)}
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
      <div className="mt-3 flex flex-col gap-2 rounded-xl bg-violet-50/80 px-3 py-2.5 dark:bg-violet-400/10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] font-medium leading-5 text-foreground">
          “{idea.prompt}”
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 self-start rounded-lg border border-border bg-surface-raised px-3 text-[11px] font-semibold text-muted shadow-sm transition-colors hover:border-border-strong hover:text-foreground"
        >
          <Plus className="size-3" />
          {t.person.addToNotes}
        </button>
      </div>
    </article>
  );
}

function GlanceView({
  person,
  opening,
  lead,
  supports,
  stalls,
  onExit,
}: {
  person: Person;
  opening?: string;
  lead?: PrepIdea;
  supports: PrepIdea[];
  stalls: PrepIdea[];
  onExit: () => void;
}) {
  const { t } = useLocale();
  const empty = !lead && supports.length === 0 && stalls.length === 0;

  return (
    <section
      id="person-detail-panel-prepare"
      role="tabpanel"
      aria-labelledby="person-detail-tab-prepare"
      className="mt-6 rounded-[28px] border border-stone-800 bg-[#1c1917] px-5 py-6 text-white sm:px-8 sm:py-8"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#d7a58c]">
            {t.person.glanceMode}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
            {person.name}
          </h2>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-stone-200"
        >
          {t.person.fullPrepMode}
        </button>
      </div>

      {empty ? (
        <p className="mt-8 text-sm text-stone-400">{t.person.glanceEmpty}</p>
      ) : (
        <div className="mt-8 space-y-6">
          {opening ? (
            <p className="text-sm leading-6 text-stone-300">{opening}</p>
          ) : null}
          {lead ? (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-300">
                {t.person.leadQuestion}
              </p>
              <p className="mt-2 text-xl font-medium leading-8 text-white">
                {lead.prompt}
              </p>
            </div>
          ) : null}
          {supports.length > 0 ? (
            <ol className="space-y-3">
              {supports.map((idea, index) => (
                <li key={idea.id} className="flex gap-3 text-sm text-stone-200">
                  <span className="text-stone-400">{index + 1}.</span>
                  <span>{idea.prompt}</span>
                </li>
              ))}
            </ol>
          ) : null}
          {stalls.length > 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">
                {t.person.stallIfNeeded}
              </p>
              <ul className="mt-2 space-y-2">
                {stalls.map((idea) => (
                  <li key={idea.id} className="text-sm text-stone-300">
                    {idea.prompt}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

function ContextPreview({
  person,
  onCancel,
  onConfirm,
}: {
  person: Person;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { t } = useLocale();
  const noteCount = countNoteLines(person.notes);
  const historyCount = Math.min(person.discussions.length, 3);

  return (
    <div className="rounded-2xl border border-amber-300/70 bg-[#fffaf3] p-4 dark:border-amber-400/25 dark:bg-amber-400/10 sm:p-5">
      <h3 className="text-sm font-semibold text-foreground">
        {t.person.contextPreviewTitle}
      </h3>
      <p className="mt-1 text-xs text-muted">{t.person.contextPreviewBody}</p>
      <ul className="mt-3 space-y-1.5 text-xs text-muted">
        {t.person.prepUsesItems.map((item) => (
          <li key={item} className="flex gap-2">
            <Check className="mt-0.5 size-3 shrink-0 text-amber-700 dark:text-amber-300" />
            {item}
          </li>
        ))}
        <li className="flex gap-2 text-muted">
          <Check className="mt-0.5 size-3 shrink-0 text-amber-700 dark:text-amber-300" />
          {noteCount} notes · {historyCount} recent logs · {person.relationship}
        </li>
      </ul>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-9 rounded-xl px-3 text-xs font-semibold text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
        >
          {t.common.cancel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="h-9 rounded-xl bg-accent px-3 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          {t.person.contextPreviewContinue}
        </button>
      </div>
    </div>
  );
}

function HistoryView({
  person,
  onLogMeeting,
  onEditMeeting,
}: {
  person: Person;
  onLogMeeting: () => void;
  onEditMeeting: (discussionId: string) => void;
}) {
  const { locale, t } = useLocale();
  const dateLocale = locale === "zh-TW" ? "zh-TW" : "en";

  return (
    <section
      id="person-detail-panel-history"
      role="tabpanel"
      aria-labelledby="person-detail-tab-history"
      className="mt-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-subtle">
            {t.person.memoryEyebrow}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <h2 className="text-2xl font-semibold tracking-[-0.035em] text-foreground">
              {t.person.historyTitle(person.name.split(" ")[0])}
            </h2>
            <Hint label={t.common.moreInfo}>{t.person.historyBody}</Hint>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogMeeting}
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-border bg-surface-raised px-4 text-xs font-semibold text-foreground shadow-sm transition-colors hover:border-border-strong sm:self-auto"
        >
          <Plus className="size-3.5" />
          {t.person.addConversation}
        </button>
      </div>

      {person.discussions.length > 0 ? (
        <div className="relative mt-8">
          <span className="absolute bottom-8 left-[19px] top-5 w-px bg-border sm:left-[106px]" />
          <div className="space-y-5">
            {person.discussions.map((discussion) => (
              <article
                key={discussion.id}
                className="relative grid gap-4 pl-12 sm:grid-cols-[84px_minmax(0,1fr)] sm:pl-0"
              >
                <div className="hidden pt-4 text-right sm:block">
                  <p className="text-[11px] font-semibold text-muted">
                    {new Intl.DateTimeFormat(dateLocale, {
                      month: "short",
                      day: "numeric",
                    }).format(new Date(discussion.date))}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-subtle">
                    {new Intl.DateTimeFormat(dateLocale, {
                      year: "numeric",
                    }).format(new Date(discussion.date))}
                  </p>
                </div>
                <span
                  className={cn(
                    "absolute left-[13px] top-5 z-10 grid size-3.5 place-items-center rounded-full border-[3px] border-[#fdfcfb] dark:border-background sm:left-[100px]",
                    discussion.mood === "energized"
                      ? "bg-violet-500"
                      : discussion.mood === "positive"
                        ? "bg-emerald-500"
                        : discussion.mood === "tough"
                          ? "bg-orange-500"
                          : "bg-stone-400",
                  )}
                />
                <div className="group rounded-[20px] border border-border bg-surface-raised p-5 sm:ml-8 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium text-muted-subtle sm:hidden">
                        {formatHistoryDate(discussion.date, locale)}
                      </p>
                      <h3 className="mt-1 text-base font-semibold tracking-[-0.02em] text-foreground sm:mt-0">
                        {discussion.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 self-start">
                      <span className="inline-flex rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-medium text-muted">
                        {t.mood[discussion.mood]}
                      </span>
                      <button
                        type="button"
                        onClick={() => onEditMeeting(discussion.id)}
                        className="grid size-8 place-items-center rounded-lg text-muted-subtle opacity-100 transition-colors hover:bg-surface-muted hover:text-foreground focus:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                        aria-label={t.person.editConversation}
                      >
                        <Pencil className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-muted">
                    {discussion.summary}
                  </p>

                  {discussion.topics.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {discussion.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full border border-border bg-surface-muted px-2.5 py-1 text-[10px] font-medium text-muted"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {discussion.followUps.length > 0 ? (
                    <div className="mt-5 border-t border-border pt-4">
                      <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                        <CheckCircle2 className="size-3.5" />
                        {t.common.followUps}
                      </p>
                      <ul className="mt-2.5 space-y-2">
                        {discussion.followUps.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-xs leading-5 text-muted"
                          >
                            <span className="mt-[7px] size-1 shrink-0 rounded-full bg-muted-subtle" />
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
        <div className="mt-8 rounded-2xl border border-dashed border-border-strong bg-surface-raised px-6 py-14 text-center">
          <History className="mx-auto size-6 text-muted-subtle" />
          <h3 className="mt-3 text-sm font-semibold text-foreground">
            {t.person.noHistoryTitle}
          </h3>
          <p className="mt-1 text-xs text-muted-subtle">
            {t.person.noHistoryBody}
          </p>
        </div>
      )}
    </section>
  );
}
