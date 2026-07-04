create table public.agenda_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  relationship_id uuid not null references public.relationships (id) on delete cascade,
  meeting_id uuid not null references public.meetings (id) on delete cascade,
  title text not null,
  description text,
  category text,
  position integer not null,
  is_discussed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint agenda_items_title_present check (btrim(title) <> ''),
  constraint agenda_items_category_valid check (
    category is null
    or category in (
      'update',
      'blocker',
      'decision',
      'feedback',
      'growth',
      'personal',
      'other'
    )
  ),
  constraint agenda_items_position_nonnegative check (position >= 0)
);

create index agenda_items_meeting_position_idx
  on public.agenda_items (meeting_id, position asc);

create index agenda_items_user_relationship_idx
  on public.agenda_items (user_id, relationship_id, is_discussed, updated_at desc);

grant select, insert, update, delete on table public.agenda_items to authenticated;

alter table public.agenda_items enable row level security;

create policy "Users can read their own agenda items"
  on public.agenda_items
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert agenda items for their own meetings"
  on public.agenda_items
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.relationships
      where relationships.id = agenda_items.relationship_id
        and relationships.user_id = (select auth.uid())
    )
    and exists (
      select 1
      from public.meetings
      where meetings.id = agenda_items.meeting_id
        and meetings.relationship_id = agenda_items.relationship_id
        and meetings.user_id = (select auth.uid())
    )
  );

create policy "Users can update their own agenda items"
  on public.agenda_items
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.relationships
      where relationships.id = agenda_items.relationship_id
        and relationships.user_id = (select auth.uid())
    )
    and exists (
      select 1
      from public.meetings
      where meetings.id = agenda_items.meeting_id
        and meetings.relationship_id = agenda_items.relationship_id
        and meetings.user_id = (select auth.uid())
    )
  );

create policy "Users can delete their own agenda items"
  on public.agenda_items
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
