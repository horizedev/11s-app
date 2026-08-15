"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Check,
  CircleUserRound,
  Copy,
  CreditCard,
  Crown,
  Database,
  Download,
  Gift,
  LoaderCircle,
  LogOut,
  Settings2,
  Sparkles,
  Trash2,
} from "lucide-react";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  FREE_PEOPLE_LIMIT,
  dailyPrepLimit,
  REFERRAL_QUOTA_PER_CREDIT,
  type Plan,
  type SubscriptionStatus,
} from "@/lib/billing";
import { useLocale } from "@/lib/i18n";
import { LEGAL_CONTACT_EMAIL } from "@/lib/legal";
import { createClient } from "@/lib/supabase/client";
import type { PrepQuota } from "@/lib/types";

export function AccountPage({
  plan,
  status,
  currentPeriodEnd,
  planIsReferral,
  referralLink,
  referralCount,
  referralRedeemed,
  peopleCount,
  prepQuota,
  userEmail,
  isAdmin = false,
}: {
  plan: Plan;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  planIsReferral: boolean;
  referralLink: string;
  referralCount: number;
  referralRedeemed: number;
  peopleCount: number;
  prepQuota: PrepQuota;
  userEmail?: string;
  isAdmin?: boolean;
}) {
  const { locale, t } = useLocale();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemMessage, setRedeemMessage] = useState<string | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const quotaBalance =
    referralCount - referralRedeemed * REFERRAL_QUOTA_PER_CREDIT;
  const progressToNext =
    REFERRAL_QUOTA_PER_CREDIT - (quotaBalance % REFERRAL_QUOTA_PER_CREDIT);
  const canRedeem = quotaBalance >= REFERRAL_QUOTA_PER_CREDIT;
  const isStripePro = plan === "pro" && !planIsReferral;

  async function copyReferralLink() {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions); the link stays selectable.
    }
  }

  async function redeemCredit() {
    setRedeeming(true);
    setRedeemError(null);
    setRedeemMessage(null);
    try {
      const response = await fetch("/api/referrals/redeem", {
        method: "POST",
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!response.ok) {
        throw new Error(result?.error ?? "redeem_failed");
      }
      setRedeemMessage(t.account.referral.redeemSuccess);
      router.refresh();
    } catch {
      setRedeemError(t.account.referral.redeemFailed);
    } finally {
      setRedeeming(false);
    }
  }

  const dateLocale = locale === "zh-TW" ? "zh-TW" : "en";
  const periodLabel = currentPeriodEnd
    ? new Intl.DateTimeFormat(dateLocale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(currentPeriodEnd))
    : null;

  async function manageBilling() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/billing/portal", { method: "POST" });
      const result = (await response.json().catch(() => null)) as {
        url?: string;
      } | null;
      if (!response.ok || !result?.url) {
        throw new Error("portal failed");
      }
      window.location.href = result.url;
    } catch {
      setError(t.toast.billingUnavailable);
      setPending(false);
    }
  }

  async function signOut() {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/login");
      router.refresh();
    } catch {
      setSigningOut(false);
    }
  }

  async function exportData() {
    setExporting(true);
    setExportError(null);
    try {
      const response = await fetch("/api/account/export");
      if (!response.ok) throw new Error("export failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `11s-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch {
      setExportError(t.account.exportFailed);
    } finally {
      setExporting(false);
    }
  }

  async function deleteAccount() {
    if (deleteConfirm !== "DELETE") return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch("/api/account/delete", {
        method: "POST",
      });
      if (!response.ok) throw new Error("delete failed");
      const supabase = createClient();
      await supabase.auth.signOut().catch(() => {});
      router.replace("/");
      router.refresh();
    } catch {
      setDeleteError(t.account.deleteFailed);
      setDeleting(false);
    }
  }

  return (
    <main
      id="main-content"
      className="relative min-h-screen overflow-hidden bg-background text-foreground"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_62%)]" />
      <div className="relative mx-auto w-full max-w-3xl px-5 pb-20 pt-6 sm:px-8 sm:pt-8">
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
        </header>

        <Link
          href="/workspace"
          className="mt-8 inline-flex items-center gap-2 rounded-lg text-xs font-medium text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          {t.account.backToWorkspace}
        </Link>

        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
          {t.account.eyebrow}
        </p>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
          {t.account.title}
        </h1>
        <p className="mt-3 max-w-xl text-pretty text-sm leading-6 text-muted">
          {t.account.body}
        </p>

        <section className="mt-10 overflow-hidden rounded-[24px] border border-border bg-surface-raised shadow-[0_16px_46px_rgb(var(--shadow-color)/0.07)]">
          <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
            <div className="flex items-start gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-amber-100/80 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                <Crown className="size-4" />
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                  {t.account.currentPlan}
                </p>
                <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-foreground">
                  {plan === "pro"
                    ? t.dialogs.planProName
                    : t.dialogs.planFreeName}
                </p>
              </div>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                plan === "pro"
                  ? "bg-accent text-accent-foreground"
                  : "bg-surface-muted text-muted"
              }`}
            >
              {t.account.status[status]}
            </span>
          </div>

          <div className="grid gap-px bg-border sm:grid-cols-2">
            <div className="bg-surface-raised px-6 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                {t.common.people}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {t.account.peopleUsage(
                  peopleCount,
                  plan === "pro" ? null : FREE_PEOPLE_LIMIT,
                )}
              </p>
            </div>
            <div className="bg-surface-raised px-6 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                {t.dialogs.aiPrepTitle}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {t.account.prepUsage(
                  prepQuota.used,
                  prepQuota.limit ?? dailyPrepLimit(plan),
                )}
              </p>
            </div>
            <div className="bg-surface-raised px-6 py-5 sm:col-span-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                {status === "canceled" || planIsReferral
                  ? t.account.ends
                  : t.account.renews}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {periodLabel ?? t.account.noRenewal}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border px-6 py-5">
            {plan === "pro" && !planIsReferral ? (
              <button
                type="button"
                onClick={() => void manageBilling()}
                disabled={pending}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-xs font-semibold text-foreground transition-[border-color,background-color] hover:border-border-strong hover:bg-surface-muted disabled:opacity-60"
              >
                {pending ? (
                  <LoaderCircle className="size-3.5 animate-spin" />
                ) : (
                  <CreditCard className="size-3.5" />
                )}
                {t.account.manageCta}
              </button>
            ) : (
              <Link
                href="/pricing"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
              >
                <Sparkles className="size-3.5" />
                {t.account.upgradeCta}
              </Link>
            )}
            <Link
              href="/pricing"
              className="inline-flex h-10 items-center rounded-xl px-4 text-xs font-semibold text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              {t.account.viewPricing}
            </Link>
          </div>
          {error ? (
            <p
              role="alert"
              className="border-t border-border bg-danger-soft px-6 py-3 text-xs text-danger"
            >
              {error}
            </p>
          ) : null}
        </section>

        <section className="mt-6 overflow-hidden rounded-[24px] border border-border bg-surface-raised shadow-[0_16px_46px_rgb(var(--shadow-color)/0.07)]">
          <div className="flex items-start gap-3 border-b border-border px-6 py-5">
            <span className="grid size-10 place-items-center rounded-xl bg-emerald-100/80 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
              <Gift className="size-4" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                {t.account.referral.eyebrow}
              </p>
              <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-foreground">
                {t.account.referral.title}
              </p>
              <p className="mt-1 max-w-md text-xs leading-5 text-muted">
                {t.account.referral.body(REFERRAL_QUOTA_PER_CREDIT)}
              </p>
            </div>
          </div>

          <div className="px-6 py-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
              {t.account.referral.linkLabel}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <input
                readOnly
                value={referralLink}
                onFocus={(event) => event.target.select()}
                aria-label={t.account.referral.linkLabel}
                className="h-10 min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 text-xs text-foreground outline-none"
              />
              <button
                type="button"
                onClick={() => void copyReferralLink()}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-xs font-semibold text-foreground transition-[border-color,background-color] hover:border-border-strong hover:bg-surface-muted"
              >
                {copied ? (
                  <Check className="size-3.5 text-success" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                {copied ? t.account.referral.copied : t.account.referral.copy}
              </button>
            </div>
            <span className="sr-only" role="status" aria-live="polite">
              {copied ? t.account.referral.copied : ""}
            </span>
          </div>

          <div className="grid gap-px border-t border-border bg-border sm:grid-cols-3">
            <div className="bg-surface-raised px-6 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                {t.account.referral.referredLabel}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {t.account.referral.referredValue(referralCount)}
              </p>
            </div>
            <div className="bg-surface-raised px-6 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                {t.account.referral.quotaLabel}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {quotaBalance}
              </p>
            </div>
            <div className="bg-surface-raised px-6 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                {t.account.referral.redeemedLabel}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {t.account.referral.redeemedValue(referralRedeemed)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-border px-6 py-5">
            <button
              type="button"
              onClick={() => void redeemCredit()}
              disabled={!canRedeem || isStripePro || redeeming}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {redeeming ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                <Gift className="size-3.5" />
              )}
              {t.account.referral.redeemCta(REFERRAL_QUOTA_PER_CREDIT)}
            </button>
            <p className="text-xs text-muted">
              {isStripePro
                ? t.account.referral.alreadyPro
                : canRedeem
                  ? t.account.referral.readyToRedeem
                  : t.account.referral.progress(progressToNext)}
            </p>
          </div>
          {redeemMessage ? (
            <p
              role="status"
              className="border-t border-border bg-success-soft px-6 py-3 text-xs text-success"
            >
              {redeemMessage}
            </p>
          ) : null}
          {redeemError ? (
            <p
              role="alert"
              className="border-t border-border bg-danger-soft px-6 py-3 text-xs text-danger"
            >
              {redeemError}
            </p>
          ) : null}
        </section>

        <section className="mt-6 overflow-hidden rounded-[24px] border border-border bg-surface-raised shadow-[0_16px_46px_rgb(var(--shadow-color)/0.07)]">
          <div className="flex items-start gap-3 border-b border-border px-6 py-5">
            <span className="grid size-10 place-items-center rounded-xl bg-surface-muted text-muted">
              <Settings2 className="size-4" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                {t.account.preferencesEyebrow}
              </p>
              <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-foreground">
                {t.account.preferencesTitle}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
            <p className="text-xs font-semibold text-foreground">
              {t.common.language}
            </p>
            <LanguageToggle />
          </div>
          <div className="flex items-center justify-between gap-3 px-6 py-4">
            <p className="text-xs font-semibold text-foreground">
              {t.common.theme}
            </p>
            <ThemeToggle />
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-[24px] border border-border bg-surface-raised shadow-[0_16px_46px_rgb(var(--shadow-color)/0.07)]">
          <div className="flex items-start gap-3 border-b border-border px-6 py-5">
            <span className="grid size-10 place-items-center rounded-xl bg-success-soft text-success">
              <CircleUserRound className="size-4" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                {t.dialogs.accountTitle}
              </p>
              <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-foreground">
                {t.account.profileTitle}
              </p>
              {userEmail ? (
                <p className="mt-1 max-w-md truncate text-xs leading-5 text-muted">
                  {t.dialogs.signedInAs(userEmail)}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 px-6 py-5">
            <button
              type="button"
              onClick={() => void signOut()}
              disabled={signingOut}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-xs font-semibold text-foreground transition-[border-color,background-color] hover:border-border-strong hover:bg-surface-muted disabled:opacity-60"
            >
              {signingOut ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                <LogOut className="size-3.5" />
              )}
              {t.dialogs.signOut}
            </button>
            <p className="text-xs text-muted">
              {t.account.contactLabel}{" "}
              <a
                href={`mailto:${LEGAL_CONTACT_EMAIL}`}
                className="font-medium text-muted-subtle transition-colors hover:text-foreground"
              >
                {LEGAL_CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-[24px] border border-border bg-surface-raised shadow-[0_16px_46px_rgb(var(--shadow-color)/0.07)]">
          <div className="flex items-start gap-3 border-b border-border px-6 py-5">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary-soft text-secondary">
              <Download className="size-4" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                {t.account.dataEyebrow}
              </p>
              <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-foreground">
                {t.account.exportTitle}
              </p>
              <p className="mt-1 max-w-md text-xs leading-5 text-muted">
                {t.account.exportBody}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 px-6 py-5">
            <button
              type="button"
              onClick={() => void exportData()}
              disabled={exporting}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-xs font-semibold text-foreground transition-[border-color,background-color] hover:border-border-strong hover:bg-surface-muted disabled:opacity-60"
            >
              {exporting ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              {t.account.exportCta}
            </button>
            {isAdmin ? (
              <Link
                href="/admin"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-xs font-semibold text-foreground transition-[border-color,background-color] hover:border-border-strong hover:bg-surface-muted"
              >
                <BarChart3 className="size-3.5" />
                {t.account.adminCta}
              </Link>
            ) : null}
          </div>
          {exportError ? (
            <p
              role="alert"
              className="border-t border-border bg-danger-soft px-6 py-3 text-xs text-danger"
            >
              {exportError}
            </p>
          ) : null}
        </section>

        <section className="mt-6 overflow-hidden rounded-[24px] border border-danger/30 bg-surface-raised shadow-[0_16px_46px_rgb(var(--shadow-color)/0.07)]">
          <div className="flex items-start gap-3 border-b border-danger/20 px-6 py-5">
            <span className="grid size-10 place-items-center rounded-xl bg-danger-soft text-danger">
              <Trash2 className="size-4" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-danger">
                {t.account.dangerEyebrow}
              </p>
              <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-foreground">
                {t.account.deleteTitle}
              </p>
              <p className="mt-1 max-w-md text-xs leading-5 text-muted">
                {t.account.deleteBody}
              </p>
            </div>
          </div>
          <div className="px-6 py-5">
            <label
              htmlFor="delete-confirm"
              className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-subtle"
            >
              {t.account.deleteConfirmLabel}
            </label>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <input
                id="delete-confirm"
                value={deleteConfirm}
                onChange={(event) => setDeleteConfirm(event.target.value)}
                autoComplete="off"
                spellCheck={false}
                placeholder="DELETE"
                className="h-10 w-40 rounded-xl border border-border bg-surface px-3 text-xs text-foreground outline-none transition-[border-color,box-shadow] focus:border-danger/50 focus:ring-4 focus:ring-danger/10"
              />
              <button
                type="button"
                onClick={() => void deleteAccount()}
                disabled={deleteConfirm !== "DELETE" || deleting}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-danger px-4 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {deleting ? (
                  <LoaderCircle className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
                {deleting ? t.account.deleting : t.account.deleteCta}
              </button>
            </div>
            <p className="mt-2 text-[11px] text-muted-subtle">
              {t.account.deleteConfirmHint}
            </p>
          </div>
          {deleteError ? (
            <p
              role="alert"
              className="border-t border-danger/20 bg-danger-soft px-6 py-3 text-xs text-danger"
            >
              {deleteError}
            </p>
          ) : null}
        </section>

        <section className="mt-6 overflow-hidden rounded-[24px] border border-border bg-surface-raised shadow-[0_16px_46px_rgb(var(--shadow-color)/0.07)]">
          <div className="flex items-start gap-3 border-b border-border px-6 py-5">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary-soft text-secondary">
              <Sparkles className="size-4" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
                {t.account.aboutEyebrow}
              </p>
              <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-foreground">
                {t.account.aboutTitle}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 border-b border-border px-6 py-5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary-soft text-secondary">
              <Sparkles className="size-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-foreground">
                {t.dialogs.aiPrepTitle}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted">
                {t.dialogs.aiPrepBody}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 px-6 py-5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface-muted text-muted">
              <Database className="size-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-foreground">
                {t.dialogs.localStorageTitle}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted">
                {t.dialogs.localStorageBody}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
