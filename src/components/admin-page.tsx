"use client";

import {
  Activity,
  ArrowLeft,
  BarChart3,
  Coins,
  CreditCard,
  LoaderCircle,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLocale } from "@/lib/i18n";

export type AdminUserRow = {
  id: string;
  email: string;
  createdAt: string;
  people: number;
  creditsToday: number;
  creditsMonth: number;
  creditsTotal: number;
  tokensTotal: number;
};

export type AdminStats = {
  totalUsers: number;
  activeSubscriptions: number;
  activeToday: number;
  activeMonth: number;
  peopleTotal: number;
  peopleAvg: number;
  peopleMax: number;
  creditsToday: number;
  creditsMonth: number;
  creditsTotal: number;
  tokensToday: number;
  tokensMonth: number;
  tokensTotal: number;
  perUser: AdminUserRow[];
};

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

export function AdminPage({ stats }: { stats: AdminStats }) {
  const { t } = useLocale();

  const headlineCards = [
    {
      icon: UsersRound,
      label: t.admin.users,
      value: formatNumber(stats.totalUsers),
      hint: t.admin.usersHint,
    },
    {
      icon: CreditCard,
      label: t.admin.subscriptions,
      value: formatNumber(stats.activeSubscriptions),
      hint: t.admin.subscriptionsHint,
    },
    {
      icon: Activity,
      label: t.admin.activeToday,
      value: formatNumber(stats.activeToday),
      hint: t.admin.activeTodayHint,
    },
    {
      icon: Activity,
      label: t.admin.activeMonth,
      value: formatNumber(stats.activeMonth),
      hint: t.admin.activeMonthHint,
    },
    {
      icon: UsersRound,
      label: t.admin.peopleTotal,
      value: formatNumber(stats.peopleTotal),
      hint: `${t.admin.peoplePerUser}: ${stats.peopleAvg.toFixed(1)} · ${t.admin.peopleMax}: ${formatNumber(stats.peopleMax)}`,
    },
  ];

  const creditCards = [
    { label: t.admin.creditsToday, value: stats.creditsToday },
    { label: t.admin.creditsMonth, value: stats.creditsMonth },
    { label: t.admin.creditsTotal, value: stats.creditsTotal },
  ];

  const tokenCards = [
    { label: t.admin.tokensToday, value: stats.tokensToday },
    { label: t.admin.tokensMonth, value: stats.tokensMonth },
    { label: t.admin.tokensTotal, value: stats.tokensTotal },
  ];

  return (
    <main
      id="main-content"
      className="relative min-h-screen overflow-hidden bg-background text-foreground"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--secondary)_12%,transparent),transparent_62%)]" />
      <div className="relative mx-auto w-full max-w-5xl px-5 pb-20 pt-6 sm:px-8 sm:pt-8">
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl"
            aria-label={t.landing.homeAria}
          >
            <BrandLogo size={44} />
            <span className="text-sm font-semibold tracking-[-0.02em]">
              {t.common.brand}
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <LanguageToggle compact />
          </div>
        </header>

        <Link
          href="/workspace"
          className="mt-8 inline-flex items-center gap-2 rounded-lg text-xs font-medium text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          {t.admin.backToWorkspace}
        </Link>

        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary">
          {t.admin.eyebrow}
        </p>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
          {t.admin.title}
        </h1>
        <p className="mt-3 max-w-xl text-pretty text-sm leading-6 text-muted">
          {t.admin.body}
        </p>

        <section
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-label={t.admin.title}
        >
          {headlineCards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.label}
                className="rounded-[20px] border border-border bg-surface-raised p-5 shadow-[0_10px_30px_rgb(var(--shadow-color)/0.05)]"
              >
                <div className="flex items-center gap-2 text-muted">
                  <Icon className="size-3.5" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                    {card.label}
                  </p>
                </div>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                  {card.value}
                </p>
                <p className="mt-1 text-[11px] text-muted-subtle">
                  {card.hint}
                </p>
              </article>
            );
          })}
        </section>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <section className="rounded-[20px] border border-border bg-surface-raised p-5 shadow-[0_10px_30px_rgb(var(--shadow-color)/0.05)]">
            <div className="flex items-center gap-2 text-muted">
              <Coins className="size-3.5" />
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                {t.admin.creditsTitle}
              </h2>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {creditCards.map((card) => (
                <div key={card.label}>
                  <p className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                    {formatNumber(card.value)}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-subtle">
                    {card.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[20px] border border-border bg-surface-raised p-5 shadow-[0_10px_30px_rgb(var(--shadow-color)/0.05)]">
            <div className="flex items-center gap-2 text-muted">
              <BarChart3 className="size-3.5" />
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                {t.admin.tokensTitle}
              </h2>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {tokenCards.map((card) => (
                <div key={card.label}>
                  <p className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                    {formatNumber(card.value)}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-subtle">
                    {card.label}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-6 overflow-hidden rounded-[20px] border border-border bg-surface-raised shadow-[0_10px_30px_rgb(var(--shadow-color)/0.05)]">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">
              {t.admin.perUserTitle}
            </h2>
            <p className="mt-1 text-[11px] text-muted-subtle">
              {t.admin.perUserBody}
            </p>
          </div>
          {stats.perUser.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                    <th className="px-5 py-3">{t.admin.colUser}</th>
                    <th className="px-3 py-3 text-right">{t.admin.colPeople}</th>
                    <th className="px-3 py-3 text-right">
                      {t.admin.colCreditsToday}
                    </th>
                    <th className="px-3 py-3 text-right">
                      {t.admin.colCreditsMonth}
                    </th>
                    <th className="px-3 py-3 text-right">
                      {t.admin.colCreditsTotal}
                    </th>
                    <th className="px-5 py-3 text-right">
                      {t.admin.colTokensTotal}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.perUser.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border/60 last:border-0"
                    >
                      <td className="max-w-[220px] truncate px-5 py-3 font-medium text-foreground">
                        {user.email || t.admin.unknownUser}
                      </td>
                      <td className="px-3 py-3 text-right text-muted">
                        {formatNumber(user.people)}
                      </td>
                      <td className="px-3 py-3 text-right text-muted">
                        {formatNumber(user.creditsToday)}
                      </td>
                      <td className="px-3 py-3 text-right text-muted">
                        {formatNumber(user.creditsMonth)}
                      </td>
                      <td className="px-3 py-3 text-right text-muted">
                        {formatNumber(user.creditsTotal)}
                      </td>
                      <td className="px-5 py-3 text-right text-muted">
                        {formatNumber(user.tokensTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="flex items-center gap-2 px-5 py-8 text-xs text-muted-subtle">
              <LoaderCircle className="size-3.5" />
              {t.admin.emptyUsers}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
