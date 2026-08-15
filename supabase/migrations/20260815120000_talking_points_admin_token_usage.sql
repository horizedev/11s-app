-- Talking points: a curated, user-controlled final agenda list per person.
-- Brainstorming notes stay on "11s_people".notes; AI ideas stay in
-- "11s_prep_ideas"; this table is the third, final stage of preparation.

create table public."11s_talking_points" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  person_id uuid not null,
  body text not null check (char_length(btrim(body)) between 1 and 300),
  source text not null default 'manual' check (source in ('manual', 'ai')),
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  constraint "11s_talking_points_person_owner_fkey"
    foreign key (person_id, user_id)
    references public."11s_people" (id, user_id)
    on delete cascade
);

comment on table public."11s_talking_points" is
  'Curated talking points for the next 1:1 with an 11s person. Added manually or promoted from AI ideas.';

create index "11s_talking_points_person_sort_idx"
  on public."11s_talking_points" (person_id, sort_order, created_at);
create index "11s_talking_points_user_idx"
  on public."11s_talking_points" (user_id);

alter table public."11s_talking_points" enable row level security;

create policy "Users manage their 11s talking points"
  on public."11s_talking_points"
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on table public."11s_talking_points" from anon;
grant select, insert, update, delete on table public."11s_talking_points"
  to authenticated;

-- Token metering on AI preparation usage, for admin consumption stats.
alter table public."11s_prep_usage"
  add column input_tokens integer check (input_tokens is null or input_tokens >= 0),
  add column output_tokens integer check (output_tokens is null or output_tokens >= 0),
  add column total_tokens integer check (total_tokens is null or total_tokens >= 0);

comment on column public."11s_prep_usage".total_tokens is
  'Total model tokens consumed by the generation that spent this credit.';

-- Admin role: operators with access to the /admin statistics page.
-- Grant manually, e.g.:
--   update public."11s_preferences" set is_admin = true where user_id = '...';
alter table public."11s_preferences"
  add column is_admin boolean not null default false;

-- Set once a signup Telegram notification has been sent for the user, so
-- retries and parallel flows cannot double-notify.
alter table public."11s_preferences"
  add column signup_notified_at timestamptz;
