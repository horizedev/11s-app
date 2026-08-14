"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquareText, Plus, UserRoundPlus, X } from "lucide-react";

import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function QuickActions({
  onAddPerson,
  onLogMeeting,
  className,
}: {
  onAddPerson: () => void;
  onLogMeeting?: () => void;
  className?: string;
}) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const actions = [
    ...(onLogMeeting
      ? [
          {
            key: "log",
            label: t.person.logMeeting,
            icon: MessageSquareText,
            onSelect: onLogMeeting,
          },
        ]
      : []),
    {
      key: "add",
      label: t.common.addPerson,
      icon: UserRoundPlus,
      onSelect: onAddPerson,
    },
  ];

  return (
    <div
      ref={rootRef}
      className={cn(
        "fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6",
        className,
      )}
    >
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.key}
            type="button"
            tabIndex={open ? 0 : -1}
            aria-hidden={!open}
            onClick={() => {
              setOpen(false);
              action.onSelect();
            }}
            className={cn(
              "flex items-center gap-2.5 rounded-full border border-border bg-surface-raised py-2 pl-3.5 pr-4 text-xs font-semibold text-foreground shadow-[0_10px_28px_rgb(var(--shadow-color)/0.16)] transition-[opacity,transform,background-color] hover:bg-surface-muted",
              open
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-2 opacity-0",
            )}
          >
            <Icon className="size-4 text-accent" strokeWidth={1.8} />
            {action.label}
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? t.common.closeDialog : t.quickActions.open}
        className="grid size-[52px] place-items-center rounded-full bg-accent text-accent-foreground shadow-[0_14px_36px_rgb(var(--shadow-color)/0.28)] transition-[transform,background-color] hover:bg-accent-hover active:scale-95"
      >
        {open ? (
          <X className="size-5" strokeWidth={2} />
        ) : (
          <Plus className="size-5" strokeWidth={2} />
        )}
      </button>
    </div>
  );
}
