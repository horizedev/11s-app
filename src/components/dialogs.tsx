"use client";

import {
  MessageSquareText,
  Pencil,
  Save,
  Smile,
  Trash2,
  UserRoundPlus,
  X,
} from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { Avatar } from "@/components/ui-kit";
import { PERSON_EMOJIS, pickDefaultEmoji } from "@/lib/avatars";
import { useLocale } from "@/lib/i18n";
import type { DiscussionMood, Discussion, Relationship } from "@/lib/types";
import { cn, toDateTimeLocal } from "@/lib/utils";

export interface NewPersonInput {
  name: string;
  role: string;
  organization: string;
  relationship: Relationship;
  notes: string;
  background: string;
  linkedinUrl: string;
  avatarEmoji: string;
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
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === dialogRef.current)
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-6"
      role="presentation"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="max-h-[92dvh] w-full overscroll-contain overflow-y-auto rounded-t-[26px] border border-border bg-surface-raised pb-[env(safe-area-inset-bottom)] shadow-[0_30px_80px_rgb(var(--shadow-color)/0.28)] outline-none sm:max-w-[560px] sm:rounded-[26px] sm:pb-0"
      >
        <div className="flex items-start gap-3 border-b border-border px-5 py-5 sm:px-6">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
            {icon}
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id={titleId}
              className="text-base font-semibold tracking-[-0.02em] text-foreground"
            >
              {title}
            </h2>
            <p id={descriptionId} className="mt-1 text-xs leading-5 text-muted">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-subtle transition-colors hover:bg-surface-muted hover:text-foreground"
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
  "mt-1.5 h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] placeholder:text-muted-subtle focus:border-border-strong focus:bg-surface-raised focus:ring-4 focus:ring-focus/10";
const textareaClassName =
  "mt-1.5 w-full resize-none rounded-xl border border-border bg-surface px-3 py-2.5 text-sm leading-5 text-foreground outline-none transition-[border-color,background-color,box-shadow] placeholder:text-muted-subtle focus:border-border-strong focus:bg-surface-raised focus:ring-4 focus:ring-focus/10";
const labelClassName = "block text-[11px] font-semibold text-foreground/80";

function readPersonInput(
  form: HTMLFormElement,
  relationship: Relationship,
  avatarEmoji: string,
): NewPersonInput {
  const formData = new FormData(form);

  return {
    name: String(formData.get("name")).trim(),
    role: String(formData.get("role")).trim(),
    organization: String(formData.get("organization")).trim(),
    relationship,
    notes: String(formData.get("notes")).trim(),
    background: String(formData.get("background")).trim(),
    linkedinUrl: String(formData.get("linkedinUrl")).trim(),
    avatarEmoji,
  };
}

function EmojiPicker({
  value,
  onChange,
  name,
  color,
}: {
  value: string;
  onChange: (emoji: string) => void;
  name: string;
  color: string;
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

  return (
    <div
      ref={rootRef}
      className="relative border-b border-border px-5 py-4 sm:px-6"
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={t.person.chooseEmoji}
          className="group relative rounded-full outline-none transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised"
        >
          <Avatar name={name || "?"} color={color} size="lg" emoji={value} />
          <span className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full border border-border bg-surface-raised text-muted shadow-sm transition-colors group-hover:text-foreground">
            <Smile className="size-3" />
          </span>
        </button>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            {t.person.chooseEmoji}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-subtle">
            {t.person.emojiHint}
          </p>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="mt-2.5 inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface-raised px-3 text-[11px] font-semibold text-muted transition-colors hover:border-border-strong hover:text-foreground"
          >
            <Smile className="size-3" />
            {open ? t.common.done : t.person.chooseEmoji}
          </button>
        </div>
      </div>

      {open ? (
        <div
          className="absolute inset-x-4 top-[calc(100%-0.5rem)] z-20 rounded-2xl border border-border bg-surface-raised p-3 shadow-[0_18px_50px_rgb(var(--shadow-color)/0.14)] sm:inset-x-6"
          role="listbox"
          aria-label={t.person.chooseEmoji}
        >
          <div className="mb-2 flex items-center justify-between gap-2 px-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-subtle">
              {t.person.chooseEmoji}
            </p>
            <span className="text-[10px] tabular-nums text-muted-subtle">
              {PERSON_EMOJIS.length}
            </span>
          </div>
          <div className="grid max-h-56 grid-cols-8 gap-1 overflow-y-auto sm:grid-cols-10">
            {PERSON_EMOJIS.map((emoji) => {
              const selected = emoji === value;
              return (
                <button
                  key={emoji}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(emoji);
                    setOpen(false);
                  }}
                  className={cn(
                    "grid aspect-square place-items-center rounded-xl text-lg transition",
                    selected
                      ? "bg-accent-soft shadow-sm ring-2 ring-accent ring-offset-1 ring-offset-surface-raised"
                      : "hover:bg-surface-muted",
                  )}
                >
                  <span className="leading-none">{emoji}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PersonFormFields({
  relationship,
  onRelationshipChange,
  values = {},
}: {
  relationship: Relationship;
  onRelationshipChange: (relationship: Relationship) => void;
  values?: Partial<NewPersonInput>;
}) {
  const { t } = useLocale();

  return (
    <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
      <label className={labelClassName}>
        {t.dialogs.name}
        <input
          name="name"
          required
          maxLength={120}
          autoComplete="off"
          defaultValue={values.name}
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
            onRelationshipChange(event.target.value as Relationship)
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
          maxLength={160}
          autoComplete="off"
          defaultValue={values.role}
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
          maxLength={160}
          autoComplete="off"
          defaultValue={values.organization}
          placeholder={
            relationship === "friend"
              ? t.dialogs.orgPlaceholderFriend
              : t.dialogs.orgPlaceholderWork
          }
          className={fieldClassName}
        />
      </label>
      <label className={`${labelClassName} sm:col-span-2`}>
        {t.dialogs.linkedinUrl}
        <input
          name="linkedinUrl"
          type="url"
          inputMode="url"
          maxLength={500}
          autoComplete="url"
          spellCheck={false}
          defaultValue={values.linkedinUrl}
          placeholder={t.dialogs.linkedinUrlPlaceholder}
          className={fieldClassName}
        />
      </label>
      <label className={`${labelClassName} sm:col-span-2`}>
        {t.dialogs.background}
        <textarea
          name="background"
          rows={4}
          maxLength={8000}
          autoComplete="off"
          defaultValue={values.background}
          placeholder={t.dialogs.backgroundPlaceholder}
          className={textareaClassName}
        />
        <span className="mt-1 block text-[10px] font-normal text-muted-subtle">
          {t.dialogs.backgroundHint}
        </span>
      </label>
      <label className={`${labelClassName} sm:col-span-2`}>
        {t.dialogs.notesForNext}
        <textarea
          name="notes"
          rows={4}
          maxLength={12_000}
          autoComplete="off"
          defaultValue={values.notes}
          placeholder={t.dialogs.notesPlaceholder}
          className={textareaClassName}
        />
      </label>
    </div>
  );
}

export function AddPersonDialog({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (person: NewPersonInput) => void;
}) {
  const { t } = useLocale();
  const [relationship, setRelationship] = useState<Relationship>("peer");
  const [avatarEmoji, setAvatarEmoji] = useState<string>(() =>
    pickDefaultEmoji("new-person"),
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(readPersonInput(event.currentTarget, relationship, avatarEmoji));
  }

  return (
    <DialogFrame
      title={t.dialogs.addTitle}
      description={t.dialogs.addDescription}
      icon={<UserRoundPlus className="size-4" />}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <EmojiPicker
          value={avatarEmoji}
          onChange={setAvatarEmoji}
          name={t.dialogs.namePlaceholder}
          color="#6C63A8"
        />
        <PersonFormFields
          relationship={relationship}
          onRelationshipChange={setRelationship}
        />
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl px-4 text-xs font-semibold text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            {t.common.cancel}
          </button>
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            <UserRoundPlus className="size-3.5" />
            {t.common.addPerson}
          </button>
        </div>
      </form>
    </DialogFrame>
  );
}

export function EditPersonDialog({
  person,
  color,
  onClose,
  onSubmit,
  onDelete,
}: {
  person: NewPersonInput & { name: string };
  color: string;
  onClose: () => void;
  onSubmit: (person: NewPersonInput) => void;
  onDelete: () => void;
}) {
  const { t } = useLocale();
  const [relationship, setRelationship] = useState(person.relationship);
  const [avatarEmoji, setAvatarEmoji] = useState<string>(
    person.avatarEmoji || pickDefaultEmoji(person.name),
  );
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(readPersonInput(event.currentTarget, relationship, avatarEmoji));
  }

  return (
    <DialogFrame
      title={t.dialogs.editTitle}
      description={
        confirmDelete
          ? t.dialogs.deletePersonConfirm(person.name)
          : t.dialogs.editDescription
      }
      icon={<Pencil className="size-4" />}
      onClose={onClose}
    >
      {confirmDelete ? (
        <div className="px-5 py-5 sm:px-6">
          <p className="text-sm leading-6 text-muted">
            {t.dialogs.deletePersonBody}
          </p>
          <div className="mt-5 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="h-10 rounded-xl px-4 text-xs font-semibold text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              {t.common.cancel}
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-red-600 px-4 text-xs font-semibold text-white transition hover:bg-red-500"
            >
              <Trash2 className="size-3.5" />
              {t.dialogs.deletePerson}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <EmojiPicker
            value={avatarEmoji}
            onChange={setAvatarEmoji}
            name={person.name || "?"}
            color={color}
          />
          <PersonFormFields
            relationship={relationship}
            onRelationshipChange={setRelationship}
            values={person}
          />
          <div className="flex items-center justify-between gap-2 border-t border-border px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-red-600 transition hover:bg-red-50"
            >
              <Trash2 className="size-3.5" />
              {t.dialogs.deletePerson}
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-xl px-4 text-xs font-semibold text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
              >
                <Save className="size-3.5" />
                {t.dialogs.savePerson}
              </button>
            </div>
          </div>
        </form>
      )}
    </DialogFrame>
  );
}

export function LogMeetingDialog({
  personName,
  discussion,
  onClose,
  onSubmit,
}: {
  personName: string;
  discussion?: Discussion;
  onClose: () => void;
  onSubmit: (discussion: NewDiscussionInput) => void;
}) {
  const { t } = useLocale();
  const isEditing = Boolean(discussion);
  const [mood, setMood] = useState<DiscussionMood>(
    discussion?.mood ?? "positive",
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const splitList = (value: string) =>
      value
        .split(/\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);

    onSubmit({
      title: String(formData.get("title")).trim(),
      date: new Date(String(formData.get("date"))).toISOString(),
      summary: String(formData.get("summary")).trim(),
      topics: splitList(String(formData.get("topics") ?? "")),
      followUps: splitList(String(formData.get("followUps") ?? "")),
      mood,
    });
  }

  return (
    <DialogFrame
      title={
        isEditing
          ? t.dialogs.editLogTitle(personName.split(" ")[0])
          : t.dialogs.logTitle(personName.split(" ")[0])
      }
      description={
        isEditing
          ? t.dialogs.editLogDescription
          : t.dialogs.logDescription
      }
      icon={
        isEditing ? (
          <Pencil className="size-4" />
        ) : (
          <MessageSquareText className="size-4" />
        )
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
          <label className={`${labelClassName} sm:col-span-2`}>
            {t.dialogs.conversationTitle}
            <input
              name="title"
              required
              defaultValue={discussion?.title}
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
              defaultValue={toDateTimeLocal(
                discussion?.date ?? new Date().toISOString(),
              )}
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
              defaultValue={discussion?.summary}
              placeholder={t.dialogs.summaryPlaceholder}
              className={textareaClassName}
            />
          </label>
          <label className={labelClassName}>
            {t.dialogs.topics}
            <textarea
              name="topics"
              rows={3}
              defaultValue={discussion?.topics.join("\n")}
              placeholder={t.dialogs.topicsPlaceholder}
              className={textareaClassName}
            />
          </label>
          <label className={labelClassName}>
            {t.dialogs.followUps}
            <textarea
              name="followUps"
              rows={3}
              defaultValue={discussion?.followUps.join("\n")}
              placeholder={t.dialogs.followUpsPlaceholder}
              className={textareaClassName}
            />
          </label>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl px-4 text-xs font-semibold text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            {t.common.cancel}
          </button>
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            {isEditing ? (
              <Save className="size-3.5" />
            ) : (
              <MessageSquareText className="size-3.5" />
            )}
            {isEditing
              ? t.dialogs.updateConversation
              : t.dialogs.saveConversation}
          </button>
        </div>
      </form>
    </DialogFrame>
  );
}
