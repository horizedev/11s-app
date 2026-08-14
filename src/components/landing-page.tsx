"use client";

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  HeartHandshake,
  History,
  House,
  LockKeyhole,
  MessageSquareText,
  NotebookPen,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ConversationLoop } from "@/components/conversation-loop";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { LEGAL_CONTACT_EMAIL } from "@/lib/legal";
import { useLocale } from "@/lib/i18n";

const featureMeta = [
  {
    number: "01",
    icon: History,
    accent: "bg-secondary-soft text-secondary",
    card:
      "from-[#f7f4fb] to-white dark:from-secondary-soft/55 dark:to-surface-raised",
  },
  {
    number: "02",
    icon: NotebookPen,
    accent: "bg-accent-soft text-accent",
    card:
      "from-[#fff8f4] to-white dark:from-accent-soft/60 dark:to-surface-raised",
  },
  {
    number: "03",
    icon: Sparkles,
    accent:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
    card:
      "from-[#f3faf6] to-white dark:from-emerald-950/25 dark:to-surface-raised",
  },
];

const stepMeta = [
  { icon: NotebookPen, tint: "bg-accent-soft text-accent" },
  { icon: Brain, tint: "bg-secondary-soft text-secondary" },
  {
    icon: MessageSquareText,
    tint:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  },
  {
    icon: RotateCcw,
    tint:
      "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
  },
];

const talkingPointColors = [
  "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
  "bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
];

const roleMeta = [
  { color: "#7c6fa4" },
  { color: "#bd7257" },
  { color: "#4e8876" },
  { color: "#9d6581" },
  { color: "#4f78a0" },
];

export function LandingPage() {
  const { locale, t } = useLocale();
  const isZh = locale === "zh-TW";
  const sectionLabelClass = isZh
    ? "text-[10px] font-semibold tracking-[0.1em]"
    : "text-[10px] font-semibold uppercase tracking-[0.16em]";
  const features = featureMeta.map((meta, index) => ({
    ...meta,
    ...t.landing.features[index],
  }));

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(164,81,53,0.09),transparent_34%),radial-gradient(circle_at_82%_8%,rgba(109,96,149,0.11),transparent_32%),radial-gradient(circle_at_70%_78%,rgba(61,120,101,0.08),transparent_36%)] dark:opacity-70" />
        <div className="absolute inset-0 opacity-[0.28] [background-image:radial-gradient(#b9afa6_0.75px,transparent_0.75px)] [background-size:22px_22px] dark:opacity-[0.08]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-transparent bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/72">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-3 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-xl"
            aria-label={t.landing.homeAria}
          >
            <BrandLogo size={44} />
            <span className="hidden text-[15px] font-semibold tracking-[-0.025em] sm:inline">
              {t.common.brand}
            </span>
          </Link>

          <nav
            className="hidden items-center gap-7 text-xs font-medium text-muted md:flex"
            aria-label={t.landing.navAria}
          >
            <a className="transition-colors hover:text-foreground" href="#why-11s">
              {t.landing.navWhy}
            </a>
            <a className="transition-colors hover:text-foreground" href="#how-it-works">
              {t.landing.navHow}
            </a>
            <a className="transition-colors hover:text-foreground" href="#use-cases">
              {t.landing.navUseCases}
            </a>
            <a className="transition-colors hover:text-foreground" href="#privacy">
              {t.landing.navPrivacy}
            </a>
            <Link className="transition-colors hover:text-foreground" href="/pricing">
              {t.landing.navPricing}
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle compact />
            <LanguageToggle compact />
            <Link
              href="/workspace"
              aria-label={t.landing.openWorkspace}
              className="group inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-accent px-3 text-xs font-semibold text-accent-foreground shadow-[0_8px_22px_rgb(var(--shadow-color)/0.12)] transition-[transform,background-color,box-shadow] hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_12px_26px_rgb(var(--shadow-color)/0.16)] sm:px-4"
            >
              <span className="sm:hidden">{isZh ? "開啟" : "Open"}</span>
              <span className="hidden whitespace-nowrap sm:inline">
                {t.landing.openWorkspace}
              </span>
              <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="relative isolate pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
          <div className="pointer-events-none absolute inset-x-0 top-[-76px] -z-10 h-[760px] overflow-hidden">
            <div className="absolute left-1/2 top-[-440px] h-[850px] w-[1050px] -translate-x-1/2 rounded-full border border-stone-200/80" />
            <div className="absolute left-1/2 top-[-330px] h-[650px] w-[810px] -translate-x-1/2 rounded-full border border-stone-200/70" />
            <div className="absolute left-[14%] top-32 size-52 rounded-full bg-[#efe4dd]/70 blur-3xl" />
            <div className="absolute right-[10%] top-16 size-64 rounded-full bg-[#e6e2f0]/70 blur-3xl" />
          </div>

          <div className="mx-auto max-w-[1050px] px-5 text-center sm:px-8">
            <h1
              className={`mx-auto max-w-4xl break-words text-balance font-semibold text-foreground ${
                isZh
                  ? "text-[2.1rem] leading-[1.16] tracking-[-0.03em] sm:text-[3.3rem] lg:text-[4.15rem]"
                  : "text-[2.5rem] leading-[1.02] tracking-[-0.05em] sm:text-[3.9rem] lg:text-[5rem]"
              }`}
            >
              {isZh ? (
                <>
                  <span className="block">{t.landing.heroLead}</span>
                  <span className="mt-2 block bg-gradient-to-r from-accent via-[#bd7257] to-secondary bg-clip-text font-serif font-semibold text-transparent sm:mt-4">
                    {t.landing.heroAccent}
                  </span>
                </>
              ) : (
                <>
                  <span className="block">{t.landing.heroLead}</span>
                  <span className="mt-3 block font-serif font-normal italic tracking-[-0.045em] text-accent sm:mt-4">
                    {t.landing.heroAccent}
                  </span>
                </>
              )}
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-7 text-muted sm:text-lg sm:leading-8">
              {t.landing.heroBody}
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/workspace"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-[0_8px_24px_rgb(var(--shadow-color)/0.14)] transition-[transform,background-color,box-shadow] hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_12px_28px_rgb(var(--shadow-color)/0.18)] sm:w-auto"
              >
                {t.landing.ctaPrimary}
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[14px] border border-border bg-surface/75 px-5 text-sm font-semibold text-muted shadow-sm transition-[border-color,background-color,color] hover:border-border-strong hover:bg-surface-raised hover:text-foreground sm:w-auto"
              >
                {t.landing.ctaSecondary}
                <ChevronRight className="size-3.5" />
              </a>
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-medium text-muted-subtle">
              <LockKeyhole className="size-3" />
              {t.landing.noAccount}
            </p>
          </div>

          <ProductPreview />

          <div className="mx-auto mt-12 max-w-[950px] px-5 sm:mt-16 sm:px-8">
            <p
              className={`text-center text-muted-subtle ${sectionLabelClass}`}
            >
              {t.landing.rolesLabel}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:gap-x-8">
              {t.landing.roles.map((role, index) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/75 px-3 py-1.5 text-xs font-medium text-muted shadow-sm backdrop-blur"
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{
                      backgroundColor: roleMeta[index]?.color,
                    }}
                  />
                  {role}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section
          id="use-cases"
          className="scroll-mt-24 border-t border-border bg-surface/70 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className={`text-accent ${sectionLabelClass}`}>
                {t.landing.useCasesEyebrow}
              </p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
                {t.landing.useCasesTitle}
              </h2>
              <p className="mt-4 text-pretty text-base leading-7 text-muted sm:text-lg">
                {t.landing.useCasesBody}
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {t.landing.useCases.map((useCase, index) => {
                const icons = [
                  BriefcaseBusiness,
                  UsersRound,
                  GraduationCap,
                  MessageSquareText,
                  HeartHandshake,
                ] as const;
                const Icon = icons[index] ?? UsersRound;
                return (
                  <Link
                    key={useCase.id}
                    href={`/stories/${useCase.id}`}
                    aria-label={t.landing.useCaseAria(useCase.title)}
                    className="group flex items-start gap-3.5 rounded-2xl border border-border bg-surface-raised p-5 transition-[border-color,background-color] hover:border-border-strong hover:bg-surface"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                      <Icon className="size-4" strokeWidth={1.7} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <h3 className="text-base font-semibold text-foreground">
                          {useCase.title}
                        </h3>
                        <ArrowRight className="size-3.5 shrink-0 self-center text-muted-subtle transition group-hover:translate-x-0.5 group-hover:text-accent" />
                      </span>
                      <p className="mt-0.5 text-[11px] font-semibold text-accent">
                        {useCase.audience}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {useCase.description}
                      </p>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="why-11s"
          className="scroll-mt-24 border-y border-border bg-background py-16 sm:py-24"
        >
          <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <div>
                <p className={`text-accent ${sectionLabelClass}`}>
                  {t.landing.whyEyebrow}
                </p>
                <h2 className="mt-4 max-w-md text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.05em] text-foreground sm:text-5xl">
                  {t.landing.whyTitle}
                </h2>
              </div>
              <div className="max-w-xl lg:justify-self-end">
                <p className="text-pretty text-base leading-7 text-muted sm:text-lg sm:leading-8">
                  {t.landing.whyBody}
                </p>
              </div>
            </div>

            <div className="mt-16 grid gap-4 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article
                    key={feature.number}
                    className={`group rounded-[24px] border border-border bg-gradient-to-br ${feature.card} p-6 transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_18px_50px_rgb(var(--shadow-color)/0.09)] sm:p-7`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`relative grid size-12 place-items-center rounded-2xl ${feature.accent}`}
                      >
                        <Icon className="size-5" strokeWidth={1.7} />
                      </span>
                      <span className="text-[10px] font-semibold tracking-[0.12em] text-muted-subtle">
                        {feature.number}
                      </span>
                    </div>
                    <h3 className="mt-7 text-lg font-semibold tracking-[-0.025em] text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-6 text-muted">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-24 py-16 sm:py-24"
        >
          <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
              <div>
                <p className={`text-success ${sectionLabelClass}`}>
                  {t.landing.howEyebrow}
                </p>
                <h2 className="mt-4 text-balance text-4xl font-semibold leading-[1.07] tracking-[-0.05em] text-foreground sm:text-5xl">
                  {t.landing.howTitle}
                </h2>
                <p className="mt-5 max-w-xl text-pretty text-sm leading-6 text-muted sm:text-base">
                  {t.landing.howBody}
                </p>

                <div className="relative mt-10 space-y-5">
                  {t.landing.steps.map((item, index) => {
                    const meta = stepMeta[index];
                    const Icon = meta.icon;
                    return (
                      <article
                        key={item.step}
                        className="relative flex gap-4 rounded-2xl border border-border bg-surface/80 p-4 shadow-sm backdrop-blur"
                      >
                        <span
                          className={`relative grid size-12 shrink-0 place-items-center rounded-2xl ${meta.tint}`}
                        >
                          <Icon className="size-5" strokeWidth={1.7} />
                        </span>
                        <div className="min-w-0">
                          <p
                            className={`text-muted-subtle ${
                              isZh
                                ? "text-[10px] font-semibold tracking-[0.08em]"
                                : "text-[10px] font-semibold uppercase tracking-[0.14em]"
                            }`}
                          >
                            {item.step}
                          </p>
                          <h3 className="mt-1 text-base font-semibold tracking-[-0.02em] text-foreground">
                            {item.title}
                          </h3>
                          <p className="mt-1.5 text-sm leading-6 text-muted">
                            {item.copy}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <ConversationLoop className="lg:sticky lg:top-24" />
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-surface/70 py-16 sm:py-20">
          <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className={`text-secondary ${sectionLabelClass}`}>
                {t.landing.assistEyebrow}
              </p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
                {t.landing.assistTitle}
              </h2>
              <p className="mt-4 text-pretty text-base leading-7 text-muted sm:text-lg">
                {t.landing.assistBody}
              </p>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-2">
              <article className="overflow-hidden rounded-[24px] border border-border bg-surface-raised shadow-[0_14px_40px_rgb(var(--shadow-color)/0.06)]">
                <div className="flex items-start gap-3 px-6 pt-6 sm:px-7 sm:pt-7">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary-soft text-secondary">
                    <UsersRound className="size-4" strokeWidth={1.7} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold tracking-[-0.02em] text-foreground">
                      {t.landing.assistWhoTitle}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {t.landing.assistWhoBody}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-5 sm:px-7 sm:pb-7">
                  <div className="flex items-center gap-2.5 rounded-xl border border-secondary/20 bg-surface px-4 py-3">
                    <Sparkles className="size-3.5 shrink-0 text-secondary" />
                    <p className="truncate text-xs text-muted">
                      {t.landing.assistWhoNeed}
                    </p>
                  </div>
                  <div className="flex justify-center py-1.5" aria-hidden="true">
                    <span className="h-5 w-px bg-border-strong" />
                  </div>
                  <div className="rounded-2xl border border-secondary/15 bg-gradient-to-br from-violet-50/60 via-white to-white p-4 dark:from-secondary-soft/45 dark:via-surface-raised dark:to-surface-raised">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-white"
                        style={{
                          background:
                            "linear-gradient(145deg, #6C63A8 0%, color-mix(in srgb, #6C63A8 72%, #1c1917) 100%)",
                        }}
                      >
                        MC
                      </span>
                      <p className="text-sm font-semibold text-foreground">
                        Maya Chen
                      </p>
                      <span className="rounded-full bg-secondary-soft px-2 py-0.5 text-[9px] font-semibold text-secondary">
                        {t.landing.previewManager}
                      </span>
                    </div>
                    <p className="mt-3 text-[11px] leading-5 text-muted">
                      <span className="font-semibold text-foreground">
                        {t.landing.assistWhoWhyLabel}
                      </span>{" "}
                      {t.landing.assistWhoWhyText}
                    </p>
                    <p className="mt-2 rounded-xl bg-surface px-3 py-2.5 text-[11px] font-medium leading-5 text-foreground">
                      “{t.landing.assistWhoAskText}”
                    </p>
                  </div>
                </div>
              </article>

              <article className="overflow-hidden rounded-[24px] border border-border bg-surface-raised shadow-[0_14px_40px_rgb(var(--shadow-color)/0.06)]">
                <div className="flex items-start gap-3 px-6 pt-6 sm:px-7 sm:pt-7">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-100/80 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                    <MessageSquareText className="size-4" strokeWidth={1.7} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold tracking-[-0.02em] text-foreground">
                      {t.landing.assistTalkTitle}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {t.landing.assistTalkBody}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-5 sm:px-7 sm:pb-7">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                    {t.landing.assistTalkContextLabel}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {t.landing.assistTalkContext.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-border bg-surface-muted px-2.5 py-1 text-[10px] font-semibold text-muted"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-center py-1.5" aria-hidden="true">
                    <span className="h-5 w-px bg-border-strong" />
                  </div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-amber-700 dark:text-amber-300">
                    {t.landing.assistTalkIdeasLabel}
                  </p>
                  <div className="mt-2 space-y-2">
                    {t.landing.assistTalkIdeas.map((idea) => (
                      <div
                        key={idea}
                        className="rounded-xl border border-amber-200/70 bg-amber-50/70 px-3.5 py-2.5 text-[11px] font-medium leading-5 text-foreground dark:border-amber-500/20 dark:bg-amber-400/10"
                      >
                        “{idea}”
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section
          id="privacy"
          className="scroll-mt-24 border-y border-border bg-background py-14 sm:py-20"
        >
          <div className="mx-auto grid max-w-[1050px] gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div className="relative mx-auto grid size-64 place-items-center sm:size-72 lg:mx-0">
              <span className="absolute inset-0 rounded-full border border-border bg-gradient-to-br from-[#fff8f4] to-[#f3f0fa] dark:from-accent-soft/50 dark:to-secondary-soft/60" />
              <span className="absolute inset-8 rounded-full border border-dashed border-border-strong" />
              <span className="absolute inset-16 rounded-full bg-gradient-to-br from-[#efe4dd] to-[#e6e2f0] dark:from-accent-soft dark:to-secondary-soft" />
              <span className="relative grid size-16 place-items-center rounded-[20px] bg-foreground text-background shadow-[0_15px_35px_rgb(var(--shadow-color)/0.18)]">
                <LockKeyhole className="size-6" strokeWidth={1.6} />
              </span>
              <span className="absolute left-3 top-24 rounded-full border border-border bg-surface-raised px-3 py-1.5 text-[9px] font-semibold text-muted shadow-sm">
                {t.landing.privacyNotes}
              </span>
              <span className="absolute bottom-8 right-0 rounded-full border border-border bg-surface-raised px-3 py-1.5 text-[9px] font-semibold text-muted shadow-sm">
                {t.landing.privacyContext}
              </span>
            </div>
            <div>
              <p className={`text-muted-subtle ${sectionLabelClass}`}>
                {t.landing.privacyEyebrow}
              </p>
              <h2 className="mt-4 text-balance text-4xl font-semibold leading-[1.07] tracking-[-0.05em] text-foreground sm:text-5xl">
                {t.landing.privacyTitle}
              </h2>
              <p className="mt-5 max-w-xl text-pretty text-sm leading-7 text-muted sm:text-base">
                {t.landing.privacyBody}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {t.landing.privacyChips.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-3 py-1.5 text-[10px] font-medium text-muted"
                  >
                    <CheckCircle2 className="size-3 text-success" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 text-center sm:px-8 sm:py-24">
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[28px] border border-border bg-gradient-to-br from-[#fff8f4] via-white to-[#f4f1fa] px-6 py-14 shadow-[0_18px_50px_rgb(var(--shadow-color)/0.07)] dark:from-accent-soft/55 dark:via-surface-raised dark:to-secondary-soft/50 sm:px-10">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent">
              <MessageSquareText className="size-5" strokeWidth={1.7} />
            </span>
            <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.05em] text-foreground sm:text-6xl">
              {t.landing.finalTitle}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-sm leading-7 text-muted sm:text-base">
              {t.landing.finalBody}
            </p>
            <Link
              href="/workspace"
              className="group mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-[0_8px_24px_rgb(var(--shadow-color)/0.14)] transition-[transform,background-color,box-shadow] hover:-translate-y-0.5 hover:bg-accent-hover"
            >
              {t.landing.openBetween}
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-5 px-5 py-7 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2.5">
            <BrandLogo size={40} className="rounded-[10px]" />
            <span className="text-xs font-semibold text-stone-700">
              {t.common.brand}
            </span>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-subtle">
              {t.landing.footerTagline}
            </p>
            <a
              href={`mailto:${LEGAL_CONTACT_EMAIL}`}
              className="mt-1 inline-flex text-[10px] font-semibold text-muted transition-colors hover:text-foreground"
            >
              {LEGAL_CONTACT_EMAIL}
            </a>
          </div>
          <nav
            className="flex items-center gap-4 text-[10px] font-semibold text-muted"
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
            <Link
              href="/workspace"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              {t.landing.goToWorkspace}
              <ArrowRight className="size-3" />
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function ProductPreview() {
  const { t } = useLocale();

  const people = [
    ["MC", "Maya Chen", t.timing.tomorrow, "#6C63A8"],
    ["TW", "Theo Williams", t.timing.inDays(2), "#D26A4C"],
    ["PS", "Priya Shah", t.timing.inDays(3), "#2E8277"],
    ["JL", "Jonah Lee", t.timing.inDays(5), "#3F6FA3"],
  ] as const;

  return (
    <figure className="relative mx-auto mt-16 max-w-[1180px] px-3 sm:mt-20 sm:px-8">
      <figcaption className="sr-only">{t.landing.previewConversations}</figcaption>
      <div className="absolute inset-x-[14%] bottom-[-8%] h-[48%] rounded-full bg-[linear-gradient(90deg,var(--accent),var(--secondary))] opacity-15 blur-3xl dark:opacity-20" />
      <div className="relative overflow-hidden rounded-[22px] border border-border-strong bg-surface-raised p-1.5 shadow-[0_35px_90px_rgb(var(--shadow-color)/0.18),0_5px_20px_rgb(var(--shadow-color)/0.08)] sm:rounded-[28px] sm:p-2">
        <div className="flex h-10 items-center gap-1.5 rounded-t-[16px] border-b border-border bg-surface-muted px-3 sm:h-12 sm:rounded-t-[21px] sm:px-4">
          <span aria-hidden="true" className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#db8a6b] sm:size-2.5" />
            <span className="size-2 rounded-full bg-[#dfbd6a] sm:size-2.5" />
            <span className="size-2 rounded-full bg-[#78a990] sm:size-2.5" />
          </span>
          <span className="mx-auto flex h-6 min-w-0 max-w-52 flex-1 items-center justify-center truncate rounded-lg border border-border/70 bg-surface/80 px-3 text-[8px] font-medium text-muted-subtle sm:text-[9px]">
            11s.app/workspace
          </span>
          <span className="hidden text-[8px] font-semibold text-muted-subtle sm:block">
            {t.landing.previewConversations}
          </span>
        </div>

        <div className="grid min-h-[540px] bg-background lg:grid-cols-[232px_1fr]">
          <div className="hidden border-r border-border bg-sidebar p-4 lg:flex lg:flex-col">
            <div className="flex items-center gap-2.5 px-1.5 py-1">
              <BrandLogo size={36} className="rounded-[8px]" />
              <div>
                <p className="text-[11px] font-semibold text-foreground">
                  {t.common.brand}
                </p>
                <p className="text-[7px] uppercase tracking-[0.12em] text-muted-subtle">
                  {t.landing.previewConversations}
                </p>
              </div>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-muted-subtle" />
              <div className="h-8 rounded-lg border border-border bg-surface pl-7 text-[8px] leading-8 text-muted-subtle">
                {t.sidebar.searchPlaceholder}
              </div>
            </div>
            <div className="mt-3 space-y-0.5">
              <div className="flex h-8 items-center gap-2 rounded-lg bg-surface px-2.5 text-[9px] font-semibold text-foreground shadow-sm">
                <House className="size-3" />
                {t.common.overview}
              </div>
              <div className="flex h-8 items-center gap-2 rounded-lg px-2.5 text-[9px] text-muted">
                <MessageSquareText className="size-3" />
                {t.common.smallTalk}
              </div>
              <div className="flex h-8 items-center gap-2 rounded-lg px-2.5 text-[9px] text-muted">
                <Target className="size-3 text-accent" />
                {t.landing.previewCareerNav}
              </div>
            </div>
            <p className="mb-1 mt-5 px-2 text-[7px] font-semibold uppercase tracking-[0.15em] text-muted-subtle">
              {t.landing.previewPeople}
            </p>
            {people.map(([initials, name, time, color], index) => (
              <div
                key={name}
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${
                  index === 0
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted"
                }`}
              >
                <span
                  className="grid size-6 shrink-0 place-items-center rounded-full text-[8px] font-semibold leading-none text-white"
                  style={{
                    background: `linear-gradient(145deg, ${color} 0%, color-mix(in srgb, ${color} 72%, #1c1917) 100%)`,
                  }}
                >
                  {initials}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block truncate text-[9px] font-semibold ${
                      index === 0 ? "text-background" : "text-foreground"
                    }`}
                  >
                    {name}
                  </span>
                  <span className="block text-[7px] text-muted-subtle">{time}</span>
                </span>
              </div>
            ))}
            <div className="mt-auto border-t border-border pt-2">
              <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[8px] text-muted">
                <span className="grid size-5 place-items-center rounded-full bg-surface-muted text-[7px] font-semibold text-foreground">
                  EL
                </span>
                <span>{t.sidebar.localWorkspace}</span>
              </div>
            </div>
          </div>

          <div className="min-w-0 p-4 sm:p-6 lg:p-8">
            <div className="mb-5 flex items-center justify-between border-b border-border pb-3 lg:hidden">
              <div className="flex items-center gap-2">
                <BrandLogo size={32} className="rounded-lg" />
                <span className="text-[10px] font-semibold text-foreground">
                  {t.common.overview}
                </span>
              </div>
              <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[8px] font-semibold text-accent">
                {t.landing.previewReady}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="grid size-10 place-items-center rounded-full text-[11px] font-semibold leading-none text-white sm:size-12 sm:text-[13px]"
                  style={{
                    background:
                      "linear-gradient(145deg, #6C63A8 0%, color-mix(in srgb, #6C63A8 72%, #1c1917) 100%)",
                  }}
                >
                  MC
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold tracking-[-0.02em] text-foreground sm:text-base">
                      Maya Chen
                    </p>
                    <span className="rounded-full bg-secondary-soft px-2 py-0.5 text-[7px] font-semibold text-secondary sm:text-[8px]">
                      {t.landing.previewManager}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[8px] text-muted sm:text-[9px]">
                    VP, Product · Northstar
                  </p>
                </div>
              </div>
              <div className="hidden items-center gap-1.5 sm:flex">
                <span className="h-8 items-center rounded-lg border border-border bg-surface px-2.5 text-[8px] font-semibold text-muted sm:inline-flex">
                  {t.person.glanceMode}
                </span>
                <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-foreground px-3 text-[8px] font-semibold text-background">
                  <CheckCircle2 className="size-3" />
                  {t.landing.previewLog}
                </span>
              </div>
            </div>

            <div className="mt-5 flex gap-5 border-b border-border text-[9px] font-semibold text-muted-subtle sm:mt-7">
              <span className="relative pb-2.5 text-foreground">
                {t.landing.previewPrepare}
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-accent" />
              </span>
              <span>{t.landing.previewHistory}</span>
            </div>

            <div className="mt-4 space-y-2.5 sm:mt-5">
              <div className="relative overflow-hidden rounded-2xl bg-[#24211f] px-4 py-3.5 text-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] sm:px-5">
                <span className="absolute -right-6 -top-8 size-24 rounded-full bg-violet-500/30 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#e4af98]">
                        <Sparkles className="size-3" />
                        {t.landing.previewCoach}
                      </p>
                      <p className="mt-1.5 truncate text-[11px] font-semibold sm:text-xs">
                        {t.landing.previewCoachTitle}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-[#fff] px-2.5 py-1.5 text-[8px] font-semibold text-[#1c1917]">
                      {t.landing.previewRefresh}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-[#fff] px-2.5 py-1 text-[7px] font-semibold text-[#1c1917]">
                      {t.landing.previewIntentCareer}
                    </span>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[7px] font-semibold text-stone-300">
                      {t.person.intents["catch-up"]}
                    </span>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[7px] font-semibold text-stone-300">
                      {t.person.intents["hard-talk"]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-[0_8px_24px_rgb(var(--shadow-color)/0.05)]">
                <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-[#fff9f5] via-white to-violet-50/60 px-4 py-3 dark:from-accent-soft/55 dark:via-surface-raised dark:to-secondary-soft/60 sm:px-5">
                  <div>
                    <p className="text-[11px] font-semibold text-foreground sm:text-xs">
                      {t.landing.previewNext}
                    </p>
                    <p className="mt-0.5 text-[8px] text-muted sm:text-[9px]">
                      {t.landing.previewCoachBody}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-surface-muted px-2.5 py-1 text-[7px] text-muted sm:text-[8px]">
                    {t.landing.previewTomorrow}
                  </span>
                </div>

                <div className="grid sm:grid-cols-[0.92fr_1.08fr]">
                  <div className="min-w-0 border-b border-border p-4 sm:border-b-0 sm:border-r sm:p-5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="flex items-center gap-1.5 text-[9px] font-semibold text-foreground sm:text-[10px]">
                        <NotebookPen className="size-3 text-accent" />
                        {t.landing.previewNotes}
                      </p>
                      <p className="flex items-center gap-1 text-[7px] text-success sm:text-[8px]">
                        <Check className="size-2.5" />
                        {t.landing.previewSaved}
                      </p>
                    </div>
                    <div className="mt-3 space-y-2 rounded-xl border border-accent/20 bg-accent-soft/45 p-3.5">
                      {t.landing.previewNotesList.map((note) => (
                        <p
                          key={note}
                          className="flex items-start gap-2 text-[9px] leading-4 text-muted sm:text-[10px]"
                        >
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                          {note}
                        </p>
                      ))}
                    </div>
                    <p className="mt-2.5 text-[8px] text-muted-subtle">
                      {t.landing.previewMeta}
                    </p>
                  </div>

                  <div className="min-w-0 bg-gradient-to-br from-violet-50/50 via-white to-white p-4 dark:from-secondary-soft/45 dark:via-surface-raised dark:to-surface-raised sm:p-5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-secondary sm:text-[9px]">
                        <Sparkles className="size-3" />
                        {t.landing.previewSuggested}
                      </p>
                      <span className="rounded-full border border-secondary/20 bg-surface/80 px-2 py-0.5 text-[7px] font-semibold text-secondary">
                        {t.landing.previewReady}
                      </span>
                    </div>

                    <p className="mt-3 text-[7px] font-bold uppercase tracking-[0.12em] text-amber-700 dark:text-amber-300">
                      {t.landing.previewLeadLabel}
                    </p>
                    <div className="mt-1.5 rounded-xl border border-amber-200 bg-[#fffaf3] p-3 dark:border-amber-500/25 dark:bg-amber-400/10">
                      <p className="text-[10px] font-semibold leading-4 text-foreground sm:text-[11px]">
                        {t.landing.previewIdeas[0]?.title}
                      </p>
                      <p className="mt-1 text-[8px] leading-4 text-muted sm:text-[9px]">
                        “{t.landing.previewIdeas[0]?.prompt}”
                      </p>
                    </div>

                    <p className="mt-3 text-[7px] font-bold uppercase tracking-[0.12em] text-secondary">
                      {t.landing.previewSupportLabel}
                    </p>
                    <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
                      {t.landing.previewTalkingPoints.map((idea, index) => (
                        <div
                          key={idea.title}
                          className="rounded-xl border border-secondary/15 bg-surface/90 p-3"
                        >
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[7px] font-semibold ${talkingPointColors[index]}`}
                          >
                            {idea.label}
                          </span>
                          <p className="mt-2 text-[9px] font-semibold leading-4 text-foreground sm:text-[10px]">
                            {idea.title}
                          </p>
                          <p className="mt-1 line-clamp-2 text-[8px] leading-4 text-muted">
                            “{t.landing.previewIdeas[index + 1]?.prompt}”
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -left-3 top-[36%] hidden -rotate-3 rounded-xl border border-border bg-surface-raised px-3.5 py-2.5 shadow-lg lg:block">
        <p className="flex items-center gap-1.5 text-[9px] font-semibold text-muted">
          <Target className="size-3 text-accent" />
          {t.landing.previewFloatLeft}
        </p>
      </div>
      <div className="pointer-events-none absolute -right-1 bottom-[17%] hidden rotate-2 rounded-xl border border-border bg-surface-raised px-3.5 py-2.5 shadow-lg lg:block">
        <p className="flex items-center gap-1.5 text-[9px] font-semibold text-muted">
          <Sparkles className="size-3 text-secondary" />
          {t.landing.previewFloatRight}
        </p>
      </div>
    </figure>
  );
}
