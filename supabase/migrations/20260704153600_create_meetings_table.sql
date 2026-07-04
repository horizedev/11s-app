create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  relationship_id uuid not null references public.relationships (id) on delete cascade,
  purpose text,
  scheduled_at timestamptz,
  status text not null default 'draft',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  constraint meetings_status_valid check (status in ('draft', 'completed', 'archived'))
);

create index meetings_user_status_scheduled_idx
  on public.meetings (user_id, status, scheduled_at desc);

create index meetings_relationship_updated_idx
  on public.meetings (relationship_id, updated_at desc);

grant select, insert, update on table public.meetings to authenticated;

alter table public.meetings enable row level security;

create policy "Users can read their own meetings"
  on public.meetings
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert meetings for their own relationships"
  on public.meetings
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.relationships
      where relationships.id = meetings.relationship_id
        and relationships.user_id = (select auth.uid())
    )
  );

create policy "Users can update their own meetings"
  on public.meetings
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.relationships
      where relationships.id = meetings.relationship_id
        and relationships.user_id = (select auth.uid())
    )
  );
