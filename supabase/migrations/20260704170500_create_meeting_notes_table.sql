create table public.meeting_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  relationship_id uuid not null references public.relationships (id) on delete cascade,
  meeting_id uuid not null references public.meetings (id) on delete cascade,
  note_type text not null,
  body text not null,
  position integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint meeting_notes_type_valid check (
    note_type in ('shareable', 'private', 'decision')
  ),
  constraint meeting_notes_body_present check (btrim(body) <> ''),
  constraint meeting_notes_position_nonnegative check (position >= 0)
);

create unique index meeting_notes_singleton_type_idx
  on public.meeting_notes (meeting_id, note_type)
  where note_type in ('shareable', 'private');

create index meeting_notes_meeting_type_position_idx
  on public.meeting_notes (meeting_id, note_type, position asc);

grant select, insert, update, delete on table public.meeting_notes to authenticated;

alter table public.meeting_notes enable row level security;

create policy "Users can read their own meeting notes"
  on public.meeting_notes
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own meeting notes"
  on public.meeting_notes
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.relationships
      where relationships.id = meeting_notes.relationship_id
        and relationships.user_id = (select auth.uid())
    )
    and exists (
      select 1
      from public.meetings
      where meetings.id = meeting_notes.meeting_id
        and meetings.relationship_id = meeting_notes.relationship_id
        and meetings.user_id = (select auth.uid())
    )
  );

create policy "Users can update their own meeting notes"
  on public.meeting_notes
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.relationships
      where relationships.id = meeting_notes.relationship_id
        and relationships.user_id = (select auth.uid())
    )
    and exists (
      select 1
      from public.meetings
      where meetings.id = meeting_notes.meeting_id
        and meetings.relationship_id = meeting_notes.relationship_id
        and meetings.user_id = (select auth.uid())
    )
  );

create policy "Users can delete their own meeting notes"
  on public.meeting_notes
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
