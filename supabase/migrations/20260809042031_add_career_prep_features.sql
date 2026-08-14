-- Career layer (brag doc, direction, needs) + prep idea kinds for lead/support/stall.

alter table public."11s_preferences"
  add column if not exists brag_doc text not null default ''
    check (char_length(brag_doc) <= 20000),
  add column if not exists career_direction text not null default ''
    check (char_length(career_direction) <= 4000),
  add column if not exists career_target_role text not null default ''
    check (char_length(career_target_role) <= 200),
  add column if not exists career_timeline text not null default ''
    check (char_length(career_timeline) <= 200);

comment on column public."11s_preferences".brag_doc is
  'Private promotion / brag document used for career-oriented 1:1 preparation.';
comment on column public."11s_preferences".career_direction is
  'Private notes on career direction that bias Career intent preparation.';
comment on column public."11s_preferences".career_target_role is
  'Optional target role for private career planning.';
comment on column public."11s_preferences".career_timeline is
  'Optional timeline for the career target (e.g. H2, 2026).';

create table if not exists public."11s_career_needs" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  body text not null
    check (char_length(body) >= 1 and char_length(body) <= 500),
  status text not null default 'open'
    check (status in ('open', 'routed', 'done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public."11s_career_needs" is
  'Private career needs inbox used for who-to-ask routing into 1:1 prep.';

create index if not exists "11s_career_needs_user_created_idx"
  on public."11s_career_needs" (user_id, created_at desc);

alter table public."11s_career_needs" enable row level security;

create policy "Users manage their 11s career needs"
  on public."11s_career_needs"
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on table public."11s_career_needs" from anon;
grant select, insert, update, delete on table public."11s_career_needs" to authenticated;

alter table public."11s_prep_ideas"
  add column if not exists kind text not null default 'support'
    check (kind in ('lead', 'support', 'stall'));

comment on column public."11s_prep_ideas".kind is
  'Prep idea role: lead question, supporting thread, or stall fallback.';
