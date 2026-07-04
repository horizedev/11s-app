create table public.relationships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  person_name text not null,
  relationship_type text not null,
  person_context text,
  relationship_goal text,
  cadence text,
  status text not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint relationships_person_name_present check (btrim(person_name) <> ''),
  constraint relationships_type_valid check (
    relationship_type in (
      'manager',
      'direct_report',
      'peer',
      'mentor',
      'client',
      'friend_family',
      'other'
    )
  ),
  constraint relationships_cadence_valid check (
    cadence is null
    or cadence in ('weekly', 'biweekly', 'monthly', 'quarterly')
  ),
  constraint relationships_status_valid check (status in ('active', 'archived'))
);

create index relationships_user_status_updated_idx
  on public.relationships (user_id, status, updated_at desc);

grant select, insert, update on table public.relationships to authenticated;

alter table public.relationships enable row level security;

create policy "Users can read their own relationships"
  on public.relationships
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own relationships"
  on public.relationships
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own relationships"
  on public.relationships
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
