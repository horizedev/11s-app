"use client";

import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLocale } from "@/lib/i18n";
import { legalContent } from "@/lib/legal";

export function LegalPage({ doc }: { doc: "terms" | "privacy" }) {
  const { locale, t } = useLocale();
  const content = legalContent[locale][doc];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-xl"
            aria-label={t.landing.homeAria}
          >
            <BrandLogo size={30} />
            <span className="text-sm font-semibold tracking-[-0.02em]">
              {t.common.brand}
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <LanguageToggle compact />
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg text-xs font-semibold text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          {locale === "zh-TW" ? "返回 11s" : "Back to 11s"}
        </Link>

        <h1 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          {content.title}
        </h1>
        <p className="mt-3 text-xs text-muted-subtle">
          {content.effectiveLabel}: {content.effectiveDate}
        </p>

        <div className="mt-8 space-y-4">
          {content.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-pretty text-sm leading-7 text-muted">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-10 space-y-9">
          {content.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="scroll-mt-24 text-base font-semibold tracking-[-0.01em] text-foreground">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 24)}
                    className="text-pretty text-sm leading-7 text-muted"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.list ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-muted marker:text-muted-subtle">
                  {section.list.map((item) => (
                    <li key={item.slice(0, 24)}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-border bg-surface-raised p-5 shadow-[0_10px_30px_rgb(var(--shadow-color)/0.05)]">
          <h2 className="text-sm font-semibold text-foreground">
            {content.contactLabel}
          </h2>
          <a
            href={`mailto:${content.contactEmail}`}
            className="mt-2 inline-flex items-center gap-2 rounded text-sm font-medium text-accent transition-colors hover:text-accent-hover"
          >
            <Mail className="size-3.5" />
            {content.contactEmail}
          </a>
        </section>
      </main>
    </div>
  );
}
