"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronRight,
  GraduationCap,
  HeartHandshake,
  LockKeyhole,
  MessageSquareText,
  UsersRound,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ConversationLoop } from "@/components/conversation-loop";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { LEGAL_CONTACT_EMAIL } from "@/lib/legal";
import { useLocale } from "@/lib/i18n";

export function LandingPage() {
  const { locale, t } = useLocale();
  const isZh = locale === "zh-TW";
  const sectionLabelClass = isZh
    ? "text-[10px] font-semibold tracking-[0.1em]"
    : "text-[10px] font-semibold uppercase tracking-[0.16em]";

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
            <BrandLogo size={36} />
            <span className="hidden text-[15px] font-semibold tracking-[-0.025em] sm:inline">
              {t.common.brand}
            </span>
          </Link>

          <nav
            className="hidden items-center gap-7 text-xs font-medium text-muted md:flex"
            aria-label={t.landing.navAria}
          >
            <a className="transition-colors hover:text-foreground" href="#how-it-works">
              {t.landing.navHow}
            </a>
            <a className="transition-colors hover:text-foreground" href="#use-cases">
              {t.landing.navUseCases}
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
        <section className="relative isolate pb-20 pt-20 sm:pb-28 sm:pt-28 lg:pb-32 lg:pt-32">
          <div className="pointer-events-none absolute inset-x-0 top-[-76px] -z-10 h-[760px] overflow-hidden">
            <div className="absolute left-1/2 top-[-440px] h-[850px] w-[1050px] -translate-x-1/2 rounded-full border border-stone-200/80" />
            <div className="absolute left-1/2 top-[-330px] h-[650px] w-[810px] -translate-x-1/2 rounded-full border border-stone-200/70" />
            <div className="absolute left-[14%] top-32 size-52 rounded-full bg-[#efe4dd]/70 blur-3xl" />
            <div className="absolute right-[10%] top-16 size-64 rounded-full bg-[#e6e2f0]/70 blur-3xl" />
          </div>

          <div className="mx-auto max-w-[1050px] px-5 text-center sm:px-8">
            <h1
              className={`mx-auto max-w-4xl break-words text-balance font-semibold leading-[1.01] text-foreground sm:text-[4.75rem] sm:leading-[0.98] lg:text-[6.15rem] ${
                isZh
                  ? "text-[2.35rem] tracking-[-0.02em] sm:text-[4.1rem] lg:text-[5.25rem]"
                  : "text-[2.6rem] tracking-[-0.055em]"
              }`}
            >
              {t.landing.heroLead}{" "}
              <span
                className={`mt-1 block font-serif font-normal italic text-accent sm:mt-0 sm:inline ${
                  isZh ? "tracking-[-0.01em]" : "tracking-[-0.04em]"
                }`}
              >
                {t.landing.heroAccent}
              </span>
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

        </section>

        <section
          id="use-cases"
          className="scroll-mt-24 border-t border-border bg-surface/70 py-24 sm:py-28"
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
                  <article
                    key={useCase.id}
                    className="rounded-[22px] border border-border bg-surface-raised/90 p-5 shadow-[0_1px_2px_rgb(var(--shadow-color)/0.03)] transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_14px_36px_rgb(var(--shadow-color)/0.08)] sm:p-6"
                  >
                    <div className="flex items-start gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                        <Icon className="size-4" strokeWidth={1.7} />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-foreground">
                          {useCase.title}
                        </h3>
                        <p className="mt-0.5 text-[11px] font-semibold text-accent">
                          {useCase.audience}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-muted">
                      {useCase.description}
                    </p>
                    <p className="mt-3 text-[11px] font-medium text-muted-subtle">
                      {useCase.example}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-24 py-24 sm:py-32"
        >
          <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className={`text-success ${sectionLabelClass}`}>
                {t.landing.howEyebrow}
              </p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
                {t.landing.howTitle}
              </h2>
            </div>

            <ConversationLoop className="mx-auto mt-12 max-w-3xl" />
          </div>
        </section>

      </main>

      <footer className="border-t border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-5 px-5 py-7 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2.5">
            <BrandLogo size={32} className="rounded-[10px]" />
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
