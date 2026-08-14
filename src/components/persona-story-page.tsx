"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookmarkCheck,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Clock3,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  LockKeyhole,
  MessageCircle,
  NotebookPen,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, RelationshipPill } from "@/components/ui-kit";
import { useLocale } from "@/lib/i18n";
import {
  getPersonaStory,
  type PersonaSlug,
} from "@/lib/persona-stories";
import { cn } from "@/lib/utils";

const copy = {
  en: {
    back: "All use cases",
    story: "The story",
    workspace: "Workspace preview",
    outcome: "What changed",
    goal: "A personal goal",
    chapters: "The shift",
    workspaceEyebrow: "A workspace full of this story",
    context: "In context",
    notes: "Notes for next time",
    coach: "Conversation coach",
    history: "Memory to carry forward",
    privacy: "Private by design",
    explore: "See the workspace",
    finalEyebrow: "Make the next conversation count",
    finalTitle: "Bring your own story into the room.",
    finalBody:
      "Start with the person, the moment, and the goal that matters to you. 11s will help you carry it forward.",
    finalCta: "Open your workspace",
    footer: "Better 1:1s, built around the people you already know.",
  },
  "zh-TW": {
    back: "所有使用場景",
    story: "這段故事",
    workspace: "工作區預覽",
    outcome: "帶來的改變",
    goal: "一個真實目標",
    chapters: "轉變的過程",
    workspaceEyebrow: "一個裝滿這段故事的工作區",
    context: "已納入的脈絡",
    notes: "留給下次的筆記",
    coach: "對話教練",
    history: "帶到下次的記憶",
    privacy: "私密，且由你決定",
    explore: "看看工作區",
    finalEyebrow: "讓下一段對話更有份量",
    finalTitle: "把你自己的故事帶進現場。",
    finalBody:
      "從那個人、那個時刻，和真正重要的目標開始。11s 會幫你把它帶往下一次對話。",
    finalCta: "開啟你的工作區",
    footer: "更好的一對一，從你本來就認識的人開始。",
  },
} as const;

const personaIcons = {
  professionals: BriefcaseBusiness,
  "people-managers": UsersRound,
  "fresh-grads": GraduationCap,
  "professional-network": MessageCircle,
  "family-friends": HeartHandshake,
} as const;

const chapterIcons = [NotebookPen, Lightbulb, BookmarkCheck] as const;

export function PersonaStoryPage({ persona }: { persona: PersonaSlug }) {
  const { locale, t } = useLocale();
  const story = getPersonaStory(persona, locale);
  const ui = copy[locale];
  const PersonaIcon = personaIcons[persona];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between gap-3 px-3 sm:px-8">
          <Link
            href="/#use-cases"
            className="group inline-flex min-w-0 items-center gap-2 rounded-xl text-xs font-semibold text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-3.5 transition-transform group-hover:-translate-x-0.5"
            />
            <span className="truncate">{ui.back}</span>
          </Link>

          <Link
            href="/"
            className="hidden items-center gap-2.5 rounded-xl sm:flex"
            aria-label={t.landing.homeAria}
          >
            <BrandLogo size={32} />
            <span className="text-sm font-semibold tracking-[-0.02em]">
              {t.common.brand}
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ThemeToggle compact />
            <LanguageToggle compact />
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="relative isolate overflow-hidden border-b border-border py-16 sm:py-20 lg:py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-[10%] top-[-8rem] size-72 rounded-full bg-accent-soft/80 blur-3xl" />
            <div className="absolute right-[5%] top-12 size-80 rounded-full bg-secondary-soft/75 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.3] [background-image:radial-gradient(#b9afa6_0.75px,transparent_0.75px)] [background-size:22px_22px] dark:opacity-[0.08]" />
          </div>

          <div className="mx-auto grid max-w-[1180px] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.65fr)] lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted shadow-sm">
                <span
                  className="grid size-5 place-items-center rounded-full text-white"
                  style={{ backgroundColor: story.person.color }}
                >
                  <PersonaIcon aria-hidden="true" className="size-3" />
                </span>
                {story.eyebrow}
              </div>
              <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.055em] text-foreground sm:text-5xl lg:text-6xl">
                {story.hero.title}
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-accent sm:text-xl">
                {story.hero.accent}
              </p>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-muted sm:text-lg sm:leading-8">
                {story.hero.body}
              </p>
              <a
                href="#workspace"
                className="group mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-[0_8px_24px_rgb(var(--shadow-color)/0.14)] transition-[transform,background-color,box-shadow] hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_12px_28px_rgb(var(--shadow-color)/0.18)]"
              >
                {ui.explore}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <aside className="relative overflow-hidden rounded-[28px] border border-border bg-surface-raised p-6 shadow-[0_20px_60px_rgb(var(--shadow-color)/0.1)] sm:p-7">
              <div
                className="pointer-events-none absolute -right-12 -top-16 size-40 rounded-full opacity-25 blur-2xl"
                style={{ backgroundColor: story.person.color }}
              />
              <div className="relative">
                <Avatar
                  name={story.person.name}
                  color={story.person.color}
                  size="lg"
                />
                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-subtle">
                  {ui.goal}
                </p>
                <p className="mt-2 text-lg font-semibold leading-7 tracking-[-0.025em] text-foreground">
                  {story.hero.goal}
                </p>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="text-sm font-semibold text-foreground">
                    {story.person.name}
                  </p>
                  <p className="mt-1 text-xs text-muted">{story.person.role}</p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <nav
          className="border-b border-border bg-surface/60"
          aria-label={story.eyebrow}
        >
          <div className="mx-auto flex max-w-[1180px] items-center gap-5 overflow-x-auto px-5 py-3 text-xs font-semibold text-muted sm:px-8">
            <a className="whitespace-nowrap transition-colors hover:text-foreground" href="#story">
              {ui.story}
            </a>
            <a className="whitespace-nowrap transition-colors hover:text-foreground" href="#workspace">
              {ui.workspace}
            </a>
            <a className="whitespace-nowrap transition-colors hover:text-foreground" href="#outcome">
              {ui.outcome}
            </a>
          </div>
        </nav>

        <section
          id="story"
          className="scroll-mt-24 border-b border-border bg-surface/55 py-20 sm:py-24"
          aria-labelledby="story-heading"
        >
          <div className="mx-auto grid max-w-[1180px] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)]">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">
                {story.tension.label}
              </p>
              <h2
                id="story-heading"
                className="mt-4 max-w-md text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-foreground sm:text-4xl"
              >
                {story.tension.title}
              </h2>
              <p className="mt-5 max-w-md text-pretty text-base leading-7 text-muted">
                {story.tension.body}
              </p>
            </div>

            <ol className="grid gap-4">
              {story.chapters.map((chapter, index) => {
                const ChapterIcon = chapterIcons[index] ?? BookmarkCheck;
                return (
                  <li
                    key={chapter.title}
                    className="group rounded-[24px] border border-border bg-surface-raised p-5 shadow-[0_1px_2px_rgb(var(--shadow-color)/0.03)] transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-[0_14px_36px_rgb(var(--shadow-color)/0.08)] sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className="grid size-11 shrink-0 place-items-center rounded-2xl text-white"
                        style={{ backgroundColor: story.person.color }}
                      >
                        <ChapterIcon aria-hidden="true" className="size-4" strokeWidth={1.8} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted-subtle">
                          {chapter.label}
                        </p>
                        <h3 className="mt-1.5 text-lg font-semibold tracking-[-0.025em] text-foreground">
                          {chapter.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-muted">
                          {chapter.body}
                        </p>
                        <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
                          <Check aria-hidden="true" className="size-3.5" />
                          {chapter.outcome}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section
          id="workspace"
          className="scroll-mt-24 py-20 sm:py-24"
          aria-labelledby="workspace-heading"
        >
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-secondary">
                {ui.workspaceEyebrow}
              </p>
              <h2
                id="workspace-heading"
                className="mt-4 text-balance text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl"
              >
                {story.workspace.label}
              </h2>
            </div>

            <PersonaWorkspacePreview story={story} ui={ui} />
          </div>
        </section>

        <section
          id="outcome"
          className="scroll-mt-24 border-y border-border bg-[#24211f] px-5 py-20 text-white sm:px-8 sm:py-24"
          aria-labelledby="outcome-heading"
        >
          <div className="mx-auto grid max-w-[1080px] gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#d9a58f]">
                {story.outcome.label}
              </p>
              <h2
                id="outcome-heading"
                className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-4xl"
              >
                {story.outcome.title}
              </h2>
              <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-stone-300">
                {story.outcome.body}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {story.outcome.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-5"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-400/10 text-emerald-300">
                    <Check aria-hidden="true" className="size-4" />
                  </span>
                  <p className="text-xs leading-5 text-stone-200">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 text-center sm:px-8 sm:py-24">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-[28px] border border-border bg-gradient-to-br from-[#fff8f4] via-white to-[#f4f1fa] px-6 py-14 shadow-[0_18px_50px_rgb(var(--shadow-color)/0.07)] dark:from-accent-soft/55 dark:via-surface-raised dark:to-secondary-soft/50 sm:px-10">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent">
              <Sparkles aria-hidden="true" className="size-5" strokeWidth={1.7} />
            </span>
            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">
              {ui.finalEyebrow}
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-foreground sm:text-5xl">
              {ui.finalTitle}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-sm leading-7 text-muted sm:text-base">
              {ui.finalBody}
            </p>
            <Link
              href="/workspace"
              className="group mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-[0_8px_24px_rgb(var(--shadow-color)/0.14)] transition-[transform,background-color,box-shadow] hover:-translate-y-0.5 hover:bg-accent-hover"
            >
              {ui.finalCta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-4 px-5 py-7 text-center sm:flex-row sm:px-8 sm:text-left">
          <div className="flex items-center gap-2.5">
            <BrandLogo size={28} className="rounded-[9px]" />
            <p className="text-[11px] font-medium text-muted">{ui.footer}</p>
          </div>
          <nav
            className="flex items-center gap-4 text-[11px] font-semibold text-muted"
            aria-label={t.landing.footerNavAria}
          >
            <Link href="/pricing" className="transition-colors hover:text-foreground">
              {t.landing.footerPricing}
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              {t.landing.footerTerms}
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              {t.landing.footerPrivacy}
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function PersonaWorkspacePreview({
  story,
  ui,
}: {
  story: ReturnType<typeof getPersonaStory>;
  ui: (typeof copy)[keyof typeof copy];
}) {
  const { t } = useLocale();
  const active = story.workspace.activeContact;

  return (
    <figure className="relative mx-auto mt-12 max-w-[1180px]">
      <figcaption className="sr-only">{story.workspace.label}</figcaption>
      <div className="absolute inset-x-[14%] bottom-[-6%] h-[42%] rounded-full bg-[linear-gradient(90deg,var(--accent),var(--secondary))] opacity-15 blur-3xl dark:opacity-20" />
      <div className="relative overflow-hidden rounded-[24px] border border-border-strong bg-surface-raised p-1.5 shadow-[0_35px_90px_rgb(var(--shadow-color)/0.18),0_5px_20px_rgb(var(--shadow-color)/0.08)] sm:rounded-[28px] sm:p-2">
        <div className="flex h-11 items-center gap-1.5 rounded-t-[17px] border-b border-border bg-surface-muted px-3 sm:h-12 sm:rounded-t-[21px] sm:px-4">
          <span aria-hidden="true" className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#db8a6b] sm:size-2.5" />
            <span className="size-2 rounded-full bg-[#dfbd6a] sm:size-2.5" />
            <span className="size-2 rounded-full bg-[#78a990] sm:size-2.5" />
          </span>
          <span className="mx-auto flex h-6 min-w-0 max-w-60 flex-1 items-center justify-center truncate rounded-lg border border-border/70 bg-surface/80 px-3 text-[8px] font-medium text-muted-subtle sm:text-[9px]">
            11s.app/workspace
          </span>
          <span className="hidden text-[9px] font-semibold text-muted-subtle sm:block">
            {ui.privacy}
          </span>
        </div>

        <div className="grid min-h-[620px] bg-background lg:grid-cols-[242px_minmax(0,1fr)]">
          <aside className="hidden min-h-0 border-r border-border bg-sidebar p-4 lg:flex lg:flex-col">
            <div className="flex items-center gap-2.5 px-1.5 py-1">
              <BrandLogo size={28} className="rounded-[8px]" />
              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold text-foreground">
                  {story.person.name}
                </p>
                <p className="mt-0.5 text-[7px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                  {story.eyebrow}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-surface-raised p-2.5 shadow-sm">
              <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                {t.common.people}
              </p>
              <div className="mt-2.5 space-y-1">
                {story.workspace.contacts.map((contact) => {
                  const selected = contact.name === active.name;
                  return (
                    <div
                      key={contact.name}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-2 py-1.5",
                        selected
                          ? "bg-foreground text-background shadow-sm"
                          : "text-muted",
                      )}
                    >
                      <span
                        className="grid size-6 shrink-0 place-items-center rounded-full text-[8px] font-semibold leading-none text-white"
                        style={{ backgroundColor: contact.color }}
                      >
                        {contact.initials}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block truncate text-[9px] font-semibold",
                            selected ? "text-background" : "text-foreground",
                          )}
                        >
                          {contact.name}
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 block truncate text-[7px]",
                            selected
                              ? "text-background/70"
                              : "text-muted-subtle",
                          )}
                        >
                          {contact.timing}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-auto rounded-xl border border-border bg-surface/75 p-3">
              <p className="flex items-center gap-1.5 text-[8px] font-semibold text-muted">
                <LockKeyhole aria-hidden="true" className="size-3 text-success" />
                {story.workspace.privacy}
              </p>
            </div>
          </aside>

          <div className="min-w-0 p-4 sm:p-6 lg:p-8">
            <div className="mb-5 flex items-center justify-between border-b border-border pb-3 lg:hidden">
              <div className="flex min-w-0 items-center gap-2">
                <BrandLogo size={26} className="rounded-lg" />
                <span className="truncate text-[10px] font-semibold text-foreground">
                  {story.workspace.label}
                </span>
              </div>
              <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-[8px] font-semibold text-accent">
                {story.workspace.meetingStatus}
              </span>
            </div>

            <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="grid size-11 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-white"
                  style={{ backgroundColor: active.color }}
                >
                  {active.initials}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold tracking-[-0.02em] text-foreground sm:text-base">
                      {active.name}
                    </p>
                    <RelationshipPill relationship={active.relationship} compact />
                  </div>
                  <p className="mt-0.5 truncate text-[9px] text-muted sm:text-[10px]">
                    {active.role} · {story.workspace.meetingMeta}
                  </p>
                </div>
              </div>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-foreground px-3 py-2 text-[9px] font-semibold text-background">
                <Clock3 aria-hidden="true" className="size-3" />
                {story.workspace.meetingStatus}
              </span>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
              <section className="overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-[0_8px_24px_rgb(var(--shadow-color)/0.05)]">
                <div className="border-b border-border bg-gradient-to-r from-[#fff9f5] via-white to-violet-50/60 px-4 py-3 dark:from-accent-soft/55 dark:via-surface-raised dark:to-secondary-soft/60 sm:px-5">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold text-foreground">
                    <Target aria-hidden="true" className="size-3.5 text-accent" />
                    {ui.context}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {story.workspace.context.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-border bg-surface-muted px-2 py-1 text-[8px] font-semibold text-muted"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold text-foreground">
                    <NotebookPen aria-hidden="true" className="size-3.5 text-accent" />
                    {ui.notes}
                  </p>
                  <div className="mt-3 space-y-2 rounded-xl border border-accent/20 bg-accent-soft/45 p-3.5">
                    {story.workspace.notes.map((note) => (
                      <p
                        key={note}
                        className="flex items-start gap-2 text-[10px] leading-5 text-muted"
                      >
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                        {note}
                      </p>
                    ))}
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-[0_8px_24px_rgb(var(--shadow-color)/0.05)]">
                <div className="bg-[#24211f] px-4 py-3.5 text-white sm:px-5">
                  <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#e4af98]">
                    <Sparkles aria-hidden="true" className="size-3" />
                    {ui.coach}
                  </p>
                  <p className="mt-1.5 text-[11px] font-semibold">
                    {story.workspace.meetingTitle}
                  </p>
                </div>
                <div className="p-4 sm:p-5">
                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-amber-700 dark:text-amber-300">
                    {story.workspace.lead.label}
                  </p>
                  <div className="mt-1.5 rounded-xl border border-amber-200 bg-[#fffaf3] p-3 dark:border-amber-500/25 dark:bg-amber-400/10">
                    <p className="text-[10px] font-semibold leading-4 text-foreground">
                      {story.workspace.lead.title}
                    </p>
                    <p className="mt-1.5 text-[9px] leading-4 text-muted">
                      “{story.workspace.lead.prompt}”
                    </p>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {story.workspace.supports.map((support) => (
                      <div
                        key={support.title}
                        className="rounded-xl border border-secondary/15 bg-surface-muted/65 p-3"
                      >
                        <span className="rounded-full bg-secondary-soft px-1.5 py-0.5 text-[7px] font-semibold text-secondary">
                          {support.label}
                        </span>
                        <p className="mt-2 text-[9px] font-semibold leading-4 text-foreground">
                          {support.title}
                        </p>
                        <p className="mt-1 text-[8px] leading-4 text-muted">
                          “{support.prompt}”
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <section className="mt-4 rounded-2xl border border-border bg-surface-raised p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary-soft text-secondary">
                  <ChevronRight aria-hidden="true" className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                    {ui.history} · {story.workspace.history.date}
                  </p>
                  <h3 className="mt-1 text-xs font-semibold text-foreground">
                    {story.workspace.history.title}
                  </h3>
                  <p className="mt-1.5 text-[10px] leading-5 text-muted">
                    {story.workspace.history.summary}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </figure>
  );
}
