"use client";

import { ArrowLeft, LoaderCircle, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

const copy = {
  en: {
    title: "Choose a new password",
    body: "Enter a new password for your account. You'll stay signed in on this device.",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    submit: "Update password",
    mismatch: "The two passwords don't match.",
    success: "Password updated. Taking you to your workspace…",
    back: "Back to sign in",
  },
  "zh-TW": {
    title: "設定新密碼",
    body: "為你的帳號輸入新密碼。這台裝置會保持登入狀態。",
    newPassword: "新密碼",
    confirmPassword: "再次輸入新密碼",
    submit: "更新密碼",
    mismatch: "兩次輸入的密碼不一致。",
    success: "密碼已更新，正在帶你前往工作區…",
    back: "返回登入",
  },
} as const;

export function ResetPasswordForm() {
  const { locale } = useLocale();
  const t = copy[locale];
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password"));
    const confirm = String(formData.get("confirm"));

    if (password !== confirm) {
      setError(t.mismatch);
      return;
    }

    setPending(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });
      if (updateError) throw updateError;

      setDone(true);
      router.replace("/workspace");
      router.refresh();
    } catch (updateFailure) {
      setError(
        updateFailure instanceof Error
          ? updateFailure.message
          : "Could not update the password. Please try again.",
      );
      setPending(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-5 py-6 text-foreground sm:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--secondary)_14%,transparent),transparent_60%)]" />
      <div className="relative mx-auto flex max-w-6xl items-center justify-between">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-lg text-xs font-semibold text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          {t.back}
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle compact />
          <LanguageToggle compact />
        </div>
      </div>

      <main
        id="main-content"
        className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-md place-items-center py-12"
      >
        <div className="w-full rounded-[26px] border border-border bg-surface-raised p-8 shadow-[0_28px_90px_rgb(var(--shadow-color)/0.1)] sm:p-10">
          <div className="flex items-center justify-between">
            <BrandLogo size={44} className="rounded-[14px]" />
            <span className="grid size-10 place-items-center rounded-xl bg-secondary-soft text-secondary">
              <LockKeyhole aria-hidden="true" className="size-4" />
            </span>
          </div>
          <h1 className="mt-6 text-balance text-2xl font-semibold tracking-[-0.035em]">
            {t.title}
          </h1>
          <p className="mt-2 text-pretty text-xs leading-5 text-muted">{t.body}</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <label className="block text-[11px] font-semibold text-foreground/80">
              {t.newPassword}
              <input
                name="password"
                type="password"
                minLength={8}
                autoComplete="new-password"
                required
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] focus:border-border-strong focus:bg-surface-raised focus:ring-4 focus:ring-focus/10"
              />
            </label>

            <label className="block text-[11px] font-semibold text-foreground/80">
              {t.confirmPassword}
              <input
                name="confirm"
                type="password"
                minLength={8}
                autoComplete="new-password"
                required
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] focus:border-border-strong focus:bg-surface-raised focus:ring-4 focus:ring-focus/10"
              />
            </label>

            {error ? (
              <p
                role="alert"
                className="rounded-xl border border-danger/20 bg-danger-soft px-3 py-2.5 text-xs leading-5 text-danger"
              >
                {error}
              </p>
            ) : null}
            {done ? (
              <p
                role="status"
                className="rounded-xl border border-success/20 bg-success-soft px-3 py-2.5 text-xs leading-5 text-success"
              >
                {t.success}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending || done}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-semibold text-accent-foreground shadow-[0_8px_22px_rgb(var(--shadow-color)/0.12)] transition-[background-color,box-shadow] hover:bg-accent-hover hover:shadow-[0_10px_26px_rgb(var(--shadow-color)/0.16)] disabled:opacity-60"
            >
              {pending ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : null}
              {t.submit}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
