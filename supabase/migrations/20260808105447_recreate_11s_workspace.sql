-- Recreate workspace tables with the 11s_ prefix.
-- Drop the previous between_* schema (empty / demo-only at this stage).
-- Also remove cadence and next-meeting scheduling: the app records past
-- conversations and prepares for the next one without managing a schedule.

drop table if exists public.between_prep_ideas cascade;
drop table if exists public.between_discussions cascade;
drop table if exists public.between_preferences cascade;
drop table if exists public.between_people cascade;

create table public."11s_people" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  role text not null default '' check (char_length(role) <= 160),
  organization text not null default '' check (char_length(organization) <= 160),
  relationship text not null check (
    relationship in ('manager', 'direct-report', 'peer', 'mentor', 'friend')
  ),
  last_meeting_at timestamptz,
  notes text not null default '' check (char_length(notes) <= 12000),
  color text not null check (color ~ '^#[0-9A-Fa-f]{6}$'),
  prep_opening text check (prep_opening is null or char_length(prep_opening) <= 500),
  prep_source text check (prep_source is null or prep_source in ('ai', 'starter')),
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

comment on table public."11s_people" is
  'People and private 1:1 context owned by an 11s user.';

create table public."11s_discussions" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  person_id uuid not null,
  occurred_at timestamptz not null,
  title text not null check (char_length(btrim(title)) between 1 and 200),
  summary text not null check (char_length(btrim(summary)) between 1 and 2000),
  topics text[] not null default '{}',
  follow_ups text[] not null default '{}',
  mood text not null check (mood in ('energized', 'positive', 'neutral', 'tough')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint "11s_discussions_person_owner_fkey"
    foreign key (person_id, user_id)
    references public."11s_people" (id, user_id)
    on delete cascade
);

comment on table public."11s_discussions" is
  'Past 1:1 conversation history for an 11s person.';

create table public."11s_prep_ideas" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  person_id uuid not null,
  category text not null check (
    category in ('Follow up', 'Growth', 'Support', 'Alignment', 'Personal')
  ),
  title text not null check (char_length(btrim(title)) between 1 and 100),
  rationale text not null check (char_length(btrim(rationale)) between 1 and 500),
  prompt text not null check (char_length(btrim(prompt)) between 1 and 300),
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  constraint "11s_prep_ideas_person_owner_fkey"
    foreign key (person_id, user_id)
    references public."11s_people" (id, user_id)
    on delete cascade
);

comment on table public."11s_prep_ideas" is
  'Saved AI or starter preparation ideas for an 11s person.';

create table public."11s_preferences" (
  user_id uuid primary key references auth.users (id) on delete cascade,
  locale text not null default 'en' check (locale in ('en', 'zh-TW')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public."11s_preferences" is
  'Per-user 11s workspace preferences.';

create index "11s_people_user_sort_idx"
  on public."11s_people" (user_id, sort_order, created_at);
create index "11s_discussions_person_date_idx"
  on public."11s_discussions" (person_id, occurred_at desc);
create index "11s_discussions_user_idx"
  on public."11s_discussions" (user_id);
create index "11s_discussions_person_owner_idx"
  on public."11s_discussions" (person_id, user_id);
create index "11s_prep_ideas_person_sort_idx"
  on public."11s_prep_ideas" (person_id, sort_order, created_at);
create index "11s_prep_ideas_user_idx"
  on public."11s_prep_ideas" (user_id);
create index "11s_prep_ideas_person_owner_idx"
  on public."11s_prep_ideas" (person_id, user_id);

alter table public."11s_people" enable row level security;
alter table public."11s_discussions" enable row level security;
alter table public."11s_prep_ideas" enable row level security;
alter table public."11s_preferences" enable row level security;

create policy "Users manage their 11s people"
  on public."11s_people"
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users manage their 11s discussions"
  on public."11s_discussions"
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users manage their 11s prep ideas"
  on public."11s_prep_ideas"
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users manage their 11s preferences"
  on public."11s_preferences"
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on table public."11s_people" from anon;
revoke all on table public."11s_discussions" from anon;
revoke all on table public."11s_prep_ideas" from anon;
revoke all on table public."11s_preferences" from anon;

grant select, insert, update, delete on table public."11s_people" to authenticated;
grant select, insert, update, delete on table public."11s_discussions" to authenticated;
grant select, insert, update, delete on table public."11s_prep_ideas" to authenticated;
grant select, insert, update, delete on table public."11s_preferences" to authenticated;
