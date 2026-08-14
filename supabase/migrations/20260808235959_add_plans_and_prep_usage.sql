-- Add plan/subscription fields to preferences, and a metering table for the
-- free plan's AI preparation allowance.

alter table public."11s_preferences"
  add column plan text not null default 'free' check (plan in ('free', 'pro')),
  add column stripe_customer_id text,
  add column subscription_status text not null default 'none'
    check (subscription_status in ('none', 'active', 'trialing', 'past_due', 'canceled')),
  add column current_period_end timestamptz;

create unique index "11s_preferences_stripe_customer_idx"
  on public."11s_preferences" (stripe_customer_id)
  where stripe_customer_id is not null;

create table public."11s_prep_usage" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  person_id uuid,
  created_at timestamptz not null default now()
);

comment on table public."11s_prep_usage" is
  'Metering rows for AI preparation generations (free-plan allowance).';

create index "11s_prep_usage_user_date_idx"
  on public."11s_prep_usage" (user_id, created_at desc);

alter table public."11s_prep_usage" enable row level security;

create policy "Users read their 11s prep usage"
  on public."11s_prep_usage"
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users record their 11s prep usage"
  on public."11s_prep_usage"
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

revoke all on table public."11s_prep_usage" from anon;
grant select, insert on table public."11s_prep_usage" to authenticated;
