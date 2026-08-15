"use client";

import {
  ArrowRight,
  Check,
  Diamond,
  Leaf,
  LoaderCircle,
  Rocket,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLocale } from "@/lib/i18n";
import type { BillingInterval, Plan } from "@/lib/billing";
import { cn } from "@/lib/utils";

export function PricingPage({
  signedIn,
  plan,
}: {
  signedIn: boolean;
  plan: Plan;
}) {
  const { locale, t } = useLocale();
  const isZh = locale === "zh-TW";
  const [interval, setInterval] = useState<BillingInterval>("year");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const priceAmount =
    interval === "month" ? 5 : interval === "quarter" ? 13 : 50;
  const proPrice = new Intl.NumberFormat(
    locale === "zh-TW" ? "zh-TW" : "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    },
  ).format(priceAmount);
  const perLabel =
    interval === "month"
      ? t.pricing.perMonth
      : interval === "quarter"
        ? t.pricing.perQuarter
        : t.pricing.perYear;

  async function openPortal() {
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/billing/portal", { method: "POST" });
      const result = (await response.json().catch(() => null)) as {
        url?: string;
      } | null;
      if (!response.ok || !result?.url) throw new Error("portal failed");
      window.location.href = result.url;
    } catch {
      setError(t.pricing.checkoutFailed);
      setPending(false);
    }
  }

  async function startCheckout() {
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval }),
      });
      const result = (await response.json().catch(() => null)) as {
        url?: string;
      } | null;
      if (!response.ok || !result?.url) throw new Error("checkout failed");
      window.location.href = result.url;
    } catch {
      setError(t.pricing.checkoutFailed);
      setPending(false);
    }
  }

  function renderProCta() {
    if (!signedIn) {
      return (
        <Link
          href="/login?next=/pricing"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#fff] text-sm font-semibold text-[#1c1917] transition-colors hover:bg-[#f5f5f4]"
        >
          {t.pricing.loginCta}
          <ArrowRight className="size-4" />
        </Link>
      );
    }

    if (plan === "pro") {
      return (
        <button
          type="button"
          onClick={() => void openPortal()}
          disabled={pending}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#fff] text-sm font-semibold text-[#1c1917] transition-colors hover:bg-[#f5f5f4] disabled:opacity-60"
        >
          {pending ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {t.pricing.manageCta}
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => void startCheckout()}
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#fff] text-sm font-semibold text-[#1c1917] transition-colors hover:bg-[#f5f5f4] disabled:opacity-60"
      >
        {pending ? <LoaderCircle className="size-4 animate-spin" /> : null}
        {t.pricing.proCta}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-3 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-xl"
            aria-label={t.landing.homeAria}
          >
            <BrandLogo size={40} />
            <span className="hidden text-sm font-semibold tracking-[-0.02em] sm:inline">
              {t.common.brand}
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle compact />
            <LanguageToggle compact />
            <Link
              href="/workspace"
              aria-label={t.landing.openWorkspace}
              className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-accent px-3 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              <span className="sm:hidden">{isZh ? "開啟" : "Open"}</span>
              <span className="hidden whitespace-nowrap sm:inline">
                {t.landing.openWorkspace}
              </span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className="relative mx-auto max-w-5xl px-5 pb-24 pt-16 sm:px-8 sm:pt-20"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px] bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--accent)_13%,transparent),transparent_58%)]" />
        <div className="mx-auto max-w-2xl text-center">
          <p
            className={cn(
              "text-accent",
              isZh
                ? "text-[10px] font-semibold tracking-[0.1em]"
                : "text-[10px] font-semibold uppercase tracking-[0.16em]",
            )}
          >
            <span aria-hidden="true" className="mr-1.5">
              <Diamond className="inline size-3.5 -translate-y-px" />
            </span>
            {t.pricing.eyebrow}
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-foreground sm:text-5xl">
            {t.pricing.title}{" "}
            <span className="font-serif font-normal italic text-accent">
              {t.pricing.titleAccent}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-7 text-muted sm:text-base">
            {t.pricing.body}
          </p>

          <div
            className="mt-8 inline-flex items-center rounded-xl border border-border bg-surface p-1 shadow-sm"
            role="group"
            aria-label={t.pricing.title}
          >
            {(["month", "quarter", "year"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setInterval(option)}
                aria-pressed={interval === option}
                className={cn(
                  "flex h-11 items-center gap-2 rounded-lg px-4 text-xs font-semibold transition",
                  interval === option
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted hover:text-foreground",
                )}
              >
                {option === "month"
                  ? t.pricing.monthly
                  : option === "quarter"
                    ? t.pricing.quarterly
                    : t.pricing.yearly}
                {option !== "month" ? (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                      interval === option
                        ? "bg-emerald-400/20 text-emerald-200"
                        : "bg-emerald-50 text-emerald-700",
                    )}
                  >
                    {option === "quarter"
                      ? t.pricing.quarterlyBadge
                      : t.pricing.yearlyBadge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
          <section className="rounded-[26px] border border-border bg-gradient-to-br from-white to-[#f8f7f3] p-7 shadow-[0_14px_40px_rgb(var(--shadow-color)/0.05)] dark:from-surface-raised dark:to-surface-muted">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Leaf aria-hidden="true" className="size-4 text-success" />
                {t.pricing.freeName}
              </h2>
              {signedIn && plan === "free" ? (
                <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[9px] font-semibold text-muted">
                  {t.pricing.currentPlan}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-muted">{t.pricing.freeBody}</p>
            <p className="mt-6">
              <span className="text-4xl font-semibold tracking-[-0.04em] text-foreground">
                {t.pricing.freePrice}
              </span>
            </p>
            <ul className="mt-6 space-y-3">
              {t.pricing.freeFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-xs leading-5 text-muted"
                >
                  <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-surface-muted text-muted">
                    <Check className="size-2.5" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/workspace"
              className="mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface text-sm font-semibold text-foreground transition-[border-color,background-color] hover:border-border-strong hover:bg-surface-muted"
            >
              {t.pricing.freeCta}
            </Link>
          </section>

          <section className="relative overflow-hidden rounded-[26px] bg-[#24211f] p-7 text-white shadow-[0_30px_80px_rgba(28,25,23,0.18)]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-24 -top-28 size-72 rounded-full bg-[#755f90]/35 blur-3xl" />
              <div className="absolute -bottom-32 -left-16 size-56 rounded-full bg-[#a8644b]/25 blur-3xl" />
            </div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-1.5 text-sm font-semibold">
                  <Rocket aria-hidden="true" className="size-4 text-[#d9a58f]" />
                  <Sparkles className="size-3.5 text-[#d9a58f]" />
                  {t.pricing.proName}
                </h2>
                {signedIn && plan === "pro" ? (
                  <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[9px] font-semibold text-emerald-300">
                    {t.pricing.currentPlan}
                  </span>
                ) : (
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-semibold text-[#d9a58f]">
                    {t.pricing.proBadge}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-stone-400">{t.pricing.proBody}</p>
              <p className="mt-6">
                <span className="text-4xl font-semibold tracking-[-0.04em]">
                  {proPrice}
                </span>
                <span className="ml-2 text-xs text-stone-400">{perLabel}</span>
              </p>
              <ul className="mt-6 space-y-3">
                {t.pricing.proFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-xs leading-5 text-stone-300"
                  >
                    <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-white/10 text-emerald-300">
                      <Check className="size-2.5" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-8">{renderProCta()}</div>
              {error ? (
                <p
                  role="alert"
                  className="mt-3 rounded-xl border border-red-400/25 bg-red-400/10 px-3 py-2 text-[11px] leading-4 text-red-100"
                >
                  {error}
                </p>
              ) : null}
            </div>
          </section>
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-[11px] leading-5 text-muted">
          {t.pricing.footnote}{" "}
          <Link href="/faq" className="underline underline-offset-2 transition hover:text-foreground">
            {t.landing.footerFaq}
          </Link>
          {" · "}
          <Link href="/terms" className="underline underline-offset-2 transition hover:text-foreground">
            {t.landing.footerTerms}
          </Link>
          {" · "}
          <Link href="/privacy" className="underline underline-offset-2 transition hover:text-foreground">
            {t.landing.footerPrivacy}
          </Link>
        </p>
      </main>
    </div>
  );
}
