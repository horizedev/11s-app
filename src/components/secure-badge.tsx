"use client";

import { LockKeyhole } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Lock marker for sensitive user-input areas: everything written here is
 * encrypted at rest (AES-256-GCM) and only visible to the owner's account.
 * Clicking the lock reveals an explanation; an optional extra hint (e.g.
 * usage guidance) is shown below the privacy note in the same tooltip so a
 * field never shows both a lock and a separate question-mark icon.
 */
export function SecureBadge({
  children,
  className,
  side = "bottom",
}: {
  children?: ReactNode;
  className?: string;
  side?: "top" | "bottom";
}) {
  const { t } = useLocale();
  const tooltipId = useId();
  const [open, setOpen] = useState(false);

  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center", className)}
    >
      <button
        type="button"
        aria-label={t.common.sensitiveField}
        aria-describedby={tooltipId}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className="grid size-5 place-items-center rounded-full bg-success-soft text-success transition-colors hover:bg-success/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-1 focus-visible:ring-offset-surface-raised"
      >
        <LockKeyhole className="size-3" strokeWidth={2.2} />
      </button>
      <span
        id={tooltipId}
        role="tooltip"
        className={cn(
          "absolute left-1/2 z-50 w-64 -translate-x-1/2 rounded-xl border border-border bg-surface-raised px-3.5 py-3 text-left shadow-[0_16px_40px_rgb(var(--shadow-color)/0.14)]",
          side === "top" ? "bottom-full mb-2" : "top-full mt-2",
          open ? "block" : "hidden",
        )}
      >
        <span className="block text-[11px] font-semibold text-foreground">
          {t.common.sensitiveField}
        </span>
        <span className="mt-1 block text-[11px] leading-4 text-muted">
          {t.common.sensitiveHint}
        </span>
        {children ? (
          <span className="mt-2 block border-t border-border pt-2 text-[11px] leading-4 text-muted">
            {children}
          </span>
        ) : null}
      </span>
    </span>
  );
}
