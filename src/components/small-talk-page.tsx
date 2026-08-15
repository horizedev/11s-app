"use client";

import {
  Lightbulb,
  LoaderCircle,
  MessageCircle,
  Newspaper,
  NotebookPen,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";

import { CategoryPill } from "@/components/ui-kit";
import { Hint } from "@/components/hint";
import { RotatingConversationSkill } from "@/components/rotating-conversation-skill";
import { SaveStatus } from "@/components/save-status";
import { SecureBadge } from "@/components/secure-badge";
import { useLocale } from "@/lib/i18n";
import { NEWS_AREAS, type NewsArea } from "@/lib/news";
import {
  CONTEXT_BANK_SLOTS,
  type GeneralPrep,
  type PrepQuota,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface SmallTalkPageProps {
  contextBank: string;
  contextSaved: boolean;
  contextSaveError: boolean;
  generalPrep: GeneralPrep;
  prepQuota: PrepQuota;
  newsAreas: NewsArea[];
  isGenerating: boolean;
  onContextBankChange: (value: string) => void;
  onNewsAreasChange: (areas: NewsArea[]) => void;
  onGenerate: () => void;
  onDismissIdea: (ideaId: string) => void;
}

export function SmallTalkPage({
  contextBank,
  contextSaved,
  contextSaveError,
  generalPrep,
  prepQuota,
  newsAreas,
  isGenerating,
  onContextBankChange,
  onNewsAreasChange,
  onGenerate,
  onDismissIdea,
}: SmallTalkPageProps) {
  const { locale, t } = useLocale();
  const remaining =
    prepQuota.limit == null
      ? null
      : Math.max(0, prepQuota.limit - prepQuota.used);

  function toggleArea(area: NewsArea) {
    if (newsAreas.includes(area)) {
      onNewsAreasChange(newsAreas.filter((item) => item !== area));
      return;
    }
    onNewsAreasChange([...newsAreas, area]);
  }

  return (
    <main id="main-content" className="min-w-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[1180px] px-5 pb-36 pt-6 sm:px-8 lg:px-10 lg:pb-28 lg:pt-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="text-balance text-2xl font-semibold leading-[1.15] tracking-[-0.04em] text-foreground sm:text-3xl">
              {t.smallTalk.title}
            </h1>
            <Hint label={t.common.moreInfo}>
              <span className="block">{t.smallTalk.body}</span>
              <span className="mt-2 block">
                {remaining == null
                  ? t.person.prepQuotaUnlimited
                  : t.person.prepQuota(remaining, prepQuota.limit ?? 0)}
                {generalPrep.source
                  ? ` · ${
                      generalPrep.source === "ai"
                        ? t.person.aiGenerated
                        : t.person.starterIdeas
                    }`
                  : ""}
                {newsAreas.length > 0
                  ? ` · ${t.smallTalk.newsActive(newsAreas.length)}`
                  : ""}
              </span>
            </Hint>
          </div>
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground shadow-[0_8px_22px_rgb(var(--shadow-color)/0.12)] transition-[transform,background-color,box-shadow] hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_10px_26px_rgb(var(--shadow-color)/0.16)] disabled:opacity-60 sm:self-auto"
          >
            {isGenerating ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {isGenerating
              ? t.person.thinking
              : generalPrep.ideas.length > 0
                ? t.overview.refreshSmallTalk
                : t.overview.generateSmallTalk}
          </button>
        </header>

        <section className="mt-6">
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface-muted text-muted">
              <Newspaper className="size-4" strokeWidth={1.7} />
            </span>
            <div className="flex min-w-0 items-center gap-1.5">
              <h2 className="text-sm font-semibold text-foreground">
                {t.smallTalk.newsTitle}
              </h2>
              <Hint label={t.common.moreInfo}>{t.smallTalk.newsBody}</Hint>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {NEWS_AREAS.map((area) => {
              const selected = newsAreas.includes(area);
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleArea(area)}
                  aria-pressed={selected}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                    selected
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground",
                  )}
                >
                  {t.smallTalk.newsAreas[area]}
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section className="flex min-h-[28rem] flex-col rounded-[24px] border border-border bg-surface-raised p-5 shadow-[0_14px_40px_rgb(var(--shadow-color)/0.06)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <NotebookPen
                    className="size-4 text-[#b56547]"
                    strokeWidth={1.7}
                  />
                  {t.overview.contextBankTitle}
                  <SecureBadge>{t.overview.contextBankBody}</SecureBadge>
                </p>
              </div>
              <SaveStatus
                isSaving={!contextSaved && !contextSaveError}
                savedLabel={t.common.saved}
                savingLabel={t.common.saving}
                errorLabel={
                  contextSaveError ? t.toast.saveFailed : undefined
                }
              />
            </div>

            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
              {CONTEXT_BANK_SLOTS.map((slot) => (
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
                  className="shrink-0 rounded-full border border-border bg-surface-muted px-2.5 py-1 text-[10px] font-semibold text-muted transition-[border-color,color] hover:border-border-strong hover:text-foreground"
                >
                  <Plus className="mr-1 inline size-2.5" />
                  {t.overview.contextSlots[slot].label}
                </button>
              ))}
            </div>

            <textarea
              name="small-talk-context-bank"
              value={contextBank}
              onChange={(event) => onContextBankChange(event.target.value)}
              maxLength={12_000}
              autoComplete="off"
              placeholder={t.overview.contextBankPlaceholder}
              className="multiline-editor mt-4 flex-1"
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted-subtle">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="size-3 text-emerald-500" />
                <Hint label={t.common.moreInfo} side="top">
                  {t.overview.contextPrivate}
                </Hint>
              </span>
              <span className="tabular-nums">
                {contextBank.length.toLocaleString(locale)} / 12,000
              </span>
            </div>
          </section>

          <section className="flex min-h-[28rem] flex-col rounded-[24px] border border-border bg-gradient-to-br from-amber-50/60 via-white to-violet-50/40 p-5 shadow-[0_14px_40px_rgb(var(--shadow-color)/0.06)] dark:from-amber-950/20 dark:via-surface-raised dark:to-secondary-soft/30 sm:p-6">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <MessageCircle
                className="size-4 text-amber-600 dark:text-amber-300"
                strokeWidth={1.8}
              />
              {t.overview.smallTalkTitle}
              <Hint label={t.common.moreInfo}>{t.overview.smallTalkBody}</Hint>
            </p>

            {generalPrep.opening ? (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200/70 bg-surface/80 px-4 py-3 dark:border-amber-500/20">
                <Lightbulb
                  className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-300"
                  strokeWidth={1.8}
                />
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-amber-700 dark:text-amber-300">
                    {t.overview.smallTalkOpening}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    {generalPrep.opening}
                  </p>
                </div>
              </div>
            ) : null}

            {generalPrep.ideas.length > 0 ? (
              <div className="mt-3 flex-1 space-y-2.5 overflow-y-auto pr-1">
                {generalPrep.ideas.map((idea) => (
                  <article
                    key={idea.id}
                    className="group rounded-2xl border border-border bg-surface/90 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <CategoryPill category={idea.category} />
                        <h3 className="mt-2 text-sm font-semibold text-foreground">
                          {idea.title}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDismissIdea(idea.id)}
                        className="grid size-7 shrink-0 place-items-center rounded-lg text-muted-subtle opacity-100 transition-[background-color,color,opacity] hover:bg-danger-soft hover:text-danger focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                        aria-label={t.person.dismiss(idea.title)}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                    <p className="mt-2 text-[11px] leading-5 text-muted">
                      {idea.rationale}
                    </p>
                    <div className="mt-2.5 rounded-xl bg-amber-50/80 px-3 py-2.5 dark:bg-amber-400/10">
                      <p className="text-[11px] font-medium leading-5 text-foreground">
                        “{idea.prompt}”
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-amber-200 bg-surface/60 px-6 py-10 text-center dark:border-amber-500/20">
                <span className="grid size-11 place-items-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300">
                  <MessageCircle className="size-5" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-foreground">
                  {t.overview.smallTalkEmptyTitle}
                </h3>
                <p className="mt-1.5 max-w-sm text-xs leading-5 text-muted-subtle">
                  {t.smallTalk.emptyWithNews}
                </p>
              </div>
            )}
          </section>
        </div>

        <RotatingConversationSkill kind="small-talk" className="mt-8" />
      </div>
    </main>
  );
}
