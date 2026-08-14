"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageSquareText,
  Plus,
  Search,
  UserRoundPlus,
  X,
} from "lucide-react";

import { Avatar } from "@/components/ui-kit";
import { useLocale } from "@/lib/i18n";
import type { Person } from "@/lib/types";
import { cn } from "@/lib/utils";

export function QuickActions({
  people,
  onAddPerson,
  onLogMeeting,
  onLogMeetingForPerson,
  className,
}: {
  people: Person[];
  onAddPerson: () => void;
  onLogMeeting?: () => void;
  onLogMeetingForPerson?: (personId: string) => void;
  className?: string;
}) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [personPickerOpen, setPersonPickerOpen] = useState(false);
  const [personQuery, setPersonQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open && !personPickerOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setPersonPickerOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setPersonPickerOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, personPickerOpen]);

  const normalizedQuery = personQuery.trim().toLowerCase();
  const matchingPeople = people.filter((person) => {
    if (!normalizedQuery) return true;
    return `${person.name} ${person.role} ${person.organization}`
      .toLowerCase()
      .includes(normalizedQuery);
  });

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
      : onLogMeetingForPerson
        ? [
            {
              key: "pick-log",
              label: t.person.logMeeting,
              icon: MessageSquareText,
              onSelect: () => {
                setOpen(false);
                setPersonPickerOpen(true);
              },
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
      {personPickerOpen ? (
        <div
          role="dialog"
          aria-label={t.quickActions.choosePerson}
          className="absolute bottom-16 right-0 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-surface-raised p-3 shadow-[0_18px_50px_rgb(var(--shadow-color)/0.2)]"
        >
          <div className="flex items-center justify-between gap-3 px-1 pb-2">
            <p className="text-xs font-semibold text-foreground">
              {t.quickActions.choosePerson}
            </p>
            <button
              type="button"
              onClick={() => setPersonPickerOpen(false)}
              className="grid size-7 place-items-center rounded-lg text-muted-subtle transition-colors hover:bg-surface-muted hover:text-foreground"
              aria-label={t.common.closeDialog}
            >
              <X className="size-3.5" />
            </button>
          </div>
          <label className="relative block">
            <span className="sr-only">{t.quickActions.searchPeople}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-subtle" />
            <input
              autoFocus
              name="quick-log-person-search"
              value={personQuery}
              onChange={(event) => setPersonQuery(event.target.value)}
              autoComplete="off"
              placeholder={t.quickActions.searchPeople}
              className="h-10 w-full rounded-xl border border-border bg-surface-muted pl-9 pr-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] focus:border-border-strong focus:bg-surface-raised focus:ring-4 focus:ring-focus/10"
            />
          </label>
          <div className="mt-2 max-h-64 overflow-y-auto">
            {matchingPeople.length > 0 ? (
              <div className="space-y-1">
                {matchingPeople.map((person) => (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => {
                      setPersonPickerOpen(false);
                      setPersonQuery("");
                      onLogMeetingForPerson?.(person.id);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-surface-muted"
                  >
                    <Avatar
                      name={person.name}
                      color={person.color}
                      size="sm"
                      emoji={person.avatarEmoji}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold text-foreground">
                        {person.name}
                      </span>
                      <span className="mt-0.5 block truncate text-[10px] text-muted-subtle">
                        {[person.role, person.organization]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="px-2 py-5 text-center text-xs leading-5 text-muted-subtle">
                {people.length === 0
                  ? t.quickActions.noPeopleToLog
                  : t.sidebar.noMatch}
              </p>
            )}
          </div>
        </div>
      ) : null}

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
