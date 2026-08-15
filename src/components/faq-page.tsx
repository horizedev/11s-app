"use client";

import { ArrowLeft, ChevronDown, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLocale } from "@/lib/i18n";
import { LEGAL_CONTACT_EMAIL } from "@/lib/legal";
import { cn } from "@/lib/utils";

export function FaqPage() {
  const { locale, t } = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-xl"
            aria-label={t.landing.homeAria}
          >
            <BrandLogo size={40} />
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

        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
          {t.faq.eyebrow}
        </p>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          {t.faq.title}
        </h1>
        <p className="mt-3 text-pretty text-sm leading-6 text-muted">
          {t.faq.body}
        </p>

        <div className="mt-10 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-[0_10px_30px_rgb(var(--shadow-color)/0.05)]">
          {t.faq.items.map((item, index) => {
            const open = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  aria-expanded={open}
                  aria-controls={`faq-panel-${index}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-muted/60"
                >
                  <span className="text-sm font-semibold text-foreground">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-muted-subtle transition-transform",
                      open && "rotate-180",
                    )}
                  />
                </button>
                {open ? (
                  <p
                    id={`faq-panel-${index}`}
                    className="text-pretty px-5 pb-5 text-sm leading-7 text-muted"
                  >
                    {item.answer}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>

        <section className="mt-12 rounded-2xl border border-border bg-surface-raised p-5 shadow-[0_10px_30px_rgb(var(--shadow-color)/0.05)]">
          <h2 className="text-sm font-semibold text-foreground">
            {t.faq.contactTitle}
          </h2>
          <p className="mt-1 text-xs leading-5 text-muted">
            {t.faq.contactBody}
          </p>
          <a
            href={`mailto:${LEGAL_CONTACT_EMAIL}`}
            className="mt-3 inline-flex items-center gap-2 rounded text-sm font-medium text-accent transition-colors hover:text-accent-hover"
          >
            <Mail className="size-3.5" />
            {t.faq.contactCta}
          </a>
        </section>
      </main>
    </div>
  );
}
