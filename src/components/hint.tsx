"use client";

import { CircleHelp } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Hint({
  label,
  children,
  className,
  side = "bottom",
}: {
  label: string;
  children: ReactNode;
  className?: string;
  side?: "top" | "bottom";
}) {
  const tooltipId = useId();
  const [open, setOpen] = useState(false);

  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={tooltipId}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className="peer grid size-5 place-items-center rounded-full text-muted-subtle transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-1 focus-visible:ring-offset-surface-raised"
      >
        <CircleHelp className="size-3.5" strokeWidth={1.8} />
      </button>
      <span
        id={tooltipId}
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-30 w-56 rounded-xl border border-border bg-surface-raised px-3 py-2 text-left text-[11px] font-normal leading-5 text-muted opacity-0 shadow-[0_10px_30px_rgb(var(--shadow-color)/0.14)] transition-opacity duration-150 peer-hover:opacity-100 peer-focus-visible:opacity-100 sm:w-64",
          open && "opacity-100",
          side === "top"
            ? "bottom-full left-1/2 mb-2 -translate-x-1/2"
            : "left-1/2 top-full mt-2 -translate-x-1/2",
        )}
      >
        {children}
      </span>
    </span>
  );
}
