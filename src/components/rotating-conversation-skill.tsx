"use client";

import { Lightbulb, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import {
  getConversationSkills,
  getSkillCopy,
  type ConversationSkill,
  type ConversationSkillKind,
} from "@/lib/conversation-skills";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function RotatingConversationSkill({
  kind,
  className,
}: {
  kind: ConversationSkillKind;
  className?: string;
}) {
  const { locale, t } = useLocale();
  const skills = getConversationSkills(kind);
  // Pick a random skill on mount (client-only) so server-rendered HTML,
  // which renders the placeholder below, always matches hydration.
  const [skill, setSkill] = useState<ConversationSkill | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-time random pick is intentionally client-only
    setSkill(skills[Math.floor(Math.random() * skills.length)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pick once per mount
  }, []);
  const isSmallTalk = kind === "small-talk";

  return (
    <aside
      aria-label={
        isSmallTalk
          ? t.conversationSkills.smallTalkEyebrow
          : t.conversationSkills.oneOnOneEyebrow
      }
      className={cn(
        "relative overflow-hidden rounded-[24px] border p-5 shadow-[0_16px_40px_rgb(var(--shadow-color)/0.08)] sm:p-6",
        isSmallTalk
          ? "border-amber-200/80 bg-gradient-to-br from-amber-50 via-surface-raised to-violet-50/70 dark:border-amber-500/20 dark:from-amber-950/25 dark:via-surface-raised dark:to-secondary-soft/45"
          : "border-secondary/20 bg-gradient-to-br from-secondary-soft/70 via-surface-raised to-blue-50/70 dark:from-secondary-soft/55 dark:via-surface-raised dark:to-blue-950/20",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-10 -top-12 size-40 rounded-full blur-3xl",
          isSmallTalk ? "bg-amber-300/35" : "bg-secondary/25",
        )}
      />
      <div className="relative">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "grid size-9 place-items-center rounded-xl",
              isSmallTalk
                ? "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
                : "bg-secondary-soft text-secondary",
            )}
          >
            {isSmallTalk ? (
              <Lightbulb className="size-4" strokeWidth={1.8} />
            ) : (
              <Sparkles className="size-4" strokeWidth={1.8} />
            )}
          </span>
          <p
            className={cn(
              "text-[10px] font-bold uppercase tracking-[0.14em]",
              isSmallTalk ? "text-amber-700 dark:text-amber-300" : "text-secondary",
            )}
          >
            {isSmallTalk
              ? t.conversationSkills.smallTalkEyebrow
              : t.conversationSkills.oneOnOneEyebrow}
          </p>
        </div>

        {skill ? (
          <div aria-live="polite" className="mt-4 max-w-2xl">
            <h2 className="text-balance text-lg font-semibold tracking-[-0.025em] text-foreground">
              {getSkillCopy(skill, locale).title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {getSkillCopy(skill, locale).description}
            </p>
            <div
              className={cn(
                "mt-4 rounded-xl border px-3.5 py-3",
                isSmallTalk
                  ? "border-amber-200/70 bg-surface/80 dark:border-amber-500/20"
                  : "border-secondary/15 bg-surface/80",
              )}
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted-subtle">
                {t.conversationSkills.practice}
              </p>
              <p className="mt-1.5 text-xs font-medium leading-5 text-foreground">
                {getSkillCopy(skill, locale).practice}
              </p>
            </div>
          </div>
        ) : (
          <div aria-hidden="true" className="mt-4 max-w-2xl animate-pulse">
            <div className="h-6 w-2/3 rounded-lg bg-surface-muted" />
            <div className="mt-3 h-4 w-full rounded-lg bg-surface-muted" />
            <div
              className={cn(
                "mt-4 h-16 rounded-xl border",
                isSmallTalk
                  ? "border-amber-200/70 bg-surface/80 dark:border-amber-500/20"
                  : "border-secondary/15 bg-surface/80",
              )}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
