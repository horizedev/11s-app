"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { setTheme } = useTheme();
  const { t } = useLocale();

  return (
    <button
      type="button"
      onClick={() =>
        setTheme(
          document.documentElement.classList.contains("dark")
            ? "light"
            : "dark",
        )
      }
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-border bg-surface/90 text-muted shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06)] transition-[border-color,background-color,color,box-shadow] hover:border-border-strong hover:bg-surface-raised hover:text-foreground hover:shadow-sm",
        compact ? "size-8" : "h-9 gap-2 px-3",
        className,
      )}
      aria-label={t.common.toggleTheme}
      title={t.common.toggleTheme}
    >
      <Moon aria-hidden="true" className="size-3.5 dark:hidden" />
      <Sun aria-hidden="true" className="hidden size-3.5 dark:block" />
      {!compact ? (
        <span className="text-[10px] font-semibold">{t.common.theme}</span>
      ) : null}
    </button>
  );
}
