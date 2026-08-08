"use client";

import {
  CalendarDays,
  Database,
  MessageSquareText,
  RotateCcw,
  Sparkles,
  UserRoundPlus,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { LanguageToggle } from "@/components/language-toggle";
import { useLocale } from "@/lib/i18n";
import type {
  Cadence,
  DiscussionMood,
  Relationship,
} from "@/lib/types";
import { toDateTimeLocal } from "@/lib/utils";

export interface NewPersonInput {
  name: string;
  role: string;
  organization: string;
  relationship: Relationship;
  cadence: Cadence;
  nextMeetingAt: string;
  notes: string;
}

export interface NewDiscussionInput {
  title: string;
  date: string;
  summary: string;
  topics: string[];
  followUps: string[];
  mood: DiscussionMood;
}

function DialogFrame({
  title,
  description,
  icon,
  onClose,
  children,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  onClose: () => void;
  children: ReactNode;
}) {
  const { t } = useLocale();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/35 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="max-h-[92dvh] w-full overflow-y-auto rounded-t-[26px] border border-white/70 bg-[#fdfcfb] shadow-[0_30px_80px_rgba(28,25,23,0.22)] sm:max-w-[560px] sm:rounded-[26px]"
      >
        <div className="flex items-start gap-3 border-b border-stone-200/80 px-5 py-5 sm:px-6">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-stone-900 text-white">
            {icon}
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id="dialog-title"
              className="text-base font-semibold tracking-[-0.02em] text-stone-900"
            >
              {title}
            </h2>
            <p className="mt-1 text-xs leading-5 text-stone-500">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 shrink-0 place-items-center rounded-lg text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            aria-label={t.common.closeDialog}
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const fieldClassName =
  "mt-1.5 h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-300 focus:border-stone-300 focus:ring-4 focus:ring-stone-900/[0.04]";
const textareaClassName =
  "mt-1.5 w-full resize-none rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm leading-5 text-stone-800 outline-none transition placeholder:text-stone-300 focus:border-stone-300 focus:ring-4 focus:ring-stone-900/[0.04]";
const labelClassName = "block text-[11px] font-semibold text-stone-600";

export function AddPersonDialog({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (person: NewPersonInput) => void;
}) {
  const { t } = useLocale();
  const [relationship, setRelationship] = useState<Relationship>("peer");
  const [cadence, setCadence] = useState<Cadence>("Every 2 weeks");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextMeetingAt = String(formData.get("nextMeetingAt"));

    onSubmit({
      name: String(formData.get("name")).trim(),
      role: String(formData.get("role")).trim(),
      organization: String(formData.get("organization")).trim(),
      relationship,
      cadence,
      nextMeetingAt: new Date(nextMeetingAt).toISOString(),
      notes: String(formData.get("notes")).trim(),
    });
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  return (
    <DialogFrame
      title={t.dialogs.addTitle}
      description={t.dialogs.addDescription}
      icon={<UserRoundPlus className="size-4" />}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
          <label className={labelClassName}>
            {t.dialogs.name}
            <input
              name="name"
              required
              autoFocus
              placeholder={t.dialogs.namePlaceholder}
              className={fieldClassName}
            />
          </label>
          <label className={labelClassName}>
            {t.dialogs.relationship}
            <select
              name="relationship"
              value={relationship}
              onChange={(event) =>
                setRelationship(event.target.value as Relationship)
              }
              className={fieldClassName}
            >
              <option value="manager">{t.relationship.manager}</option>
              <option value="direct-report">
                {t.relationship["direct-report"]}
              </option>
              <option value="peer">{t.relationship.peer}</option>
              <option value="mentor">{t.relationship.mentor}</option>
              <option value="friend">{t.relationship.friend}</option>
            </select>
          </label>
          <label className={labelClassName}>
            {t.dialogs.role}
            <input
              name="role"
              placeholder={
                relationship === "friend"
                  ? t.dialogs.rolePlaceholderFriend
                  : t.dialogs.rolePlaceholderWork
              }
              className={fieldClassName}
            />
          </label>
          <label className={labelClassName}>
            {t.dialogs.organization}
            <input
              name="organization"
              placeholder={
                relationship === "friend"
                  ? t.dialogs.orgPlaceholderFriend
                  : t.dialogs.orgPlaceholderWork
              }
              className={fieldClassName}
            />
          </label>
          <label className={labelClassName}>
            {t.dialogs.cadence}
            <select
              name="cadence"
              value={cadence}
              onChange={(event) =>
                setCadence(event.target.value as Cadence)
              }
              className={fieldClassName}
            >
              <option value="Weekly">{t.cadence.Weekly}</option>
              <option value="Every 2 weeks">{t.cadence["Every 2 weeks"]}</option>
              <option value="Monthly">{t.cadence.Monthly}</option>
              <option value="Quarterly">{t.cadence.Quarterly}</option>
              <option value="Flexible">{t.cadence.Flexible}</option>
            </select>
          </label>
          <label className={labelClassName}>
            {t.dialogs.nextConversation}
            <input
              name="nextMeetingAt"
              type="datetime-local"
              required
              defaultValue={toDateTimeLocal(tomorrow.toISOString())}
              className={fieldClassName}
            />
          </label>
          <label className={`${labelClassName} sm:col-span-2`}>
            {t.dialogs.notesForNext}
            <textarea
              name="notes"
              rows={3}
              placeholder={t.dialogs.notesPlaceholder}
              className={textareaClassName}
            />
          </label>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-stone-200/80 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl px-4 text-xs font-semibold text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
          >
            {t.common.cancel}
          </button>
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-stone-900 px-4 text-xs font-semibold text-white transition hover:bg-stone-800"
          >
            <UserRoundPlus className="size-3.5" />
            {t.common.addPerson}
          </button>
        </div>
      </form>
    </DialogFrame>
  );
}

export function LogMeetingDialog({
  personName,
  onClose,
  onSubmit,
}: {
  personName: string;
  onClose: () => void;
  onSubmit: (discussion: NewDiscussionInput) => void;
}) {
  const { t } = useLocale();
  const [mood, setMood] = useState<DiscussionMood>("positive");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const splitList = (name: string) =>
      String(formData.get(name))
        .split(/\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);

    onSubmit({
      title: String(formData.get("title")).trim(),
      date: new Date(String(formData.get("date"))).toISOString(),
      summary: String(formData.get("summary")).trim(),
      topics: splitList("topics"),
      followUps: splitList("followUps"),
      mood,
    });
  }

  return (
    <DialogFrame
      title={t.dialogs.logTitle(personName.split(" ")[0])}
      description={t.dialogs.logDescription}
      icon={<MessageSquareText className="size-4" />}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
          <label className={`${labelClassName} sm:col-span-2`}>
            {t.dialogs.conversationTitle}
            <input
              name="title"
              required
              autoFocus
              placeholder={t.dialogs.conversationPlaceholder}
              className={fieldClassName}
            />
          </label>
          <label className={labelClassName}>
            {t.dialogs.dateAndTime}
            <input
              name="date"
              type="datetime-local"
              required
              defaultValue={toDateTimeLocal(new Date().toISOString())}
              className={fieldClassName}
            />
          </label>
          <label className={labelClassName}>
            {t.dialogs.howDidItFeel}
            <select
              name="mood"
              value={mood}
              onChange={(event) =>
                setMood(event.target.value as DiscussionMood)
              }
              className={fieldClassName}
            >
              <option value="energized">{t.mood.energized}</option>
              <option value="positive">{t.mood.positive}</option>
              <option value="neutral">{t.mood.neutral}</option>
              <option value="tough">{t.mood.tough}</option>
            </select>
          </label>
          <label className={`${labelClassName} sm:col-span-2`}>
            {t.dialogs.summary}
            <textarea
              name="summary"
              required
              rows={4}
              placeholder={t.dialogs.summaryPlaceholder}
              className={textareaClassName}
            />
          </label>
          <label className={labelClassName}>
            {t.dialogs.topics}
            <textarea
              name="topics"
              rows={3}
              placeholder={t.dialogs.topicsPlaceholder}
              className={textareaClassName}
            />
          </label>
          <label className={labelClassName}>
            {t.dialogs.followUps}
            <textarea
              name="followUps"
              rows={3}
              placeholder={t.dialogs.followUpsPlaceholder}
              className={textareaClassName}
            />
          </label>
        </div>
        <div className="flex items-center justify-between border-t border-stone-200/80 px-5 py-4 sm:px-6">
          <p className="hidden items-center gap-1.5 text-[10px] text-stone-400 sm:flex">
            <CalendarDays className="size-3" />
            {t.dialogs.nextAdvances}
          </p>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-xl px-4 text-xs font-semibold text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-stone-900 px-4 text-xs font-semibold text-white transition hover:bg-stone-800"
            >
              <MessageSquareText className="size-3.5" />
              {t.dialogs.saveConversation}
            </button>
          </div>
        </div>
      </form>
    </DialogFrame>
  );
}

export function SettingsDialog({
  onClose,
  onReset,
}: {
  onClose: () => void;
  onReset: () => void;
}) {
  const { t } = useLocale();

  return (
    <DialogFrame
      title={t.dialogs.settingsTitle}
      description={t.dialogs.settingsDescription}
      icon={<Database className="size-4" />}
      onClose={onClose}
    >
      <div className="space-y-3 px-5 py-5 sm:px-6">
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-stone-800">
                {t.common.language}
              </p>
            </div>
            <LanguageToggle />
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600">
              <Sparkles className="size-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-stone-800">
                {t.dialogs.aiPrepTitle}
              </p>
              <p className="mt-1 text-[11px] leading-5 text-stone-500">
                {t.dialogs.aiPrepBodyBefore}{" "}
                <code className="rounded bg-stone-100 px-1 py-0.5 text-[10px] text-stone-600">
                  AI_GATEWAY_API_KEY
                </code>{" "}
                {t.dialogs.aiPrepBodyAfter}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-stone-100 text-stone-500">
              <Database className="size-4" />
            </span>
            <div className="flex-1">
              <p className="text-xs font-semibold text-stone-800">
                {t.dialogs.localStorageTitle}
              </p>
              <p className="mt-1 text-[11px] leading-5 text-stone-500">
                {t.dialogs.localStorageBody}
              </p>
              <button
                type="button"
                onClick={() => {
                  onReset();
                  onClose();
                }}
                className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 text-[11px] font-semibold text-red-600 transition hover:bg-red-100"
              >
                <RotateCcw className="size-3" />
                {t.dialogs.resetDemo}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end border-t border-stone-200/80 px-5 py-4 sm:px-6">
        <button
          type="button"
          onClick={onClose}
          className="h-10 rounded-xl bg-stone-900 px-4 text-xs font-semibold text-white transition hover:bg-stone-800"
        >
          {t.common.done}
        </button>
      </div>
    </DialogFrame>
  );
}
