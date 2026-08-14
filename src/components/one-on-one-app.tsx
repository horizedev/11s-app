"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  House,
  LoaderCircle,
  MessageCircle,
  Settings2,
  Target,
  UserRoundPlus,
} from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { BrandLogo } from "@/components/brand-logo";
import { CareerPage } from "@/components/career-page";
import {
  AddPersonDialog,
  EditPersonDialog,
  LogMeetingDialog,
  type NewDiscussionInput,
  type NewPersonInput,
} from "@/components/dialogs";
import { LanguageToggle } from "@/components/language-toggle";
import { Overview } from "@/components/overview";
import { PersonDetail } from "@/components/person-detail";
import { SmallTalkPage } from "@/components/small-talk-page";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLocale } from "@/lib/i18n";
import { pickDefaultEmoji } from "@/lib/avatars";
import { createClient } from "@/lib/supabase/client";
import type { Plan } from "@/lib/billing";
import type { NewsArea } from "@/lib/news";
import type {
  CareerNeedStatus,
  CareerProfile,
  GeneralPrep,
  MeetingIntent,
  PeopleFilter,
  Person,
  PrepIdea,
  PrepQuota,
  PrepRefineMode,
  PrepResponse,
  WhoToAskResponse,
  WhoToAskSuggestion,
} from "@/lib/types";
import { cn, relationshipMeta } from "@/lib/utils";
import {
  createCareerNeed,
  createDiscussion,
  createPerson,
  deleteCareerNeed,
  deletePerson,
  dismissPrepIdea,
  grantPrepCreditForLogging,
  loadPrepQuota,
  loadWorkspace,
  PlanLimitError,
  replaceGeneralPrepIdeas,
  replacePrepIdeas,
  saveCareerProfile,
  saveContextBank,
  saveLocale,
  savePersonFields,
  updateCareerNeedStatus,
  updateDiscussion,
  type PrepMetaByPerson,
  type WorkspaceSnapshot,
} from "@/lib/workspace-data";

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

const NEWS_AREAS_STORAGE_KEY = "11s.smallTalk.newsAreas.v1";
const DEFAULT_NEWS_AREAS: NewsArea[] = ["technology", "culture"];
const EMPTY_CAREER: CareerProfile = {
  direction: "",
  targetRole: "",
  timeline: "",
  bragDoc: "",
  needs: [],
};

type OpenDialog = "add" | "edit" | "log" | null;

type Toast = { message: string; href?: string };

type WorkspacePanel = "overview" | "small-talk" | "career";

function readStoredNewsAreas(): NewsArea[] {
  if (typeof window === "undefined") return DEFAULT_NEWS_AREAS;
  try {
    const raw = window.localStorage.getItem(NEWS_AREAS_STORAGE_KEY);
    if (!raw) return DEFAULT_NEWS_AREAS;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return DEFAULT_NEWS_AREAS;
    const areas = parsed.filter(
      (value): value is NewsArea =>
        typeof value === "string" &&
        [
          "technology",
          "business",
          "culture",
          "science",
          "sports",
          "world",
        ].includes(value),
    );
    return areas.length > 0 ? areas : DEFAULT_NEWS_AREAS;
  } catch {
    return DEFAULT_NEWS_AREAS;
  }
}

export function OneOnOneApp({
  userId,
  userEmail,
  initialSnapshot,
  justUpgraded = false,
}: {
  userId: string;
  userEmail?: string;
  initialSnapshot: WorkspaceSnapshot | null;
  justUpgraded?: boolean;
}) {
  const { locale, setLocale, t, ready: localeReady } = useLocale();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const notesTimeouts = useRef(new Map<string, number>());
  const contextSaveTimeout = useRef<number | null>(null);
  const [people, setPeople] = useState<Person[]>(
    () => initialSnapshot?.people ?? [],
  );
  const [activePersonId, setActivePersonId] = useState<string | null>(null);
  const [panel, setPanel] = useState<WorkspacePanel>("overview");
  const [filter, setFilter] = useState<PeopleFilter>("all");
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [editingDiscussionId, setEditingDiscussionId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(initialSnapshot === null);
  const [loadError, setLoadError] = useState(false);
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [generatingPersonId, setGeneratingPersonId] = useState<string | null>(
    null,
  );
  const [prepMeta, setPrepMeta] = useState<PrepMetaByPerson>(
    () => initialSnapshot?.prepMeta ?? {},
  );
  const [contextBank, setContextBank] = useState(
    () => initialSnapshot?.contextBank ?? "",
  );
  const [contextSaved, setContextSaved] = useState(true);
  const [generalPrep, setGeneralPrep] = useState<GeneralPrep>(
    () =>
      initialSnapshot?.generalPrep ?? {
        opening: "",
        ideas: [],
        source: null,
      },
  );
  const [generatingGeneral, setGeneratingGeneral] = useState(false);
  const [newsAreas, setNewsAreas] = useState<NewsArea[]>(DEFAULT_NEWS_AREAS);
  const [plan, setPlan] = useState<Plan>(() => initialSnapshot?.plan ?? "free");
  const [prepQuota, setPrepQuota] = useState<PrepQuota>(
    () => initialSnapshot?.prepQuota ?? { used: 0, limit: 10 },
  );
  const [career, setCareer] = useState<CareerProfile>(
    () => initialSnapshot?.career ?? EMPTY_CAREER,
  );
  const [meetingIntent, setMeetingIntent] =
    useState<MeetingIntent>("catch-up");
  const [refiningPersonId, setRefiningPersonId] = useState<string | null>(
    null,
  );
  const [whoToAskSuggestions, setWhoToAskSuggestions] = useState<
    WhoToAskSuggestion[]
  >([]);
  const [whoToAskSource, setWhoToAskSource] = useState<
    "ai" | "starter" | null
  >(null);
  const [routingNeed, setRoutingNeed] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setNewsAreas(readStoredNewsAreas());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  // Apply the server-loaded snapshot once locale detection has finished so
  // the synced preference wins over the local fallback. When there is no
  // snapshot, load in the browser with retries to ride out session settling
  // right after sign-in.
  const snapshotApplied = useRef(false);

  useEffect(() => {
    if (initialSnapshot) {
      if (!localeReady || snapshotApplied.current) return;
      snapshotApplied.current = true;
      setCareer(initialSnapshot.career);
      if (initialSnapshot.locale) setLocale(initialSnapshot.locale);
      setPreferencesReady(true);
      return;
    }

    let cancelled = false;

    async function loadWithRetry() {
      const delays = [0, 500, 1500];
      for (const delay of delays) {
        if (cancelled) return;
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        try {
          await supabase.auth.getSession();
          const snapshot = await loadWorkspace(supabase);
          if (cancelled) return;
          setPeople(snapshot.people);
          setPrepMeta(snapshot.prepMeta);
          setContextBank(snapshot.contextBank);
          setGeneralPrep(snapshot.generalPrep);
          setCareer(snapshot.career);
          setPlan(snapshot.plan);
          setPrepQuota(snapshot.prepQuota);
          if (snapshot.locale) setLocale(snapshot.locale);
          setPreferencesReady(true);
          setLoadError(false);
          setLoading(false);
          return;
        } catch {
          // Session may still be settling right after sign-in; retry.
        }
      }
      if (!cancelled) {
        setLoadError(true);
        setLoading(false);
      }
    }

    void loadWithRetry();

    return () => {
      cancelled = true;
    };
  }, [initialSnapshot, localeReady, setLocale, supabase]);

  useEffect(() => {
    if (!preferencesReady || !localeReady) return;
    void saveLocale(supabase, userId, locale).catch(() => {
      showToast(t.toast.saveFailed);
    });
  }, [locale, preferencesReady, localeReady, supabase, t.toast.saveFailed, userId]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4_200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(
    () => () => {
      notesTimeouts.current.forEach((timeout) => window.clearTimeout(timeout));
      notesTimeouts.current.clear();
      if (contextSaveTimeout.current !== null) {
        window.clearTimeout(contextSaveTimeout.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!justUpgraded) return;
    showToast(t.toast.upgraded);
    router.replace("/workspace");
  }, [justUpgraded, router, t.toast.upgraded]);

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

  function showToast(message: string, href?: string) {
    setToast({ message, href });
  }

  function cancelPendingNotesSave(personId: string) {
    const timeout = notesTimeouts.current.get(personId);
    if (timeout !== undefined) window.clearTimeout(timeout);
    notesTimeouts.current.delete(personId);
  }

  function cancelPendingContextSave() {
    if (contextSaveTimeout.current !== null) {
      window.clearTimeout(contextSaveTimeout.current);
      contextSaveTimeout.current = null;
    }
  }

  function updateContextBank(value: string) {
    setContextBank(value);
    setContextSaved(false);
    cancelPendingContextSave();

    contextSaveTimeout.current = window.setTimeout(() => {
      contextSaveTimeout.current = null;
      void saveContextBank(supabase, userId, value)
        .then(() => setContextSaved(true))
        .catch(() => showToast(t.toast.saveFailed));
    }, 600);
  }

  function updateNotes(personId: string, notes: string) {
    updatePerson(personId, { notes });
    cancelPendingNotesSave(personId);

    const timeout = window.setTimeout(() => {
      notesTimeouts.current.delete(personId);
      void savePersonFields(supabase, personId, { notes }).catch(() => {
        showToast(t.toast.saveFailed);
      });
    }, 500);

    notesTimeouts.current.set(personId, timeout);
  }

  async function clearNotes(person: Person) {
    cancelPendingNotesSave(person.id);
    updatePerson(person.id, { notes: "" });
    try {
      await savePersonFields(supabase, person.id, { notes: "" });
      showToast(t.toast.notesCleared);
    } catch {
      updatePerson(person.id, { notes: person.notes });
      showToast(t.toast.saveFailed);
    }
  }

  async function archiveNotes(person: Person) {
    const notes = person.notes.trim();
    if (!notes) return;
    cancelPendingNotesSave(person.id);
    updatePerson(person.id, { notes: "", lastNotes: notes });
    try {
      await savePersonFields(supabase, person.id, {
        notes: "",
        lastNotes: notes,
      });
      showToast(t.toast.notesArchived);
    } catch {
      updatePerson(person.id, {
        notes: person.notes,
        lastNotes: person.lastNotes,
      });
      showToast(t.toast.saveFailed);
    }
  }

  async function restoreLastNotes(person: Person) {
    const lastNotes = person.lastNotes.trim();
    if (!lastNotes) return;
    const notes = person.notes.trim()
      ? `${person.notes.trim()}\n${lastNotes}`
      : lastNotes;
    cancelPendingNotesSave(person.id);
    updatePerson(person.id, { notes });
    try {
      await savePersonFields(supabase, person.id, { notes });
      showToast(t.toast.addedToNotes);
    } catch {
      updatePerson(person.id, { notes: person.notes });
      showToast(t.toast.saveFailed);
    }
  }

  async function generatePrep(person: Person) {
    setGeneratingPersonId(person.id);

    try {
      const response = await fetch("/api/prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          personId: person.id,
          intent: meetingIntent,
          person: personPayload(person),
        }),
      });

      if (response.status === 402) {
        showToast(t.toast.upgradePrep, "/pricing");
        return;
      }

      if (!response.ok) {
        throw new Error("Preparation request failed");
      }

      const result = (await response.json()) as PrepResponse;
      await replacePrepIdeas(supabase, userId, person.id, result);
      updatePerson(person.id, { prepIdeas: result.ideas });
      setPrepMeta((current) => ({
        ...current,
        [person.id]: {
          opening: result.opening,
          source: result.source,
        },
      }));
      if (result.source === "ai") {
        setPrepQuota((current) =>
          current.limit == null
            ? current
            : { ...current, used: current.used + 1 },
        );
      } else {
        void loadPrepQuota(supabase, plan).then(setPrepQuota).catch(() => {});
      }
      showToast(
        result.source === "ai" ? t.toast.aiReady : t.toast.starterReady,
      );
    } catch {
      showToast(t.toast.prepFailed);
    } finally {
      setGeneratingPersonId(null);
    }
  }

  async function refinePrep(person: Person, mode: PrepRefineMode) {
    setRefiningPersonId(person.id);

    try {
      const response = await fetch("/api/prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "refine",
          refine: mode,
          locale,
          personId: person.id,
          person: personPayload(person),
          existing: {
            opening: prepMeta[person.id]?.opening ?? "",
            ideas: person.prepIdeas,
          },
        }),
      });

      if (response.status === 402) {
        showToast(t.toast.upgradePrep, "/pricing");
        return;
      }

      if (!response.ok) {
        throw new Error("Refine request failed");
      }

      const result = (await response.json()) as PrepResponse;
      await replacePrepIdeas(supabase, userId, person.id, result);
      updatePerson(person.id, { prepIdeas: result.ideas });
      setPrepMeta((current) => ({
        ...current,
        [person.id]: {
          opening: result.opening,
          source: result.source,
        },
      }));
      showToast(t.toast.refined);
    } catch {
      showToast(t.toast.prepFailed);
    } finally {
      setRefiningPersonId(null);
    }
  }

  async function generateGeneralPrep() {
    setGeneratingGeneral(true);
    cancelPendingContextSave();

    try {
      await saveContextBank(supabase, userId, contextBank);
      setContextSaved(true);

      const response = await fetch("/api/prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "general",
          locale,
          newsAreas,
        }),
      });

      if (response.status === 402) {
        showToast(t.toast.upgradePrep, "/pricing");
        return;
      }

      if (!response.ok) {
        throw new Error("Small-talk preparation request failed");
      }

      const result = (await response.json()) as PrepResponse;
      await replaceGeneralPrepIdeas(supabase, userId, result);
      setGeneralPrep({
        opening: result.opening,
        ideas: result.ideas,
        source: result.source,
      });
      if (result.source === "ai") {
        setPrepQuota((current) =>
          current.limit == null
            ? current
            : { ...current, used: current.used + 1 },
        );
      } else {
        void loadPrepQuota(supabase, plan).then(setPrepQuota).catch(() => {});
      }
      showToast(
        result.source === "ai" ? t.toast.aiReady : t.toast.starterReady,
      );
    } catch {
      showToast(t.toast.prepFailed);
    } finally {
      setGeneratingGeneral(false);
    }
  }

  function updateNewsAreas(areas: NewsArea[]) {
    setNewsAreas(areas);
    try {
      window.localStorage.setItem(NEWS_AREAS_STORAGE_KEY, JSON.stringify(areas));
    } catch {
      // ignore storage errors
    }
  }

  function goToOverview() {
    setActivePersonId(null);
    setPanel("overview");
  }

  function goToSmallTalk() {
    setActivePersonId(null);
    setPanel("small-talk");
  }

  function goToCareer() {
    setActivePersonId(null);
    setPanel("career");
  }

  function goToPerson(id: string) {
    setActivePersonId(id);
    setPanel("overview");
  }

  function personPayload(person: Person) {
    return {
      name: person.name,
      role: person.role,
      organization: person.organization,
      relationship: person.relationship,
      notes: person.notes,
      background: person.background,
      linkedinUrl: person.linkedinUrl,
      lastMeetingAt: person.lastMeetingAt || null,
      discussions: person.discussions
        .toSorted(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )
        .map((discussion) => ({
          date: discussion.date,
          title: discussion.title,
          summary: discussion.summary,
          topics: discussion.topics,
          followUps: discussion.followUps,
          mood: discussion.mood,
        })),
    };
  }

  async function addIdeaToNotes(person: Person, idea: PrepIdea) {
    const note = `${idea.title} — ${idea.prompt}`;
    const existing = person.notes
      .split("\n")
      .map((line) => line.trim().toLowerCase());

    if (existing.includes(note.toLowerCase())) {
      showToast(t.toast.alreadyInNotes);
      return;
    }

    const notes = person.notes.trim()
      ? `${person.notes.trim()}\n${note}`
      : note;
    cancelPendingNotesSave(person.id);
    updatePerson(person.id, { notes });

    try {
      await savePersonFields(supabase, person.id, { notes });
      showToast(t.toast.addedToNotes);
    } catch {
      updatePerson(person.id, { notes: person.notes });
      showToast(t.toast.saveFailed);
    }
  }

  async function addPerson(input: NewPersonInput) {
    try {
      const person = await createPerson(
        supabase,
        userId,
        input,
        COLORS[people.length % COLORS.length],
        people.length,
      );
      setPeople((current) => [...current, person]);
      setDialog(null);
      goToPerson(person.id);
      showToast(t.toast.personAdded(input.name));
    } catch (addError) {
      if (addError instanceof PlanLimitError) {
        showToast(t.toast.upgradePeople, "/pricing");
      } else {
        showToast(t.toast.saveFailed);
      }
    }
  }

  async function editPerson(person: Person, input: NewPersonInput) {
    cancelPendingNotesSave(person.id);

    try {
      await savePersonFields(supabase, person.id, {
        name: input.name,
        role: input.role,
        organization: input.organization,
        relationship: input.relationship,
        notes: input.notes,
        background: input.background,
        linkedinUrl: input.linkedinUrl,
        avatarEmoji: input.avatarEmoji,
      });
      updatePerson(person.id, input);
      setDialog(null);
      showToast(t.toast.personUpdated(input.name));
    } catch {
      showToast(t.toast.saveFailed);
    }
  }

  async function removePerson(person: Person) {
    cancelPendingNotesSave(person.id);
    try {
      await deletePerson(supabase, person.id);
      setPeople((current) => current.filter((item) => item.id !== person.id));
      setPrepMeta((current) => {
        const next = { ...current };
        delete next[person.id];
        return next;
      });
      setActivePersonId(null);
      setPanel("overview");
      setDialog(null);
      showToast(t.toast.personRemoved(person.name));
    } catch {
      showToast(t.toast.saveFailed);
    }
  }

  async function logDiscussion(
    person: Person,
    input: NewDiscussionInput,
  ) {
    try {
      const discussion = await createDiscussion(
        supabase,
        userId,
        person.id,
        input,
      );
      updatePerson(person.id, (current) => ({
        discussions: [discussion, ...current.discussions].toSorted(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
        lastMeetingAt: input.date,
      }));
      setEditingDiscussionId(null);
      setDialog(null);
      showToast(t.toast.conversationSaved);

      const credited = await grantPrepCreditForLogging(supabase, userId, plan);
      if (credited) {
        setPrepQuota((current) => ({
          ...current,
          used: Math.max(0, current.used - 1),
        }));
        showToast(t.toast.prepCreditEarned);
      }
    } catch {
      showToast(t.toast.saveFailed);
    }
  }

  async function editDiscussion(
    person: Person,
    discussionId: string,
    input: NewDiscussionInput,
  ) {
    try {
      const nextDiscussions = await updateDiscussion(
        supabase,
        person.id,
        discussionId,
        input,
        person.discussions,
      );
      updatePerson(person.id, {
        discussions: nextDiscussions,
        lastMeetingAt: nextDiscussions[0]?.date ?? "",
      });
      setEditingDiscussionId(null);
      setDialog(null);
      showToast(t.toast.conversationUpdated);
    } catch {
      showToast(t.toast.saveFailed);
    }
  }

  function openLogMeeting() {
    setEditingDiscussionId(null);
    setDialog("log");
  }

  function openEditMeeting(discussionId: string) {
    setEditingDiscussionId(discussionId);
    setDialog("log");
  }

  async function routeCareerNeed(need: string) {
    setRoutingNeed(true);
    try {
      const response = await fetch("/api/prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "who-to-ask",
          locale,
          need,
          people: people.map((person) => ({
            id: person.id,
            name: person.name,
            role: person.role,
            organization: person.organization,
            relationship: person.relationship,
            notes: person.notes,
            background: person.background,
            lastMeetingAt: person.lastMeetingAt || null,
            recentTopics: person.discussions
              .flatMap((discussion) => discussion.topics)
              .slice(0, 12),
            recentFollowUps: person.discussions
              .flatMap((discussion) => discussion.followUps)
              .slice(0, 12),
          })),
        }),
      });

      if (response.status === 402) {
        showToast(t.toast.upgradePrep, "/pricing");
        return;
      }

      if (!response.ok) {
        throw new Error("Who-to-ask request failed");
      }

      const result = (await response.json()) as WhoToAskResponse;
      setWhoToAskSuggestions(result.suggestions);
      setWhoToAskSource(result.source);
      if (result.source === "ai") {
        setPrepQuota((current) =>
          current.limit == null
            ? current
            : { ...current, used: current.used + 1 },
        );
      }
    } catch {
      showToast(t.toast.prepFailed);
    } finally {
      setRoutingNeed(false);
    }
  }

  function prepareWithPerson(personId: string, ask: string) {
    const person = people.find((item) => item.id === personId);
    if (!person) return;
    const notes = person.notes.trim()
      ? `${person.notes.trim()}\n${ask}`
      : ask;
    updateNotes(personId, notes);
    setMeetingIntent("career");
    goToPerson(personId);
  }

  function prepWithRelationship(relationship: "manager" | "mentor") {
    const person = people.find((item) => item.relationship === relationship);
    if (!person) return;
    setMeetingIntent("career");
    goToPerson(person.id);
  }

  async function removePrepIdea(person: Person, ideaId: string) {
    try {
      await dismissPrepIdea(supabase, ideaId);
      updatePerson(person.id, (current) => ({
        prepIdeas: current.prepIdeas.filter((idea) => idea.id !== ideaId),
      }));
    } catch {
      showToast(t.toast.saveFailed);
    }
  }

  async function removeGeneralPrepIdea(ideaId: string) {
    try {
      await dismissPrepIdea(supabase, ideaId);
      setGeneralPrep((current) => ({
        ...current,
        ideas: current.ideas.filter((idea) => idea.id !== ideaId),
      }));
    } catch {
      showToast(t.toast.saveFailed);
    }
  }

  if (loading) {
    return <WorkspaceStatus message={t.common.loadingWorkspace} loading />;
  }

  if (loadError) {
    return (
      <WorkspaceStatus
        message={t.common.workspaceLoadFailed}
        actionLabel={t.common.tryAgain}
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="relative isolate flex h-dvh overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_0%,color-mix(in_srgb,var(--accent)_7%,transparent),transparent_28%),radial-gradient(circle_at_88%_8%,color-mix(in_srgb,var(--secondary)_8%,transparent),transparent_26%)]" />
      <AppSidebar
        people={people}
        userEmail={userEmail}
        activePersonId={activePersonId}
        panel={panel}
        filter={filter}
        search={search}
        onSearchChange={setSearch}
        onSelectOverview={goToOverview}
        onSelectSmallTalk={goToSmallTalk}
        onSelectCareer={goToCareer}
        onSelectPerson={goToPerson}
        onFilterChange={setFilter}
        onAddPerson={() => setDialog("add")}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader
          onOverview={goToOverview}
        />

        {selectedPerson ? (
          <PersonDetail
            key={selectedPerson.id}
            person={selectedPerson}
            prepMeta={prepMeta[selectedPerson.id]}
            isGenerating={generatingPersonId === selectedPerson.id}
            isRefining={refiningPersonId === selectedPerson.id}
            intent={meetingIntent}
            onIntentChange={setMeetingIntent}
            onBack={goToOverview}
            onEditPerson={() => setDialog("edit")}
            onNotesChange={(notes) => updateNotes(selectedPerson.id, notes)}
            onClearNotes={() => void clearNotes(selectedPerson)}
            onArchiveNotes={() => void archiveNotes(selectedPerson)}
            onRestoreLastNotes={() => void restoreLastNotes(selectedPerson)}
            onGeneratePrep={() => generatePrep(selectedPerson)}
            onRefinePrep={(mode) => void refinePrep(selectedPerson, mode)}
            onAddIdeaToNotes={(idea) =>
              void addIdeaToNotes(selectedPerson, idea)
            }
            onDismissIdea={(ideaId) =>
              void removePrepIdea(selectedPerson, ideaId)
            }
            onLogMeeting={openLogMeeting}
            onEditMeeting={openEditMeeting}
            onAgendaCopied={() => showToast(t.toast.agendaCopied)}
          />
        ) : panel === "small-talk" ? (
          <SmallTalkPage
            contextBank={contextBank}
            contextSaved={contextSaved}
            generalPrep={generalPrep}
            prepQuota={prepQuota}
            newsAreas={newsAreas}
            isGenerating={generatingGeneral}
            onBack={goToOverview}
            onContextBankChange={updateContextBank}
            onNewsAreasChange={updateNewsAreas}
            onGenerate={() => void generateGeneralPrep()}
            onDismissIdea={(ideaId) => void removeGeneralPrepIdea(ideaId)}
          />
        ) : panel === "career" ? (
          <CareerPage
            career={career}
            people={people}
            isRouting={routingNeed}
            suggestions={whoToAskSuggestions}
            routeSource={whoToAskSource}
            onBack={goToOverview}
            onSaveProfile={async (profile) => {
              await saveCareerProfile(supabase, userId, profile);
              setCareer((current) => ({ ...current, ...profile }));
              showToast(t.toast.careerSaved);
            }}
            onAddNeed={async (body) => {
              const need = await createCareerNeed(supabase, userId, body);
              setCareer((current) => ({
                ...current,
                needs: [need, ...current.needs],
              }));
              showToast(t.toast.needAdded);
            }}
            onUpdateNeedStatus={async (id, status: CareerNeedStatus) => {
              await updateCareerNeedStatus(supabase, id, status);
              setCareer((current) => ({
                ...current,
                needs: current.needs.map((need) =>
                  need.id === id ? { ...need, status } : need,
                ),
              }));
            }}
            onDeleteNeed={async (id) => {
              await deleteCareerNeed(supabase, id);
              setCareer((current) => ({
                ...current,
                needs: current.needs.filter((need) => need.id !== id),
              }));
            }}
            onRouteNeed={routeCareerNeed}
            onPrepareWith={prepareWithPerson}
            onPrepManager={() => prepWithRelationship("manager")}
            onPrepMentor={() => prepWithRelationship("mentor")}
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
              contextBank={contextBank}
              contextSaved={contextSaved}
              generalPrep={generalPrep}
              onSelectPerson={goToPerson}
              onAddPerson={() => setDialog("add")}
              onOpenSmallTalk={goToSmallTalk}
              onContextBankChange={updateContextBank}
            />
          </>
        )}
      </div>

      <MobileNavigation
        activePersonId={activePersonId}
        panel={panel}
        onOverview={goToOverview}
        onSmallTalk={goToSmallTalk}
        onAddPerson={() => setDialog("add")}
        onCareer={goToCareer}
      />

      {dialog === "add" ? (
        <AddPersonDialog onClose={() => setDialog(null)} onSubmit={addPerson} />
      ) : null}
      {dialog === "edit" && selectedPerson ? (
        <EditPersonDialog
          person={{
            name: selectedPerson.name,
            role: selectedPerson.role,
            organization: selectedPerson.organization,
            relationship: selectedPerson.relationship,
            notes: selectedPerson.notes,
            background: selectedPerson.background,
            linkedinUrl: selectedPerson.linkedinUrl,
            avatarEmoji:
              selectedPerson.avatarEmoji ??
              pickDefaultEmoji(selectedPerson.name),
          }}
          color={selectedPerson.color}
          onClose={() => setDialog(null)}
          onSubmit={(input) => editPerson(selectedPerson, input)}
          onDelete={() => void removePerson(selectedPerson)}
        />
      ) : null}
      {dialog === "log" && selectedPerson ? (
        <LogMeetingDialog
          personName={selectedPerson.name}
          discussion={
            editingDiscussionId
              ? selectedPerson.discussions.find(
                  (item) => item.id === editingDiscussionId,
                )
              : undefined
          }
          onClose={() => {
            setEditingDiscussionId(null);
            setDialog(null);
          }}
          onSubmit={(discussion) => {
            if (editingDiscussionId) {
              void editDiscussion(
                selectedPerson,
                editingDiscussionId,
                discussion,
              );
              return;
            }
            void logDiscussion(selectedPerson, discussion);
          }}
        />
      ) : null}

      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] left-1/2 z-[60] -translate-x-1/2 rounded-full bg-foreground p-1 text-center text-xs font-medium text-background shadow-[0_12px_36px_rgb(var(--shadow-color)/0.24)] sm:left-auto sm:right-6 sm:translate-x-0 lg:bottom-6"
        >
          {toast.href ? (
            <Link
              href={toast.href}
              className="rounded-full px-3 py-1.5 transition-colors hover:bg-background/10"
            >
              {toast.message}
            </Link>
          ) : (
            <span className="block px-3 py-1.5">{toast.message}</span>
          )}
        </div>
      ) : null}
    </div>
  );
}

function WorkspaceStatus({
  message,
  loading = false,
  actionLabel,
  onAction,
}: {
  message: string;
  loading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <main
      id="main-content"
      className="grid min-h-screen place-items-center bg-background px-6 text-foreground"
    >
      <div className="text-center">
        {loading ? (
          <LoaderCircle
            aria-hidden="true"
            className="mx-auto size-6 animate-spin text-muted"
          />
        ) : (
          <span className="mx-auto block size-2 rounded-full bg-[#d26a4c]" />
        )}
        <p className="mt-4 text-sm font-medium text-muted">{message}</p>
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="mt-5 h-9 rounded-xl bg-accent px-4 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </main>
  );
}

function MobileHeader({
  onOverview,
}: {
  onOverview: () => void;
}) {
  const { t } = useLocale();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-xl lg:hidden">
      <button
        type="button"
        onClick={onOverview}
        className="flex items-center gap-2.5 rounded-lg"
      >
        <BrandLogo size={32} className="rounded-[10px]" />
        <span className="text-sm font-semibold tracking-[-0.02em]">
          {t.common.brand}
        </span>
      </button>
      <div className="flex items-center gap-1">
        <ThemeToggle compact />
        <LanguageToggle compact />
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
    <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-border px-5 py-3 lg:hidden">
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
            "h-8 shrink-0 rounded-full px-3 text-[11px] font-semibold transition-colors",
            filter === id
              ? "bg-foreground text-background"
              : "bg-surface-muted text-muted hover:text-foreground",
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
  panel,
  onOverview,
  onSmallTalk,
  onAddPerson,
  onCareer,
}: {
  activePersonId: string | null;
  panel: WorkspacePanel;
  onOverview: () => void;
  onSmallTalk: () => void;
  onAddPerson: () => void;
  onCareer: () => void;
}) {
  const { t } = useLocale();
  const overviewActive = activePersonId === null && panel === "overview";

  return (
    <nav
      aria-label={t.sidebar.primaryNav}
      className="fixed inset-x-0 bottom-0 z-40 grid min-h-[68px] grid-cols-5 border-t border-border bg-background/92 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <button
        type="button"
        onClick={onOverview}
        className={cn(
          "flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl text-[9px] font-medium transition-colors",
          overviewActive ? "text-accent" : "text-muted",
        )}
        aria-current={overviewActive ? "page" : undefined}
      >
        <House className="size-[18px]" strokeWidth={1.8} />
        {t.mobile.overview}
      </button>
      <button
        type="button"
        onClick={onSmallTalk}
        className={cn(
          "flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl text-[9px] font-medium transition-colors",
          activePersonId === null && panel === "small-talk"
            ? "text-accent"
            : "text-muted",
        )}
        aria-current={
          activePersonId === null && panel === "small-talk" ? "page" : undefined
        }
      >
        <MessageCircle className="size-[18px]" strokeWidth={1.8} />
        {t.mobile.smallTalk}
      </button>
      <button
        type="button"
        onClick={onAddPerson}
        className="flex min-h-16 flex-col items-center justify-center gap-0.5 rounded-xl text-[9px] font-medium text-muted"
        aria-label={t.common.addPerson}
      >
        <span className="-mt-3 grid size-10 place-items-center rounded-full bg-accent text-accent-foreground shadow-[0_8px_22px_rgb(var(--shadow-color)/0.2)]">
          <UserRoundPlus className="size-4" />
        </span>
        {t.mobile.add}
      </button>
      <button
        type="button"
        onClick={onCareer}
        className={cn(
          "flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl text-[9px] font-medium transition-colors",
          activePersonId === null && panel === "career"
            ? "text-accent"
            : "text-muted",
        )}
        aria-current={
          activePersonId === null && panel === "career" ? "page" : undefined
        }
      >
        <Target className="size-[18px]" strokeWidth={1.8} />
        {t.mobile.career}
      </button>
      <Link
        href="/account"
        className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl text-[9px] font-medium text-muted transition-colors hover:text-foreground"
      >
        <Settings2 className="size-[18px]" strokeWidth={1.8} />
        {t.mobile.account}
      </Link>
    </nav>
  );
}
