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
        "inline-flex items-center rounded-full border border-stone-200 bg-white/80 p-0.5 shadow-sm",
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
            "rounded-full px-2.5 py-1 text-[10px] font-semibold transition",
            locale === option.id
              ? "bg-stone-900 text-white"
              : "text-stone-500 hover:text-stone-800",
          )}
          aria-pressed={locale === option.id}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
