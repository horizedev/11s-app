"use client";

import { useEffect, useMemo, useState } from "react";
import {
  House,
  Plus,
  Settings2,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import {
  AddPersonDialog,
  LogMeetingDialog,
  SettingsDialog,
  type NewDiscussionInput,
  type NewPersonInput,
} from "@/components/dialogs";
import { LanguageToggle } from "@/components/language-toggle";
import { Overview } from "@/components/overview";
import { PersonDetail } from "@/components/person-detail";
import { freshDemoPeople } from "@/lib/demo-data";
import { useLocale } from "@/lib/i18n";
import type {
  PeopleFilter,
  Person,
  PrepIdea,
  PrepResponse,
} from "@/lib/types";
import { addCadence, cn, relationshipMeta } from "@/lib/utils";

const STORAGE_KEY = "between.people.v1";
const COLORS = [
  "#6C63A8",
  "#D26A4C",
  "#2E8277",
  "#3F6FA3",
  "#9C5F80",
  "#A37A2F",
  "#527A62",
  "#8A6452",
];

type OpenDialog = "add" | "log" | "settings" | null;

export function OneOnOneApp() {
  const { locale, t } = useLocale();
  const [people, setPeople] = useState<Person[]>(() => freshDemoPeople());
  const [activePersonId, setActivePersonId] = useState<string | null>(null);
  const [filter, setFilter] = useState<PeopleFilter>("all");
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [storageReady, setStorageReady] = useState(false);
  const [generatingPersonId, setGeneratingPersonId] = useState<string | null>(
    null,
  );
  const [prepMeta, setPrepMeta] = useState<
    Record<string, Pick<PrepResponse, "opening" | "source">>
  >({});
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let storedPeople: Person[] | null = null;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Person[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          storedPeople = parsed;
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }

    const frame = window.requestAnimationFrame(() => {
      if (storedPeople) setPeople(storedPeople);
      setStorageReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
  }, [people, storageReady]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2_800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const selectedPerson =
    people.find((person) => person.id === activePersonId) ?? null;

  const filteredPeople = useMemo(
    () =>
      people.filter((person) => {
        if (filter === "all") return true;
        return relationshipMeta[person.relationship].group === filter;
      }),
    [filter, people],
  );

  function updatePerson(
    personId: string,
    update: Partial<Person> | ((person: Person) => Partial<Person>),
  ) {
    setPeople((current) =>
      current.map((person) => {
        if (person.id !== personId) return person;
        const nextUpdate =
          typeof update === "function" ? update(person) : update;
        return { ...person, ...nextUpdate };
      }),
    );
  }

  function showToast(message: string) {
    setToast(message);
  }

  async function generatePrep(person: Person) {
    setGeneratingPersonId(person.id);

    try {
      const response = await fetch("/api/prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          person: {
            name: person.name,
            role: person.role,
            organization: person.organization,
            relationship: person.relationship,
            cadence: person.cadence,
            notes: person.notes,
            discussions: person.discussions
              .toSorted(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
              .slice(0, 10)
              .map((discussion) => ({
                date: discussion.date,
                title: discussion.title,
                summary: discussion.summary,
                topics: discussion.topics,
                followUps: discussion.followUps,
              })),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Preparation request failed");
      }

      const result = (await response.json()) as PrepResponse;
      updatePerson(person.id, { prepIdeas: result.ideas });
      setPrepMeta((current) => ({
        ...current,
        [person.id]: {
          opening: result.opening,
          source: result.source,
        },
      }));
      showToast(
        result.source === "ai" ? t.toast.aiReady : t.toast.starterReady,
      );
    } catch {
      showToast(t.toast.prepFailed);
    } finally {
      setGeneratingPersonId(null);
    }
  }

  function addIdeaToNotes(person: Person, idea: PrepIdea) {
    const note = `${idea.title} — ${idea.prompt}`;
    const existing = person.notes
      .split("\n")
      .map((line) => line.trim().toLowerCase());

    if (existing.includes(note.toLowerCase())) {
      showToast(t.toast.alreadyInNotes);
      return;
    }

    updatePerson(person.id, {
      notes: person.notes.trim() ? `${person.notes.trim()}\n${note}` : note,
    });
    showToast(t.toast.addedToNotes);
  }

  function addPerson(input: NewPersonInput) {
    const id = `${input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}-${crypto.randomUUID().slice(0, 6)}`;
    const person: Person = {
      id,
      ...input,
      lastMeetingAt: "",
      color: COLORS[people.length % COLORS.length],
      discussions: [],
      prepIdeas: [],
    };

    setPeople((current) => [...current, person]);
    setDialog(null);
    setActivePersonId(id);
    showToast(t.toast.personAdded(input.name));
  }

  function logDiscussion(person: Person, input: NewDiscussionInput) {
    updatePerson(person.id, (current) => ({
      discussions: [
        {
          id: crypto.randomUUID(),
          ...input,
        },
        ...current.discussions,
      ].toSorted(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
      lastMeetingAt: input.date,
      nextMeetingAt: addCadence(input.date, current.cadence),
    }));
    setDialog(null);
    showToast(t.toast.conversationSaved);
  }

  function resetWorkspace() {
    window.localStorage.removeItem(STORAGE_KEY);
    setPeople(freshDemoPeople());
    setActivePersonId(null);
    setFilter("all");
    setSearch("");
    setPrepMeta({});
    showToast(t.toast.sampleRestored);
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-[#fdfcfb] text-stone-900">
      <AppSidebar
        people={people}
        activePersonId={activePersonId}
        filter={filter}
        search={search}
        onSearchChange={setSearch}
        onSelectOverview={() => setActivePersonId(null)}
        onSelectPerson={setActivePersonId}
        onFilterChange={setFilter}
        onAddPerson={() => setDialog("add")}
        onOpenSettings={() => setDialog("settings")}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader
          onOverview={() => setActivePersonId(null)}
          onAddPerson={() => setDialog("add")}
          onSettings={() => setDialog("settings")}
        />

        {selectedPerson ? (
          <PersonDetail
            key={selectedPerson.id}
            person={selectedPerson}
            prepMeta={prepMeta[selectedPerson.id]}
            isGenerating={generatingPersonId === selectedPerson.id}
            onBack={() => setActivePersonId(null)}
            onNotesChange={(notes) =>
              updatePerson(selectedPerson.id, { notes })
            }
            onMeetingDateChange={(value) => {
              const date = new Date(value);
              if (Number.isNaN(date.getTime())) return;
              updatePerson(selectedPerson.id, {
                nextMeetingAt: date.toISOString(),
              });
            }}
            onGeneratePrep={() => generatePrep(selectedPerson)}
            onAddIdeaToNotes={(idea) =>
              addIdeaToNotes(selectedPerson, idea)
            }
            onDismissIdea={(ideaId) =>
              updatePerson(selectedPerson.id, (current) => ({
                prepIdeas: current.prepIdeas.filter(
                  (idea) => idea.id !== ideaId,
                ),
              }))
            }
            onLogMeeting={() => setDialog("log")}
          />
        ) : (
          <>
            <MobileFilters
              filter={filter}
              onFilterChange={setFilter}
            />
            <Overview
              people={filteredPeople}
              filter={filter}
              onSelectPerson={setActivePersonId}
              onAddPerson={() => setDialog("add")}
            />
          </>
        )}
      </div>

      <MobileNavigation
        activePersonId={activePersonId}
        onOverview={() => setActivePersonId(null)}
        onPeople={() => {
          setFilter("all");
          setActivePersonId(null);
        }}
        onAddPerson={() => setDialog("add")}
      />

      {dialog === "add" ? (
        <AddPersonDialog onClose={() => setDialog(null)} onSubmit={addPerson} />
      ) : null}
      {dialog === "log" && selectedPerson ? (
        <LogMeetingDialog
          personName={selectedPerson.name}
          onClose={() => setDialog(null)}
          onSubmit={(discussion) =>
            logDiscussion(selectedPerson, discussion)
          }
        />
      ) : null}
      {dialog === "settings" ? (
        <SettingsDialog
          onClose={() => setDialog(null)}
          onReset={resetWorkspace}
        />
      ) : null}

      {toast ? (
        <div
          role="status"
          className="fixed bottom-20 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-stone-900 px-4 py-2.5 text-center text-xs font-medium text-white shadow-[0_12px_36px_rgba(28,25,23,0.24)] sm:left-auto sm:right-6 sm:translate-x-0 lg:bottom-6"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function MobileHeader({
  onOverview,
  onAddPerson,
  onSettings,
}: {
  onOverview: () => void;
  onAddPerson: () => void;
  onSettings: () => void;
}) {
  const { t } = useLocale();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-stone-200/80 bg-[#fdfcfb]/95 px-4 backdrop-blur lg:hidden">
      <button
        type="button"
        onClick={onOverview}
        className="flex items-center gap-2.5 rounded-lg"
      >
        <span className="relative grid size-8 place-items-center overflow-hidden rounded-[10px] bg-stone-900 text-white">
          <span className="absolute left-[7px] top-[7px] size-2 rounded-full bg-[#f09a75]" />
          <span className="absolute bottom-[7px] right-[7px] size-2 rounded-full bg-[#92b9aa]" />
          <span className="h-[2px] w-3.5 -rotate-45 rounded-full bg-white/70" />
        </span>
        <span className="text-sm font-semibold tracking-[-0.02em]">
          {t.common.brand}
        </span>
      </button>
      <div className="flex items-center gap-1">
        <LanguageToggle compact />
        <button
          type="button"
          onClick={onSettings}
          className="grid size-9 place-items-center rounded-xl text-stone-400 transition hover:bg-stone-100"
          aria-label={t.common.openSettings}
        >
          <Settings2 className="size-4" />
        </button>
        <button
          type="button"
          onClick={onAddPerson}
          className="grid size-9 place-items-center rounded-xl bg-stone-900 text-white shadow-sm"
          aria-label={t.common.addPerson}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </header>
  );
}

function MobileFilters({
  filter,
  onFilterChange,
}: {
  filter: PeopleFilter;
  onFilterChange: (filter: PeopleFilter) => void;
}) {
  const { t } = useLocale();

  return (
    <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-stone-100 px-5 py-3 lg:hidden">
      {(
        [
          ["all", t.common.allPeople],
          ["work", t.common.work],
          ["personal", t.common.personal],
        ] as const
      ).map(([id, label]) => (
        <button
          type="button"
          key={id}
          onClick={() => onFilterChange(id)}
          className={cn(
            "h-8 shrink-0 rounded-full px-3 text-[11px] font-semibold transition",
            filter === id
              ? "bg-stone-900 text-white"
              : "bg-stone-100 text-stone-500",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function MobileNavigation({
  activePersonId,
  onOverview,
  onPeople,
  onAddPerson,
}: {
  activePersonId: string | null;
  onOverview: () => void;
  onPeople: () => void;
  onAddPerson: () => void;
}) {
  const { t } = useLocale();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid h-[68px] grid-cols-3 border-t border-stone-200 bg-[#fdfcfb]/95 px-5 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <button
        type="button"
        onClick={onOverview}
        className={cn(
          "flex flex-col items-center justify-center gap-1 text-[9px] font-medium",
          activePersonId === null ? "text-stone-900" : "text-stone-400",
        )}
      >
        <House className="size-[18px]" strokeWidth={1.8} />
        {t.mobile.overview}
      </button>
      <button
        type="button"
        onClick={onAddPerson}
        className="flex flex-col items-center justify-center gap-1 text-[9px] font-medium text-stone-500"
      >
        <span className="grid size-9 place-items-center rounded-full bg-stone-900 text-white shadow-md">
          <UserRoundPlus className="size-4" />
        </span>
      </button>
      <button
        type="button"
        onClick={onPeople}
        className="flex flex-col items-center justify-center gap-1 text-[9px] font-medium text-stone-400"
      >
        <UsersRound className="size-[18px]" strokeWidth={1.8} />
        {t.mobile.people}
      </button>
    </nav>
  );
}
