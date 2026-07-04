import { AuthButton } from "@/components/auth-button";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f4ea_0%,#fffdf8_45%,#ffffff_100%)] text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6">
        <nav className="flex items-center justify-between border-b border-border/70 pb-4">
          <div className="space-y-1">
            <Link href="/" className="text-sm font-semibold uppercase tracking-[0.28em]">
              11s
            </Link>
            <p className="text-sm text-muted-foreground">
              Prepare every important 1:1 with continuity.
            </p>
          </div>
          <Suspense>
            <AuthButton />
          </Suspense>
        </nav>

        <section className="grid flex-1 gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-border/60 bg-background/90 px-4 py-2 text-sm text-muted-foreground">
              Relationship-first, not recording-first
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                Show up prepared, remember what matters, and follow through.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                11s gives each recurring 1:1 a dedicated place for agenda prep,
                notes, decisions, and next steps without forcing HR-suite
                overhead or meeting recordings.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Prepare your next 1:1
              </Link>
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium transition hover:bg-secondary"
              >
                Create an account
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border/70 bg-[#16344c] p-8 text-white shadow-[0_40px_120px_rgba(22,52,76,0.18)]">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.24em] text-white/70">
                  MVP foundation
                </p>
                <h2 className="text-2xl font-semibold">
                  Built for the first complete workflow
                </h2>
              </div>
              <ul className="space-y-4 text-sm leading-7 text-white/80">
                <li>Protected app route with Supabase SSR auth.</li>
                <li>Empty-state dashboard for a new user&apos;s first 1:1.</li>
                <li>Environment scaffolding for local and Vercel setup.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
