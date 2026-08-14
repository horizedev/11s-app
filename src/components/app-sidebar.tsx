"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CircleUserRound,
  House,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings2,
  Target,
  UsersRound,
} from "lucide-react";

import { LanguageToggle } from "@/components/language-toggle";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar } from "@/components/ui-kit";
import { useLocale } from "@/lib/i18n";
import type { PeopleFilter, Person } from "@/lib/types";
import {
  cn,
  getLastMeetingTiming,
  relationshipMeta,
  sortByLastMeetingThenName,
} from "@/lib/utils";

const SIDEBAR_COLLAPSED_KEY = "11s.sidebar.collapsed.v1";

interface AppSidebarProps {
  people: Person[];
  userEmail?: string;
  activePersonId: string | null;
  panel: "overview" | "small-talk" | "career";
  filter: PeopleFilter;
  search: string;
  onSearchChange: (value: string) => void;
  onSelectOverview: () => void;
  onSelectSmallTalk: () => void;
  onSelectCareer: () => void;
  onSelectPerson: (id: string) => void;
  onFilterChange: (filter: PeopleFilter) => void;
  onAddPerson: () => void;
}

export function AppSidebar({
  people,
  userEmail,
  activePersonId,
  panel,
  filter,
  search,
  onSearchChange,
  onSelectOverview,
  onSelectSmallTalk,
  onSelectCareer,
  onSelectPerson,
  onFilterChange,
  onAddPerson,
}: AppSidebarProps) {
  const { locale, t } = useLocale();
  const [collapsed, setCollapsed] = useState(false);
  const accountLabel = userEmail ?? t.dialogs.accountTitle;
  const accountInitials = accountLabel
    .split("@")[0]
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        setCollapsed(
          window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1",
        );
      } catch {
        // ignore storage errors
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }

  const visiblePeople = people
    .filter((person) => {
      if (filter === "all") return true;
      return relationshipMeta[person.relationship].group === filter;
    })
    .filter((person) => {
      const query = search.trim().toLowerCase();
      if (!query) return true;
      return `${person.name} ${person.role} ${person.organization}`
        .toLowerCase()
        .includes(query);
    })
    .toSorted(sortByLastMeetingThenName);

  const filters: Array<{
    id: PeopleFilter;
    label: string;
    icon: typeof UsersRound;
    count: number;
  }> = [
    {
      id: "all",
      label: t.common.allPeople,
      icon: UsersRound,
      count: people.length,
    },
    {
      id: "work",
      label: t.common.work,
      icon: BriefcaseBusiness,
      count: people.filter(
        (person) => relationshipMeta[person.relationship].group === "work",
      ).length,
    },
    {
      id: "personal",
      label: t.common.personal,
      icon: CircleUserRound,
      count: people.filter(
        (person) => relationshipMeta[person.relationship].group === "personal",
      ).length,
    },
  ];

  return (
    <aside
      className={cn(
        "hidden h-dvh shrink-0 border-r border-border bg-sidebar transition-[width] duration-200 ease-out lg:flex lg:flex-col",
        collapsed ? "w-[76px]" : "w-[292px]",
      )}
    >
      <div
        className={cn(
          "flex h-[88px] items-center",
          collapsed ? "justify-center px-2" : "justify-between px-5",
        )}
      >
        <button
          type="button"
          className={cn(
            "group flex items-center rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-focus",
            collapsed ? "justify-center" : "gap-3.5",
          )}
          onClick={onSelectOverview}
          aria-label={t.sidebar.goToOverview}
        >
          <BrandLogo size={44} />
          {!collapsed ? (
            <span>
              <span className="block text-[15px] font-semibold leading-none tracking-[-0.02em] text-foreground">
                {t.common.brand}
              </span>
              <span className="mt-1 block whitespace-nowrap text-[11px] font-medium leading-4 text-muted-subtle">
                {t.common.brandTagline}
              </span>
            </span>
          ) : null}
        </button>
        {!collapsed ? (
          <button
            type="button"
            onClick={toggleCollapsed}
            className="grid size-8 place-items-center rounded-lg text-muted-subtle transition-colors hover:bg-surface hover:text-foreground"
            aria-label={t.sidebar.collapse}
          >
            <PanelLeftClose className="size-4" />
          </button>
        ) : null}
      </div>

      {collapsed ? (
        <div className="px-2 pb-3">
          <button
            type="button"
            onClick={toggleCollapsed}
            className="grid h-10 w-full place-items-center rounded-xl text-muted-subtle transition-colors hover:bg-surface hover:text-foreground"
            aria-label={t.sidebar.expand}
          >
            <PanelLeftOpen className="size-4" />
          </button>
        </div>
      ) : (
        <div className="px-4 pb-4">
          <label className="relative block">
            <span className="sr-only">{t.sidebar.searchAria}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-subtle" />
            <input
              name="people-search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              autoComplete="off"
              spellCheck={false}
              placeholder={t.sidebar.searchPlaceholder}
              className="h-10 w-full rounded-xl border border-border bg-surface/80 pl-9 pr-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] placeholder:text-muted-subtle focus:border-border-strong focus:bg-surface-raised focus:ring-4 focus:ring-focus/10"
            />
          </label>
        </div>
      )}

      <nav
        className={cn("px-2", !collapsed && "px-3")}
        aria-label={t.sidebar.primaryNav}
      >
        <button
          type="button"
          onClick={onSelectOverview}
          title={t.common.overview}
          aria-label={t.common.overview}
          className={cn(
            "flex h-10 w-full items-center rounded-xl text-sm font-medium transition",
            collapsed ? "justify-center" : "gap-3 px-3",
            activePersonId === null && panel === "overview"
              ? "bg-surface-raised text-foreground shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06)]"
              : "text-muted hover:bg-surface/70 hover:text-foreground",
          )}
        >
          <House className="size-4" strokeWidth={1.8} />
          {!collapsed ? t.common.overview : null}
        </button>

        <button
          type="button"
          onClick={onSelectSmallTalk}
          title={t.common.smallTalk}
          aria-label={t.common.smallTalk}
          className={cn(
            "mt-1 flex h-10 w-full items-center rounded-xl text-sm font-medium transition",
            collapsed ? "justify-center" : "gap-3 px-3",
            activePersonId === null && panel === "small-talk"
              ? "bg-surface-raised text-foreground shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06)]"
              : "text-muted hover:bg-surface/70 hover:text-foreground",
          )}
        >
          <MessageCircle className="size-4" strokeWidth={1.8} />
          {!collapsed ? t.common.smallTalk : null}
        </button>

        <button
          type="button"
          onClick={onSelectCareer}
          title={t.common.career}
          aria-label={t.common.career}
          className={cn(
            "mt-1 flex h-10 w-full items-center rounded-xl text-sm font-medium transition",
            collapsed ? "justify-center" : "gap-3 px-3",
            activePersonId === null && panel === "career"
              ? "bg-surface-raised text-foreground shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06)]"
              : "text-muted hover:bg-surface/70 hover:text-foreground",
          )}
        >
          <Target className="size-4" strokeWidth={1.8} />
          {!collapsed ? t.common.career : null}
        </button>

        {!collapsed ? (
          <p className="mb-1 mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-subtle">
            {t.sidebar.groups}
          </p>
        ) : (
          <div className="mt-4" />
        )}
        {filters.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              title={item.label}
              aria-label={item.label}
              onClick={() => {
                onFilterChange(item.id);
                onSelectOverview();
              }}
              className={cn(
                "flex h-9 w-full items-center rounded-xl text-sm transition",
                collapsed ? "justify-center" : "gap-3 px-3",
                filter === item.id &&
                  activePersonId === null &&
                  panel === "overview"
                  ? "font-medium text-foreground"
                  : "text-muted hover:bg-surface/70 hover:text-foreground",
              )}
            >
              <Icon className="size-4" strokeWidth={1.7} />
              {!collapsed ? (
                <>
                  <span>{item.label}</span>
                  <span className="ml-auto text-[11px] tabular-nums text-muted-subtle">
                    {item.count}
                  </span>
                </>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="mt-6 flex min-h-0 flex-1 flex-col">
        {!collapsed ? (
          <div className="flex items-center justify-between px-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-subtle">
              {t.common.people}
            </p>
            <button
              type="button"
              onClick={onAddPerson}
              className="grid size-7 place-items-center rounded-lg text-muted-subtle transition-colors hover:bg-surface hover:text-foreground"
              aria-label={t.common.addPerson}
            >
              <Plus className="size-4" />
            </button>
          </div>
        ) : (
          <div className="px-2">
            <button
              type="button"
              onClick={onAddPerson}
              className="grid h-9 w-full place-items-center rounded-xl text-muted-subtle transition-colors hover:bg-surface hover:text-foreground"
              aria-label={t.common.addPerson}
            >
              <Plus className="size-4" />
            </button>
          </div>
        )}

        <div
          className={cn(
            "mt-2 flex-1 overflow-y-auto pb-4",
            collapsed ? "px-2" : "px-3",
          )}
        >
          {visiblePeople.length > 0 ? (
            <div className="space-y-0.5">
              {visiblePeople.map((person) => {
                const timing = getLastMeetingTiming(
                  person.lastMeetingAt,
                  t,
                  locale,
                );
                const active = activePersonId === person.id;

                return (
                  <button
                    type="button"
                    key={person.id}
                    title={person.name}
                    onClick={() => onSelectPerson(person.id)}
                    className={cn(
                      "group flex w-full items-center rounded-xl text-left transition",
                      collapsed ? "justify-center px-1 py-2" : "gap-3 px-3 py-2.5",
                      active
                        ? "bg-foreground text-background shadow-sm"
                        : "text-muted hover:bg-surface/75",
                    )}
                  >
                    <Avatar
                      name={person.name}
                      color={person.color}
                      size="sm"
                      emoji={person.avatarEmoji}
                    />
                    {!collapsed ? (
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block truncate text-[13px] font-semibold",
                            active ? "text-background" : "text-foreground",
                          )}
                        >
                          {person.name}
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 block truncate text-[10px]",
                            active ? "text-background/70" : "text-muted-subtle",
                          )}
                        >
                          {timing.label}
                        </span>
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : !collapsed ? (
            <p className="px-3 py-6 text-center text-xs leading-5 text-muted-subtle">
              {t.sidebar.noMatch}
            </p>
          ) : null}
        </div>
      </div>

      <div className={cn("border-t border-border", collapsed ? "p-2" : "p-3")}>
        {!collapsed ? (
          <div className="mb-2 flex items-center justify-center gap-2 px-1">
            <ThemeToggle compact />
            <LanguageToggle compact />
          </div>
        ) : null}
        <Link
          href="/account"
          title={accountLabel}
          aria-label={accountLabel}
          className={cn(
            "flex w-full items-center rounded-xl text-left text-sm text-muted transition-colors hover:bg-surface/75 hover:text-foreground",
            collapsed ? "justify-center py-2" : "gap-3 px-3 py-2.5",
          )}
        >
          <span className="grid size-8 place-items-center rounded-full bg-surface-muted text-[11px] font-semibold text-foreground">
            {accountInitials || "B"}
          </span>
          {!collapsed ? (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-foreground">
                  {accountLabel}
                </span>
                <span className="block text-[10px] text-muted-subtle">
                  {t.sidebar.localWorkspace}
                </span>
              </span>
              <Settings2 className="size-3.5" />
            </>
          ) : null}
        </Link>
      </div>
    </aside>
  );
}
