"use client";

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Clock3,
  HeartHandshake,
  History,
  LockKeyhole,
  MessageSquareText,
  NotebookPen,
  RotateCcw,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { useLocale } from "@/lib/i18n";

const featureMeta = [
  {
    number: "01",
    icon: History,
    accent: "bg-[#e9e3f4] text-[#6c5d8f]",
  },
  {
    number: "02",
    icon: NotebookPen,
    accent: "bg-[#f4e5dc] text-[#a45f43]",
  },
  {
    number: "03",
    icon: Sparkles,
    accent: "bg-[#dfece6] text-[#497866]",
  },
];

const stepIcons = [NotebookPen, Brain, RotateCcw];

const previewIdeaColors = [
  "text-blue-300 bg-blue-300/10",
  "text-violet-300 bg-violet-300/10",
  "text-teal-300 bg-teal-300/10",
];

const talkingPointColors = [
  "bg-blue-50 text-blue-700",
  "bg-violet-50 text-violet-700",
];

const roleColors = [
  "#7c6fa4",
  "#bd7257",
  "#4e8876",
  "#9d6581",
  "#4f78a0",
];

export function LandingPage() {
  const { locale, t } = useLocale();
  const isZh = locale === "zh-TW";
  const labelClass = isZh
    ? "text-[10px] font-semibold tracking-[0.08em] text-stone-500"
    : "text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500";
  const sectionLabelClass = isZh
    ? "text-[10px] font-semibold tracking-[0.1em]"
    : "text-[10px] font-semibold uppercase tracking-[0.16em]";
  const features = featureMeta.map((meta, index) => ({
    ...meta,
    ...t.landing.features[index],
  }));

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f7f3] text-stone-900">
      <header className="relative z-40">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            aria-label={t.landing.homeAria}
          >
            <BrandMark />
            <span className="text-[15px] font-semibold tracking-[-0.025em]">
              {t.common.brand}
            </span>
          </Link>

          <nav
            className="hidden items-center gap-7 text-xs font-medium text-stone-500 md:flex"
            aria-label={t.landing.navAria}
          >
            <a className="transition hover:text-stone-900" href="#why-between">
              {t.landing.navWhy}
            </a>
            <a className="transition hover:text-stone-900" href="#how-it-works">
              {t.landing.navHow}
            </a>
            <a className="transition hover:text-stone-900" href="#privacy">
              {t.landing.navPrivacy}
            </a>
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <LanguageToggle />
            <Link
              href="/workspace"
              className="group inline-flex h-10 items-center gap-2 rounded-xl bg-stone-900 px-3.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 sm:px-4"
            >
              {t.landing.openWorkspace}
              <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative isolate pb-20 pt-20 sm:pb-28 sm:pt-28 lg:pb-32 lg:pt-32">
          <div className="pointer-events-none absolute inset-x-0 top-[-76px] -z-10 h-[760px] overflow-hidden">
            <div className="absolute left-1/2 top-[-440px] h-[850px] w-[1050px] -translate-x-1/2 rounded-full border border-stone-200/80" />
            <div className="absolute left-1/2 top-[-330px] h-[650px] w-[810px] -translate-x-1/2 rounded-full border border-stone-200/70" />
            <div className="absolute left-[14%] top-32 size-52 rounded-full bg-[#efe4dd]/70 blur-3xl" />
            <div className="absolute right-[10%] top-16 size-64 rounded-full bg-[#e6e2f0]/70 blur-3xl" />
          </div>

          <div className="mx-auto max-w-[1050px] px-5 text-center sm:px-8">
            <div
              className={`inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur ${labelClass}`}
            >
              <HeartHandshake className="size-3.5 text-[#b46649]" />
              {t.landing.eyebrow}
            </div>

            <h1
              className={`mx-auto mt-7 max-w-4xl font-semibold leading-[0.98] text-stone-950 sm:text-[4.75rem] lg:text-[6.15rem] ${
                isZh
                  ? "text-[2.65rem] tracking-[-0.02em] sm:text-[4.1rem] lg:text-[5.25rem]"
                  : "text-[3.15rem] tracking-[-0.06em]"
              }`}
            >
              {t.landing.heroLead}{" "}
              <span
                className={`font-serif font-normal italic text-[#a75f44] ${
                  isZh ? "tracking-[-0.01em]" : "tracking-[-0.04em]"
                }`}
              >
                {t.landing.heroAccent}
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-stone-500 sm:text-lg sm:leading-8">
              {t.landing.heroBody}
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/workspace"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-stone-900 px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(28,25,23,0.14)] transition hover:-translate-y-0.5 hover:bg-stone-800 hover:shadow-[0_12px_28px_rgba(28,25,23,0.18)] sm:w-auto"
              >
                {t.landing.ctaPrimary}
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[14px] border border-stone-200 bg-white/70 px-5 text-sm font-semibold text-stone-600 transition hover:border-stone-300 hover:bg-white hover:text-stone-900 sm:w-auto"
              >
                {t.landing.ctaSecondary}
                <ChevronRight className="size-3.5" />
              </a>
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-medium text-stone-400">
              <LockKeyhole className="size-3" />
              {t.landing.noAccount}
            </p>
          </div>

          <ProductPreview />

          <div className="mx-auto mt-12 max-w-[950px] px-5 sm:mt-16 sm:px-8">
            <p
              className={`text-center text-stone-400 ${sectionLabelClass}`}
            >
              {t.landing.rolesLabel}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 sm:gap-x-10">
              {t.landing.roles.map((role, index) => (
                <span
                  key={role}
                  className="flex items-center gap-2 text-xs font-medium text-stone-500"
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{
                      backgroundColor: roleColors[index],
                    }}
                  />
                  {role}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section
          id="why-between"
          className="scroll-mt-8 border-y border-stone-200/80 bg-[#fdfcfb] py-24 sm:py-32"
        >
          <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <div>
                <p className={`text-[#a75f44] ${sectionLabelClass}`}>
                  {t.landing.whyEyebrow}
                </p>
                <h2 className="mt-4 max-w-md text-4xl font-semibold leading-[1.06] tracking-[-0.05em] text-stone-950 sm:text-5xl">
                  {t.landing.whyTitle}
                </h2>
              </div>
              <div className="max-w-xl lg:justify-self-end">
                <p className="text-base leading-7 text-stone-500 sm:text-lg sm:leading-8">
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
                    className="group rounded-[24px] border border-stone-200/90 bg-white p-6 transition hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_18px_50px_rgba(28,25,23,0.07)] sm:p-7"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`grid size-11 place-items-center rounded-2xl ${feature.accent}`}
                      >
                        <Icon className="size-5" strokeWidth={1.7} />
                      </span>
                      <span className="text-[10px] font-semibold tracking-[0.12em] text-stone-300">
                        {feature.number}
                      </span>
                    </div>
                    <h3 className="mt-7 text-lg font-semibold tracking-[-0.025em] text-stone-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-6 text-stone-500">
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
          className="scroll-mt-8 py-24 sm:py-32"
        >
          <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className={`text-[#4e7b6a] ${sectionLabelClass}`}>
                {t.landing.howEyebrow}
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.07] tracking-[-0.05em] text-stone-950 sm:text-5xl">
                {t.landing.howTitle}
              </h2>
              <p className="mt-5 text-sm leading-6 text-stone-500 sm:text-base">
                {t.landing.howBody}
              </p>
            </div>

            <div className="relative mt-16 grid gap-8 lg:grid-cols-3 lg:gap-10">
              <span className="absolute left-[16%] right-[16%] top-7 hidden border-t border-dashed border-stone-300 lg:block" />
              {t.landing.steps.map((item, index) => {
                const Icon = stepIcons[index];
                return (
                  <article key={item.step} className="relative text-center">
                    <span className="relative z-10 mx-auto grid size-14 place-items-center rounded-2xl border border-stone-200 bg-[#fdfcfb] text-stone-700 shadow-[0_6px_20px_rgba(28,25,23,0.06)]">
                      <Icon className="size-5" strokeWidth={1.7} />
                      <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-stone-900 text-[8px] font-semibold text-white">
                        {index + 1}
                      </span>
                    </span>
                    <p
                      className={`mt-5 text-stone-400 ${
                        isZh
                          ? "text-[10px] font-semibold tracking-[0.08em]"
                          : "text-[10px] font-semibold uppercase tracking-[0.14em]"
                      }`}
                    >
                      {item.step}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold tracking-[-0.025em] text-stone-900">
                      {item.title}
                    </h3>
                    <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-stone-500">
                      {item.copy}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-3 pb-24 sm:px-6 sm:pb-32">
          <div className="relative mx-auto max-w-[1220px] overflow-hidden rounded-[30px] bg-[#24211f] px-5 py-16 text-white shadow-[0_30px_80px_rgba(28,25,23,0.14)] sm:px-10 sm:py-20 lg:px-16">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-28 -top-36 size-[430px] rounded-full bg-[#755f90]/35 blur-3xl" />
              <div className="absolute -bottom-48 -left-20 size-[380px] rounded-full bg-[#a8644b]/20 blur-3xl" />
              <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
            </div>

            <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
              <div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[#d9a58f] ${
                    isZh
                      ? "text-[10px] font-semibold tracking-[0.08em]"
                      : "text-[10px] font-semibold uppercase tracking-[0.13em]"
                  }`}
                >
                  <Sparkles className="size-3.5" />
                  {t.landing.aiEyebrow}
                </span>
                <h2 className="mt-6 max-w-lg text-4xl font-semibold leading-[1.04] tracking-[-0.05em] sm:text-5xl">
                  {t.landing.aiTitle}{" "}
                  <span className="font-serif font-normal italic text-[#d9a58f]">
                    {t.landing.aiTitleAccent}
                  </span>
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-stone-400 sm:text-base">
                  {t.landing.aiBody}
                </p>
                <div className="mt-7 space-y-3">
                  {t.landing.aiBullets.map((item) => (
                    <p
                      key={item}
                      className="flex items-center gap-2.5 text-xs text-stone-300"
                    >
                      <span className="grid size-5 place-items-center rounded-full bg-white/[0.08] text-emerald-300">
                        <Check className="size-3" />
                      </span>
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-8 rounded-full bg-white/10 blur-3xl" />
                <div className="relative rounded-[22px] border border-white/10 bg-[#302d2a]/90 p-4 shadow-2xl backdrop-blur sm:p-5">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-full bg-[#6C63A8] text-[10px] font-semibold">
                        MC
                      </span>
                      <span>
                        <span className="block text-xs font-semibold text-white">
                          {t.landing.previewPreparing}
                        </span>
                        <span className="mt-0.5 block text-[9px] text-stone-500">
                          {t.landing.previewMeta}
                        </span>
                      </span>
                    </div>
                    <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[9px] font-medium text-emerald-300">
                      {t.landing.previewReady}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {t.landing.previewIdeas.map((idea, index) => (
                      <div
                        key={idea.title}
                        className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-3.5"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[8px] font-semibold ${previewIdeaColors[index]}`}
                          >
                            {idea.label}
                          </span>
                          <p className="text-[11px] font-semibold text-stone-200">
                            {idea.title}
                          </p>
                        </div>
                        <p className="mt-2 text-[10px] leading-4 text-stone-500">
                          “{idea.prompt}”
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="privacy"
          className="scroll-mt-8 border-y border-stone-200/80 bg-[#fdfcfb] py-20 sm:py-24"
        >
          <div className="mx-auto grid max-w-[1050px] gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div className="relative mx-auto grid size-64 place-items-center sm:size-72 lg:mx-0">
              <span className="absolute inset-0 rounded-full border border-stone-200" />
              <span className="absolute inset-8 rounded-full border border-dashed border-stone-300" />
              <span className="absolute inset-16 rounded-full bg-[#f1ede8]" />
              <span className="relative grid size-16 place-items-center rounded-[20px] bg-stone-900 text-white shadow-[0_15px_35px_rgba(28,25,23,0.18)]">
                <LockKeyhole className="size-6" strokeWidth={1.6} />
              </span>
              <span className="absolute left-3 top-24 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[9px] font-semibold text-stone-500 shadow-sm">
                {t.landing.privacyNotes}
              </span>
              <span className="absolute bottom-8 right-0 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[9px] font-semibold text-stone-500 shadow-sm">
                {t.landing.privacyContext}
              </span>
            </div>
            <div>
              <p className={`text-stone-400 ${sectionLabelClass}`}>
                {t.landing.privacyEyebrow}
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.07] tracking-[-0.05em] text-stone-950 sm:text-5xl">
                {t.landing.privacyTitle}
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-stone-500 sm:text-base">
                {t.landing.privacyBody}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {t.landing.privacyChips.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-[#f8f7f3] px-3 py-1.5 text-[10px] font-medium text-stone-500"
                  >
                    <CheckCircle2 className="size-3 text-[#4e7b6a]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-24 text-center sm:px-8 sm:py-32">
          <div className="mx-auto max-w-3xl">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#eee8e2] text-[#a75f44]">
              <MessageSquareText className="size-5" strokeWidth={1.7} />
            </span>
            <h2 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.05em] text-stone-950 sm:text-6xl">
              {t.landing.finalTitle}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-stone-500 sm:text-base">
              {t.landing.finalBody}
            </p>
            <Link
              href="/workspace"
              className="group mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-stone-900 px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(28,25,23,0.14)] transition hover:-translate-y-0.5 hover:bg-stone-800"
            >
              {t.landing.openBetween}
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200/80 bg-[#fdfcfb]">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-5 px-5 py-7 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2.5">
            <BrandMark small />
            <span className="text-xs font-semibold text-stone-700">
              {t.common.brand}
            </span>
          </div>
          <p className="text-center text-[10px] text-stone-400">
            {t.landing.footerTagline}
          </p>
          <Link
            href="/workspace"
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-stone-500 transition hover:text-stone-900"
          >
            {t.landing.goToWorkspace}
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </footer>
    </div>
  );
}

function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`relative grid place-items-center overflow-hidden rounded-[11px] bg-stone-900 text-white shadow-sm ${
        small ? "size-8" : "size-9"
      }`}
      aria-hidden="true"
    >
      <span className="absolute left-[8px] top-[8px] size-[9px] rounded-full bg-[#f09a75]" />
      <span className="absolute bottom-[8px] right-[8px] size-[9px] rounded-full bg-[#92b9aa]" />
      <span className="h-[2px] w-4 -rotate-45 rounded-full bg-white/70" />
    </span>
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
    <div className="relative mx-auto mt-16 max-w-[1180px] px-3 sm:mt-20 sm:px-8">
      <div className="absolute inset-x-[18%] bottom-[-8%] h-[45%] rounded-full bg-stone-900/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-[20px] border border-stone-300/80 bg-white p-1.5 shadow-[0_35px_90px_rgba(28,25,23,0.16),0_5px_20px_rgba(28,25,23,0.07)] sm:rounded-[26px] sm:p-2">
        <div className="flex h-9 items-center gap-1.5 rounded-t-[15px] border-b border-stone-200 bg-[#f2f0ec] px-3 sm:h-11 sm:rounded-t-[20px] sm:px-4">
          <span className="size-2 rounded-full bg-[#db8a6b] sm:size-2.5" />
          <span className="size-2 rounded-full bg-[#dfbd6a] sm:size-2.5" />
          <span className="size-2 rounded-full bg-[#78a990] sm:size-2.5" />
          <span className="mx-auto hidden h-6 w-52 items-center justify-center rounded-md bg-white/80 text-[8px] text-stone-400 sm:flex">
            between.work/workspace
          </span>
        </div>

        <div className="grid min-h-[360px] bg-[#fdfcfb] sm:min-h-[500px] lg:grid-cols-[220px_1fr]">
          <div className="hidden border-r border-stone-200 bg-[#f6f5f1] p-4 lg:block">
            <div className="flex items-center gap-2.5 px-1 py-1">
              <BrandMark small />
              <div>
                <p className="text-[10px] font-semibold text-stone-800">
                  {t.common.brand}
                </p>
                <p className="text-[6px] uppercase tracking-[0.12em] text-stone-400">
                  {t.landing.previewConversations}
                </p>
              </div>
            </div>
            <div className="mt-5 h-7 rounded-lg border border-stone-200 bg-white" />
            <div className="mt-5 space-y-1">
              <div className="flex h-7 items-center gap-2 rounded-lg bg-white px-2 text-[8px] font-semibold text-stone-700 shadow-sm">
                <CircleUserRound className="size-3" />
                {t.common.overview}
              </div>
              <div className="flex h-7 items-center gap-2 px-2 text-[8px] text-stone-400">
                <UsersRound className="size-3" />
                {t.common.allPeople}
              </div>
            </div>
            <p className="mb-2 mt-6 px-2 text-[6px] font-semibold uppercase tracking-[0.15em] text-stone-400">
              {t.landing.previewPeople}
            </p>
            {people.map(([initials, name, time, color], index) => (
              <div
                key={name}
                className={`flex items-center gap-2 rounded-lg px-2 py-2 ${
                  index === 0 ? "bg-stone-900 text-white" : ""
                }`}
              >
                <span
                  className="grid size-6 shrink-0 place-items-center rounded-full text-[6px] font-semibold text-white"
                  style={{ backgroundColor: color }}
                >
                  {initials}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block truncate text-[8px] font-semibold ${
                      index === 0 ? "text-white" : "text-stone-700"
                    }`}
                  >
                    {name}
                  </span>
                  <span className="block text-[6px] text-stone-400">{time}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="min-w-0 p-4 sm:p-7 lg:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-[#6C63A8] text-[9px] font-semibold text-white sm:size-12 sm:text-[10px]">
                  MC
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold tracking-[-0.02em] text-stone-900 sm:text-base">
                      Maya Chen
                    </p>
                    <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[6px] font-semibold text-violet-700 sm:text-[7px]">
                      {t.landing.previewManager}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[7px] text-stone-400 sm:text-[8px]">
                    VP, Product · Northstar
                  </p>
                </div>
              </div>
              <span className="hidden h-8 items-center gap-1.5 rounded-lg bg-stone-900 px-3 text-[8px] font-semibold text-white sm:flex">
                <MessageSquareText className="size-3" />
                {t.landing.previewLog}
              </span>
            </div>

            <div className="mt-5 flex gap-5 border-b border-stone-200 text-[8px] font-semibold text-stone-400 sm:mt-7">
              <span className="relative pb-2.5 text-stone-900">
                {t.landing.previewPrepare}
                <span className="absolute inset-x-0 bottom-0 h-px bg-stone-900" />
              </span>
              <span>{t.landing.previewHistory}</span>
            </div>

            <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-[1fr_190px] lg:grid-cols-[1fr_220px]">
              <div className="min-w-0 space-y-3">
                <div className="relative overflow-hidden rounded-xl bg-[#262321] p-4 text-white sm:rounded-2xl sm:p-5">
                  <span className="absolute -right-6 -top-8 size-24 rounded-full bg-violet-500/30 blur-2xl" />
                  <div className="relative flex items-start justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-1 text-[6px] font-semibold uppercase tracking-[0.12em] text-[#d7a58c]">
                        <Sparkles className="size-2.5" />
                        {t.landing.previewCoach}
                      </p>
                      <p className="mt-2 text-[11px] font-semibold tracking-[-0.02em] sm:text-xs">
                        {t.landing.previewCoachTitle}
                      </p>
                      <p className="mt-1 max-w-xs text-[7px] leading-3 text-stone-400">
                        {t.landing.previewCoachBody}
                      </p>
                    </div>
                    <span className="rounded-md bg-white px-2 py-1.5 text-[6px] font-semibold text-stone-900">
                      {t.landing.previewRefresh}
                    </span>
                  </div>
                </div>

                <p className="pt-1 text-[8px] font-semibold text-stone-700">
                  {t.landing.previewSuggested}
                </p>
                {t.landing.previewTalkingPoints.map((idea, index) => (
                  <div
                    key={idea.title}
                    className="rounded-xl border border-stone-200 bg-white p-3 sm:p-3.5"
                  >
                    <span
                      className={`rounded-full px-2 py-0.5 text-[6px] font-semibold ${talkingPointColors[index]}`}
                    >
                      {idea.label}
                    </span>
                    <p className="mt-2 text-[9px] font-semibold text-stone-800">
                      {idea.title}
                    </p>
                    <div className="mt-2 rounded-md bg-stone-50 px-2 py-1.5 text-[6px] text-stone-500">
                      {t.landing.previewQuestion}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-stone-200 bg-white p-3.5 sm:rounded-2xl">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-1 text-[8px] font-semibold text-stone-700">
                    <CalendarDays className="size-3 text-stone-400" />
                    {t.landing.previewNext}
                  </p>
                  <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-[6px] text-stone-500">
                    {t.landing.previewTomorrow}
                  </span>
                </div>
                <p className="mt-2 text-[10px] font-semibold text-stone-800">
                  Tue, Aug 4 · 10:30 AM
                </p>
                <div className="my-3 border-t border-stone-100" />
                <p className="flex items-center gap-1 text-[8px] font-semibold text-stone-700">
                  <NotebookPen className="size-3 text-stone-400" />
                  {t.landing.previewNotes}
                </p>
                <div className="mt-2 space-y-2 rounded-lg bg-[#f8f7f4] p-2.5">
                  {t.landing.previewNotesList.map((note) => (
                    <p
                      key={note}
                      className="flex items-start gap-1.5 text-[6px] leading-3 text-stone-500"
                    >
                      <span className="mt-1 size-1 shrink-0 rounded-full bg-[#a75f44]" />
                      {note}
                    </p>
                  ))}
                </div>
                <p className="mt-2 flex items-center gap-1 text-[6px] text-stone-400">
                  <Check className="size-2.5 text-emerald-500" />
                  {t.landing.previewSaved}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -left-3 top-[36%] hidden -rotate-6 rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-lg lg:block">
        <p className="flex items-center gap-1.5 text-[8px] font-semibold text-stone-600">
          <Clock3 className="size-3 text-[#4e7b6a]" />
          {t.landing.previewFloatLeft}
        </p>
      </div>
      <div className="pointer-events-none absolute -right-1 bottom-[17%] hidden rotate-3 rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-lg lg:block">
        <p className="flex items-center gap-1.5 text-[8px] font-semibold text-stone-600">
          <Sparkles className="size-3 text-[#a75f44]" />
          {t.landing.previewFloatRight}
        </p>
      </div>
    </div>
  );
}
