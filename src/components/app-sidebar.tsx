"use client";

import {
  BriefcaseBusiness,
  CircleUserRound,
  House,
  Plus,
  Search,
  Settings2,
  UsersRound,
} from "lucide-react";

import { LanguageToggle } from "@/components/language-toggle";
import { Avatar } from "@/components/ui-kit";
import { useLocale } from "@/lib/i18n";
import type { PeopleFilter, Person } from "@/lib/types";
import {
  cn,
  formatTime,
  getMeetingTiming,
  relationshipMeta,
} from "@/lib/utils";

interface AppSidebarProps {
  people: Person[];
  activePersonId: string | null;
  filter: PeopleFilter;
  search: string;
  onSearchChange: (value: string) => void;
  onSelectOverview: () => void;
  onSelectPerson: (id: string) => void;
  onFilterChange: (filter: PeopleFilter) => void;
  onAddPerson: () => void;
  onOpenSettings: () => void;
}

export function AppSidebar({
  people,
  activePersonId,
  filter,
  search,
  onSearchChange,
  onSelectOverview,
  onSelectPerson,
  onFilterChange,
  onAddPerson,
  onOpenSettings,
}: AppSidebarProps) {
  const { locale, t } = useLocale();

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
    .toSorted(
      (a, b) =>
        new Date(a.nextMeetingAt).getTime() -
        new Date(b.nextMeetingAt).getTime(),
    );

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
    <aside className="hidden h-dvh w-[292px] shrink-0 border-r border-stone-200/80 bg-[#f7f6f2] lg:flex lg:flex-col">
      <div className="flex h-[76px] items-center px-5">
        <button
          type="button"
          className="group flex items-center gap-3 rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
          onClick={onSelectOverview}
          aria-label={t.sidebar.goToOverview}
        >
          <span className="relative grid size-9 place-items-center overflow-hidden rounded-[11px] bg-stone-900 text-white shadow-sm">
            <span className="absolute left-[8px] top-[8px] size-[9px] rounded-full bg-[#f09a75]" />
            <span className="absolute bottom-[8px] right-[8px] size-[9px] rounded-full bg-[#92b9aa]" />
            <span className="h-[2px] w-4 -rotate-45 rounded-full bg-white/70" />
          </span>
          <span>
            <span className="block text-[15px] font-semibold tracking-[-0.02em] text-stone-900">
              {t.common.brand}
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.12em] text-stone-400">
              {t.common.brandTagline}
            </span>
          </span>
        </button>
      </div>

      <div className="px-4 pb-4">
        <label className="relative block">
          <span className="sr-only">{t.sidebar.searchAria}</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t.sidebar.searchPlaceholder}
            className="h-10 w-full rounded-xl border border-stone-200 bg-white/80 pl-9 pr-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-stone-300 focus:bg-white focus:ring-4 focus:ring-stone-900/[0.04]"
          />
        </label>
      </div>

      <nav className="px-3" aria-label={t.sidebar.primaryNav}>
        <button
          type="button"
          onClick={onSelectOverview}
          className={cn(
            "flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition",
            activePersonId === null
              ? "bg-white text-stone-900 shadow-[0_1px_2px_rgba(28,25,23,0.06)]"
              : "text-stone-500 hover:bg-white/60 hover:text-stone-800",
          )}
        >
          <House className="size-4" strokeWidth={1.8} />
          {t.common.overview}
        </button>

        <p className="mb-1 mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400">
          {t.sidebar.groups}
        </p>
        {filters.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onFilterChange(item.id);
                onSelectOverview();
              }}
              className={cn(
                "flex h-9 w-full items-center gap-3 rounded-xl px-3 text-sm transition",
                filter === item.id && activePersonId === null
                  ? "font-medium text-stone-900"
                  : "text-stone-500 hover:bg-white/60 hover:text-stone-800",
              )}
            >
              <Icon className="size-4" strokeWidth={1.7} />
              <span>{item.label}</span>
              <span className="ml-auto text-[11px] tabular-nums text-stone-400">
                {item.count}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-6 flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between px-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400">
            {t.common.people}
          </p>
          <button
            type="button"
            onClick={onAddPerson}
            className="grid size-7 place-items-center rounded-lg text-stone-400 transition hover:bg-white hover:text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            aria-label={t.common.addPerson}
          >
            <Plus className="size-4" />
          </button>
        </div>

        <div className="mt-2 flex-1 overflow-y-auto px-3 pb-4">
          {visiblePeople.length > 0 ? (
            <div className="space-y-0.5">
              {visiblePeople.map((person) => {
                const timing = getMeetingTiming(
                  person.nextMeetingAt,
                  t,
                  locale,
                );
                const active = activePersonId === person.id;

                return (
                  <button
                    type="button"
                    key={person.id}
                    onClick={() => onSelectPerson(person.id)}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                      active
                        ? "bg-stone-900 text-white shadow-sm"
                        : "text-stone-700 hover:bg-white/70",
                    )}
                  >
                    <Avatar
                      name={person.name}
                      color={person.color}
                      size="sm"
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block truncate text-[13px] font-semibold",
                          active ? "text-white" : "text-stone-800",
                        )}
                      >
                        {person.name}
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 block truncate text-[10px]",
                          active ? "text-stone-400" : "text-stone-400",
                        )}
                      >
                        {timing.label} ·{" "}
                        {formatTime(person.nextMeetingAt, locale)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="px-3 py-6 text-center text-xs leading-5 text-stone-400">
              {t.sidebar.noMatch}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-stone-200/80 p-3">
        <div className="mb-2 flex justify-center px-1">
          <LanguageToggle compact />
        </div>
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-stone-500 transition hover:bg-white/70 hover:text-stone-800"
        >
          <span className="grid size-8 place-items-center rounded-full bg-stone-200 text-[11px] font-semibold text-stone-700">
            EL
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold text-stone-700">
              Elvis Leung
            </span>
            <span className="block text-[10px] text-stone-400">
              {t.sidebar.localWorkspace}
            </span>
          </span>
          <Settings2 className="size-3.5" />
        </button>
      </div>
    </aside>
  );
}
