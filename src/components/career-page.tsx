"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  LoaderCircle,
  Plus,
  Sparkles,
  Target,
  Trash2,
  Trophy,
} from "lucide-react";

import { RelationshipPill } from "@/components/ui-kit";
import { Hint } from "@/components/hint";
import { SaveStatus } from "@/components/save-status";
import { SecureBadge } from "@/components/secure-badge";
import { useLocale } from "@/lib/i18n";
import type {
  CareerNeed,
  CareerNeedStatus,
  CareerProfile,
  WhoToAskSuggestion,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type CareerDraft = Omit<CareerProfile, "needs">;

function careerDraftMatches(left: CareerDraft, right: CareerDraft) {
  return (
    left.targetRole === right.targetRole &&
    left.timeline === right.timeline &&
    left.direction === right.direction &&
    left.bragDoc === right.bragDoc
  );
}

interface CareerPageProps {
  career: CareerProfile;
  isRouting: boolean;
  suggestions: WhoToAskSuggestion[];
  routeSource: "ai" | "starter" | null;
  onSaveProfile: (profile: Omit<CareerProfile, "needs">) => Promise<void>;
  onAddNeed: (body: string) => Promise<void>;
  onUpdateNeedStatus: (id: string, status: CareerNeedStatus) => Promise<void>;
  onDeleteNeed: (id: string) => Promise<void>;
  onRouteNeed: (need: string) => Promise<void>;
  onPrepareWith: (personId: string, ask: string) => void;
}

export function CareerPage({
  career,
  isRouting,
  suggestions,
  routeSource,
  onSaveProfile,
  onAddNeed,
  onUpdateNeedStatus,
  onDeleteNeed,
  onRouteNeed,
  onPrepareWith,
}: CareerPageProps) {
  const { t } = useLocale();
  const [targetRole, setTargetRole] = useState(career.targetRole);
  const [timeline, setTimeline] = useState(career.timeline);
  const [direction, setDirection] = useState(career.direction);
  const [bragDoc, setBragDoc] = useState(career.bragDoc);
  const [needDraft, setNeedDraft] = useState("");
  const [routeDraft, setRouteDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const initialDraft: CareerDraft = {
    targetRole: career.targetRole,
    timeline: career.timeline,
    direction: career.direction,
    bragDoc: career.bragDoc,
  };
  const latestDraftRef = useRef<CareerDraft>(initialDraft);
  const savedDraftRef = useRef<CareerDraft>(initialDraft);
  const saveTimerRef = useRef<number | null>(null);
  const saveChainRef = useRef<Promise<void>>(Promise.resolve());
  const onSaveProfileRef = useRef(onSaveProfile);
  const mountedRef = useRef(true);

  useEffect(() => {
    onSaveProfileRef.current = onSaveProfile;
  }, [onSaveProfile]);

  const queueSave = useCallback(
    (draft: CareerDraft, reportStatus = true) => {
      if (reportStatus && mountedRef.current) {
        setSaving(true);
        setSaveError("");
      }

      const nextSave = saveChainRef.current
        .catch(() => undefined)
        .then(async () => {
          if (careerDraftMatches(draft, savedDraftRef.current)) return;
          await onSaveProfileRef.current(draft);
          savedDraftRef.current = draft;
        });

      saveChainRef.current = nextSave;

      if (reportStatus) {
        void nextSave
          .then(() => {
            if (saveChainRef.current === nextSave && mountedRef.current) {
              setSaving(false);
            }
          })
          .catch(() => {
            if (saveChainRef.current === nextSave && mountedRef.current) {
              setSaving(false);
              setSaveError(t.toast.saveFailed);
            }
          });
      }

      return nextSave;
    },
    [t.toast.saveFailed],
  );

  const scheduleSave = useCallback(
    (draft: CareerDraft) => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }

      setSaving(true);
      setSaveError("");
      saveTimerRef.current = window.setTimeout(() => {
        saveTimerRef.current = null;
        void queueSave(draft);
      }, 650);
    },
    [queueSave],
  );

  const flushSave = useCallback(async () => {
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    await queueSave(latestDraftRef.current);
  }, [queueSave]);

  useEffect(
    () => {
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
        if (saveTimerRef.current !== null) {
          window.clearTimeout(saveTimerRef.current);
          saveTimerRef.current = null;
        }
        void queueSave(latestDraftRef.current, false).catch(() => undefined);
      };
    },
    [queueSave],
  );

  function updateDraft(draft: CareerDraft) {
    latestDraftRef.current = draft;
    scheduleSave(draft);
  }

  function updateTargetRole(value: string) {
    setTargetRole(value);
    updateDraft({ ...latestDraftRef.current, targetRole: value });
  }

  function updateTimeline(value: string) {
    setTimeline(value);
    updateDraft({ ...latestDraftRef.current, timeline: value });
  }

  function updateDirection(value: string) {
    setDirection(value);
    updateDraft({ ...latestDraftRef.current, direction: value });
  }

  function updateBragDoc(value: string) {
    setBragDoc(value);
    updateDraft({ ...latestDraftRef.current, bragDoc: value });
  }

  async function handleRouteNeed(need: string) {
    try {
      await flushSave();
      await onRouteNeed(need);
    } catch {
      setSaveError(t.toast.saveFailed);
    }
  }

  async function handleAddNeed() {
    const body = needDraft.trim();
    if (!body) return;
    await onAddNeed(body);
    setNeedDraft("");
  }

  return (
    <main id="main-content" className="min-w-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[1100px] px-5 pb-36 pt-6 sm:px-8 lg:px-10 lg:pb-28 lg:pt-10">
        <header className="flex max-w-2xl items-center gap-2">
          <h1 className="text-balance text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-3xl">
            {t.career.title}
          </h1>
          <Hint label={t.common.moreInfo}>{t.career.body}</Hint>
        </header>

        <section className="mt-6 rounded-[24px] border border-secondary/15 bg-gradient-to-br from-violet-50/50 via-white to-white p-5 dark:from-secondary-soft/45 dark:via-surface-raised dark:to-surface-raised sm:p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-secondary" />
            <h2 className="text-base font-semibold text-foreground">
              {t.career.whoToAskTitle}
            </h2>
            <SecureBadge>{t.career.whoToAskBody}</SecureBadge>
          </div>

          <div className="mt-3 flex gap-2">
            <input
              name="who-to-ask"
              value={routeDraft}
              onChange={(event) => setRouteDraft(event.target.value)}
              autoComplete="off"
              placeholder={t.career.whoToAskPlaceholder}
              className="h-10 min-w-0 flex-1 rounded-xl border border-secondary/20 bg-surface px-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] focus:border-secondary/40 focus:ring-4 focus:ring-secondary/10"
            />
            <button
              type="button"
              disabled={isRouting || !routeDraft.trim()}
              onClick={() => void handleRouteNeed(routeDraft.trim())}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-secondary px-3 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 dark:text-background"
            >
              {isRouting ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                <Sparkles className="size-3.5" />
              )}
              {isRouting ? t.career.routing : t.career.whoToAskRun}
            </button>
          </div>

          {suggestions.length === 0 ? (
            <p className="mt-4 text-xs text-muted-subtle">
              {t.career.whoToAskEmpty}
            </p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {routeSource ? (
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-secondary sm:col-span-2">
                  {routeSource === "ai"
                    ? t.person.aiGenerated
                    : t.person.starterIdeas}
                </p>
              ) : null}
              {suggestions.map((suggestion) => (
                <article
                  key={`${suggestion.personId}-${suggestion.suggestedAsk}`}
                  className="rounded-2xl border border-secondary/15 bg-surface p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {suggestion.personName}
                    </h3>
                    <RelationshipPill
                      relationship={suggestion.relationship}
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-muted">
                    <span className="font-semibold text-foreground">
                      {t.career.whyThem}:{" "}
                    </span>
                    {suggestion.why}
                  </p>
                  <p className="mt-1.5 text-[11px] text-muted">
                    <span className="font-semibold text-foreground">
                      {t.career.suggestedAsk}:{" "}
                    </span>
                    {suggestion.suggestedAsk}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      onPrepareWith(
                        suggestion.personId,
                        suggestion.suggestedAsk,
                      )
                    }
                    className="mt-3 inline-flex h-8 items-center rounded-lg border border-border bg-surface-muted px-3 text-[11px] font-semibold text-foreground transition-colors hover:border-border-strong"
                  >
                    {t.career.prepareWith}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[24px] border border-border bg-surface-raised p-5 shadow-[0_14px_40px_rgb(var(--shadow-color)/0.06)] sm:p-6">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-accent" />
              <h2 className="text-base font-semibold text-foreground">
                {t.career.directionTitle}
              </h2>
              <SecureBadge />
            </div>
            <p className="mt-1 text-xs text-muted">{t.career.directionBody}</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-medium text-muted">
                {t.career.targetRole}
                <input
                  name="target-role"
                  value={targetRole}
                  onChange={(event) => updateTargetRole(event.target.value)}
                  autoComplete="off"
                  placeholder={t.career.targetRolePlaceholder}
                  className="h-10 rounded-xl border border-border bg-surface-muted px-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] focus:border-border-strong focus:bg-surface-raised focus:ring-4 focus:ring-focus/10"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-medium text-muted">
                {t.career.timeline}
                <input
                  name="career-timeline"
                  value={timeline}
                  onChange={(event) => updateTimeline(event.target.value)}
                  autoComplete="off"
                  placeholder={t.career.timelinePlaceholder}
                  className="h-10 rounded-xl border border-border bg-surface-muted px-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] focus:border-border-strong focus:bg-surface-raised focus:ring-4 focus:ring-focus/10"
                />
              </label>
            </div>

            <label className="mt-3 grid gap-1.5 text-xs font-medium text-muted">
              {t.career.directionNotes}
              <textarea
                name="career-direction"
                value={direction}
                onChange={(event) => updateDirection(event.target.value)}
                rows={4}
                maxLength={4000}
                autoComplete="off"
                placeholder={t.career.directionNotesPlaceholder}
                className="multiline-editor multiline-editor--compact"
              />
            </label>

            <button
              type="button"
              disabled={
                isRouting ||
                !(targetRole.trim() || timeline.trim() || direction.trim())
              }
              onClick={() => {
                const parts = [
                  targetRole.trim()
                    ? `Target role: ${targetRole.trim()}`
                    : null,
                  timeline.trim() ? `Timeline: ${timeline.trim()}` : null,
                  direction.trim() || null,
                ].filter(Boolean);
                void handleRouteNeed(
                  `Help me leverage my network for this career direction: ${parts.join(". ")}`,
                );
              }}
              className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-secondary/20 bg-secondary-soft px-3 text-xs font-semibold text-secondary transition-colors hover:border-secondary/35 disabled:opacity-50"
            >
              {isRouting ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                <Sparkles className="size-3.5" />
              )}
              {isRouting
                ? t.career.routing
                : t.career.leverageFromDirection}
            </button>

            <div className="mt-5 border-t border-border pt-5">
              <div className="flex items-center gap-2">
                <Trophy className="size-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-foreground">
                  {t.career.bragTitle}
                </h3>
                <SecureBadge />
              </div>
              <p className="mt-1 text-xs text-muted">{t.career.bragBody}</p>
              <textarea
                name="brag-document"
                value={bragDoc}
                onChange={(event) => updateBragDoc(event.target.value)}
                rows={8}
                maxLength={20_000}
                autoComplete="off"
                placeholder={t.career.bragPlaceholder}
                className="multiline-editor mt-3 w-full"
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <SaveStatus
                isSaving={saving}
                savedLabel={t.career.saved}
                savingLabel={t.common.saving}
                errorLabel={saveError || undefined}
                className="text-[11px]"
              />
            </div>
          </section>

          <div className="space-y-5">
            <section className="rounded-[24px] border border-border bg-surface-raised p-5 sm:p-6">
              <h2 className="text-base font-semibold text-foreground">
                {t.career.needsTitle}
              </h2>
              <SecureBadge />
              <p className="mt-1 text-xs text-muted">{t.career.needsBody}</p>

              <div className="mt-3 flex gap-2">
                <input
                  name="career-need"
                  value={needDraft}
                  onChange={(event) => setNeedDraft(event.target.value)}
                  autoComplete="off"
                  placeholder={t.career.needsPlaceholder}
                  className="h-10 min-w-0 flex-1 rounded-xl border border-border bg-surface-muted px-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] focus:border-border-strong focus:bg-surface-raised focus:ring-4 focus:ring-focus/10"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") void handleAddNeed();
                  }}
                />
                <button
                  type="button"
                  onClick={() => void handleAddNeed()}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-accent px-3 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
                >
                  <Plus className="size-3.5" />
                  {t.career.addNeed}
                </button>
              </div>

              <ul className="mt-4 space-y-2">
                {career.needs.map((need) => (
                  <NeedRow
                    key={need.id}
                    need={need}
                    onRoute={() => {
                      setRouteDraft(need.body);
                      void handleRouteNeed(need.body);
                      void onUpdateNeedStatus(need.id, "routed");
                    }}
                    onDone={() => void onUpdateNeedStatus(need.id, "done")}
                    onDelete={() => void onDeleteNeed(need.id)}
                  />
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function NeedRow({
  need,
  onRoute,
  onDone,
  onDelete,
}: {
  need: CareerNeed;
  onRoute: () => void;
  onDone: () => void;
  onDelete: () => void;
}) {
  const { t } = useLocale();
  const statusLabel =
    need.status === "done"
      ? t.career.needDone
      : need.status === "routed"
        ? t.career.needRouted
        : t.career.needOpen;

  return (
    <li className="rounded-xl border border-border bg-surface-muted/80 px-3 py-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="break-words text-sm text-foreground">{need.body}</p>
          <p
            className={cn(
              "mt-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
              need.status === "done"
                ? "text-emerald-600"
                : need.status === "routed"
                  ? "text-secondary"
                  : "text-muted-subtle",
            )}
          >
            {statusLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`${t.career.deleteNeed}?`)) onDelete();
          }}
          className="grid size-7 place-items-center rounded-lg text-muted-subtle transition-colors hover:bg-danger-soft hover:text-danger"
          aria-label={t.career.deleteNeed}
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {need.status !== "done" ? (
          <>
            <button
              type="button"
              onClick={onRoute}
              className="h-7 rounded-lg border border-border bg-surface px-2.5 text-[10px] font-semibold text-muted transition-colors hover:text-foreground"
            >
              {t.career.routeNeed}
            </button>
            <button
              type="button"
              onClick={onDone}
              className="h-7 rounded-lg border border-border bg-surface px-2.5 text-[10px] font-semibold text-muted transition-colors hover:text-foreground"
            >
              {t.career.markDone}
            </button>
          </>
        ) : null}
      </div>
    </li>
  );
}
