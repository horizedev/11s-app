"use client";

import { ArrowLeft, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

type Mode = "sign-in" | "sign-up" | "forgot";

const copy = {
  en: {
    eyebrow: "Your private workspace",
    title: "Keep every conversation in reach.",
    body: "Sign in to sync your people, notes, and history securely across devices.",
    signIn: "Sign in",
    signUp: "Create account",
    email: "Email",
    password: "Password",
    submitSignIn: "Open workspace",
    submitSignUp: "Create my workspace",
    continueWithGoogle: "Continue with Google",
    orEmail: "or continue with email",
    switchToSignUp: "New to 11s? Create an account",
    switchToSignIn: "Already have an account? Sign in",
    checkEmail:
      "Check your inbox to confirm your email, then return here to sign in.",
    forgotPassword: "Forgot password?",
    resetTitle: "Reset your password",
    resetBody:
      "Enter the email for your account and we'll send you a reset link.",
    sendReset: "Send reset link",
    resetSent:
      "If an account exists for that email, a reset link is on its way. It expires soon, so check your inbox.",
    backToSignIn: "Back to sign in",
    resetInvalid:
      "That reset link is invalid or has expired. Please request a new one.",
    secure: "Encrypted in transit and visible only to your account",
    back: "Back to 11s",
  },
  "zh-TW": {
    eyebrow: "你的私人工作區",
    title: "每段重要對話，都隨時找得到。",
    body: "登入後即可在不同裝置安全同步人物、筆記與對話紀錄。",
    signIn: "登入",
    signUp: "建立帳號",
    email: "電子郵件",
    password: "密碼",
    submitSignIn: "開啟工作區",
    submitSignUp: "建立我的工作區",
    continueWithGoogle: "使用 Google 繼續",
    orEmail: "或使用電子郵件繼續",
    switchToSignUp: "第一次使用 11s？建立帳號",
    switchToSignIn: "已經有帳號了？登入",
    checkEmail: "請到收件匣確認電子郵件，再回來登入。",
    forgotPassword: "忘記密碼？",
    resetTitle: "重設密碼",
    resetBody: "輸入帳號的電子郵件，我們會寄重設連結給你。",
    sendReset: "寄送重設連結",
    resetSent: "如果這個電子郵件有對應的帳號，重設連結已寄出。連結有時效，請盡快查看收件匣。",
    backToSignIn: "返回登入",
    resetInvalid: "這個重設連結無效或已過期，請重新申請一次。",
    secure: "傳輸全程加密，內容僅限你的帳號存取",
    back: "返回 11s",
  },
} as const;

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      width={18}
      height={18}
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function AuthForm({
  nextPath,
  initialError,
}: {
  nextPath: string;
  initialError?: string;
}) {
  const { locale } = useLocale();
  const t = copy[locale];
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(
    initialError === "reset-link-invalid"
      ? t.resetInvalid
      : (initialError ?? ""),
  );
  const [message, setMessage] = useState("");
  const [oauthPending, setOauthPending] = useState(false);

  async function handleGoogleSignIn() {
    setOauthPending(true);
    setError("");
    setMessage("");

    try {
      const supabase = createClient();
      // Keep redirectTo path-only so it matches exact allow-list entries.
      // Pass next via the callback path query only when wildcards are configured;
      // /auth/callback defaults next to /workspace.
      const callbackUrl = new URL("/auth/callback", window.location.origin);
      if (nextPath && nextPath !== "/workspace") {
        callbackUrl.searchParams.set("next", nextPath);
      }

      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl.toString(),
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });
      if (oauthError) throw oauthError;
      if (!data.url) {
        throw new Error("Google sign-in is not available right now.");
      }

      window.location.assign(data.url);
    } catch (authError) {
      setError(
        authError instanceof Error
          ? authError.message
          : "Google sign-in failed. Please try again.",
      );
      setOauthPending(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email")).trim();
    const password = String(formData.get("password"));
    const supabase = createClient();

    try {
      if (mode === "forgot") {
        const resetUrl = new URL("/auth/callback", window.location.origin);
        resetUrl.searchParams.set("next", "/reset-password");

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          email,
          { redirectTo: resetUrl.toString() },
        );
        if (resetError) throw resetError;

        setMessage(t.resetSent);
        return;
      }

      if (mode === "sign-in") {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;

        router.replace(nextPath);
        router.refresh();
        return;
      }

      const callbackUrl = new URL("/auth/callback", window.location.origin);
      callbackUrl.searchParams.set("next", nextPath);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: callbackUrl.toString() },
      });
      if (signUpError) throw signUpError;

      if (data.session) {
        router.replace(nextPath);
        router.refresh();
      } else {
        setMessage(t.checkEmail);
      }
    } catch (authError) {
      setError(
        authError instanceof Error
          ? authError.message
          : "Authentication failed. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-5 py-6 text-foreground sm:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_72%_0%,color-mix(in_srgb,var(--secondary)_14%,transparent),transparent_58%),radial-gradient(circle_at_20%_14%,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_42%)]" />
      <div className="relative mx-auto flex max-w-6xl items-center justify-between">
        <Link
          href="/"
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
        className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-5xl place-items-center py-12"
      >
        <div className="grid w-full overflow-hidden rounded-[30px] border border-border bg-surface-raised shadow-[0_28px_90px_rgb(var(--shadow-color)/0.12)] lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden overflow-hidden bg-[#24211f] p-12 text-white lg:block">
            <div className="absolute -right-20 -top-28 size-80 rounded-full bg-[#755f90]/40 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 size-72 rounded-full bg-[#a8644b]/30 blur-3xl" />
            <div className="relative flex h-full min-h-[570px] flex-col justify-between">
              <div>
                <BrandLogo size={48} className="rounded-2xl" />
                <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#d7a58c]">
                  {t.eyebrow}
                </p>
                <h1 className="mt-4 max-w-md text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.05em]">
                  {t.title}
                </h1>
                <p className="mt-6 max-w-md text-sm leading-7 text-stone-400">
                  {t.body}
                </p>
              </div>
              <p className="flex items-center gap-2 text-[10px] text-stone-400">
                <LockKeyhole aria-hidden="true" className="size-3.5 text-emerald-400" />
                {t.secure}
              </p>
            </div>
          </section>

          <section className="px-6 py-10 sm:px-12 sm:py-14">
            <div className="mx-auto max-w-sm">
              <BrandLogo size={44} className="rounded-[14px] lg:hidden" />

              {mode !== "forgot" ? (
                <div className="mt-8 flex rounded-xl border border-border bg-surface-muted p-1 lg:mt-0">
                  {(["sign-in", "sign-up"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={mode === item}
                      onClick={() => {
                        setMode(item);
                        setError("");
                        setMessage("");
                      }}
                      className={`h-9 flex-1 whitespace-nowrap rounded-lg text-[11px] font-semibold transition sm:text-xs ${
                        mode === item
                          ? "bg-surface-raised text-foreground shadow-sm"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      {item === "sign-in" ? t.signIn : t.signUp}
                    </button>
                  ))}
                </div>
              ) : null}

              <h2 className="mt-9 text-balance text-2xl font-semibold tracking-[-0.035em]">
                {mode === "forgot"
                  ? t.resetTitle
                  : mode === "sign-in"
                    ? t.signIn
                    : t.signUp}
              </h2>
              <p className="mt-2 text-pretty text-xs leading-5 text-muted lg:hidden">
                {mode === "forgot" ? t.resetBody : t.body}
              </p>
              {mode === "forgot" ? (
                <p className="mt-2 hidden text-pretty text-xs leading-5 text-muted lg:block">
                  {t.resetBody}
                </p>
              ) : null}

              {mode !== "forgot" ? (
                <div className="mt-7 space-y-4">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={pending || oauthPending}
                    className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-surface-raised text-sm font-semibold text-foreground shadow-sm transition-[background-color,border-color,box-shadow] hover:border-border-strong hover:bg-surface disabled:opacity-60"
                  >
                    {oauthPending ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <GoogleMark />
                    )}
                    {t.continueWithGoogle}
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-border" />
                    <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-subtle">
                      {t.orEmail}
                    </span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                </div>
              ) : null}

              <form
                onSubmit={handleSubmit}
                className={`space-y-4 ${mode === "forgot" ? "mt-7" : "mt-4"}`}
              >
                <label className="block text-[11px] font-semibold text-foreground/80">
                  {t.email}
                  <span className="relative mt-1.5 block">
                    <Mail aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-subtle" />
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      spellCheck={false}
                      required
                      className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] focus:border-border-strong focus:bg-surface-raised focus:ring-4 focus:ring-focus/10"
                    />
                  </span>
                </label>

                {mode !== "forgot" ? (
                  <label className="block text-[11px] font-semibold text-foreground/80">
                    <span className="flex items-center justify-between">
                      {t.password}
                      {mode === "sign-in" ? (
                        <button
                          type="button"
                          onClick={() => {
                            setMode("forgot");
                            setError("");
                            setMessage("");
                          }}
                          className="rounded text-[11px] font-medium text-muted transition-colors hover:text-foreground"
                        >
                          {t.forgotPassword}
                        </button>
                      ) : null}
                    </span>
                    <span className="relative mt-1.5 block">
                      <LockKeyhole aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-subtle" />
                      <input
                        name="password"
                        type="password"
                        minLength={8}
                        autoComplete={
                          mode === "sign-in"
                            ? "current-password"
                            : "new-password"
                        }
                        required
                        className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] focus:border-border-strong focus:bg-surface-raised focus:ring-4 focus:ring-focus/10"
                      />
                    </span>
                  </label>
                ) : null}

                {error ? (
                  <p
                    role="alert"
                    className="rounded-xl border border-danger/20 bg-danger-soft px-3 py-2.5 text-xs leading-5 text-danger"
                  >
                    {error}
                  </p>
                ) : null}
                {message ? (
                  <p
                    role="status"
                    className="rounded-xl border border-success/20 bg-success-soft px-3 py-2.5 text-xs leading-5 text-success"
                  >
                    {message}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={pending || oauthPending}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-semibold text-accent-foreground shadow-[0_8px_22px_rgb(var(--shadow-color)/0.12)] transition-[background-color,box-shadow] hover:bg-accent-hover hover:shadow-[0_10px_26px_rgb(var(--shadow-color)/0.16)] disabled:opacity-60"
                >
                  {pending ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : null}
                  {mode === "forgot"
                    ? t.sendReset
                    : mode === "sign-in"
                      ? t.submitSignIn
                      : t.submitSignUp}
                </button>
              </form>

              <button
                type="button"
                onClick={() => {
                  setMode(
                    mode === "sign-in"
                      ? "sign-up"
                      : mode === "sign-up"
                        ? "sign-in"
                        : "sign-in",
                  );
                  setError("");
                  setMessage("");
                }}
                className="mt-6 w-full rounded-lg text-center text-xs font-medium text-muted transition-colors hover:text-foreground"
              >
                {mode === "forgot"
                  ? t.backToSignIn
                  : mode === "sign-in"
                    ? t.switchToSignUp
                    : t.switchToSignIn}
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
