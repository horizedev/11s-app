"use client";

import { useLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageToggle({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { locale, setLocale, t } = useLocale();

  const options: Array<{ id: Locale; label: string }> = [
    { id: "en", label: compact ? "EN" : t.common.english },
    { id: "zh-TW", label: compact ? "繁中" : t.common.traditionalChinese },
  ];

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border border-border bg-surface/90 p-0.5 shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06)]",
        className,
      )}
      role="group"
      aria-label={t.common.language}
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => setLocale(option.id)}
          className={cn(
            "whitespace-nowrap rounded-full py-1 text-[10px] font-semibold transition-[background-color,color,box-shadow]",
            compact ? "px-2" : "px-2.5",
            locale === option.id
              ? "bg-foreground text-background shadow-sm"
              : "text-muted hover:bg-surface-muted hover:text-foreground",
          )}
          aria-pressed={locale === option.id}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
