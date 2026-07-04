create table public.action_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  relationship_id uuid not null references public.relationships (id) on delete cascade,
  meeting_id uuid not null references public.meetings (id) on delete cascade,
  title text not null,
  owner text not null default 'unspecified',
  due_date date,
  notes text,
  status text not null default 'open',
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint action_items_title_present check (btrim(title) <> ''),
  constraint action_items_owner_valid check (
    owner in ('me', 'other_person', 'shared', 'unspecified')
  ),
  constraint action_items_status_valid check (
    status in ('open', 'completed', 'cancelled')
  )
);

create index action_items_user_status_due_idx
  on public.action_items (user_id, status, due_date asc, created_at desc);

create index action_items_relationship_status_idx
  on public.action_items (relationship_id, status, due_date asc, created_at desc);

create index action_items_meeting_created_idx
  on public.action_items (meeting_id, created_at asc);

grant select, insert, update on table public.action_items to authenticated;

alter table public.action_items enable row level security;

create policy "Users can read their own action items"
  on public.action_items
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own action items"
  on public.action_items
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.relationships
      where relationships.id = action_items.relationship_id
        and relationships.user_id = (select auth.uid())
    )
    and exists (
      select 1
      from public.meetings
      where meetings.id = action_items.meeting_id
        and meetings.relationship_id = action_items.relationship_id
        and meetings.user_id = (select auth.uid())
    )
  );

create policy "Users can update their own action items"
  on public.action_items
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.relationships
      where relationships.id = action_items.relationship_id
        and relationships.user_id = (select auth.uid())
    )
    and exists (
      select 1
      from public.meetings
      where meetings.id = action_items.meeting_id
        and meetings.relationship_id = action_items.relationship_id
        and meetings.user_id = (select auth.uid())
    )
  );
