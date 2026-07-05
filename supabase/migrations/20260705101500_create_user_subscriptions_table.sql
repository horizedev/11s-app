create table public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade unique,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  stripe_price_id text,
  plan text not null default 'free',
  status text not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint user_subscriptions_plan_valid check (plan in ('free', 'pro')),
  constraint user_subscriptions_status_valid check (
    status in (
      'inactive',
      'trialing',
      'active',
      'past_due',
      'canceled',
      'incomplete',
      'incomplete_expired',
      'unpaid'
    )
  )
);

create index user_subscriptions_user_plan_status_idx
  on public.user_subscriptions (user_id, plan, status);

create index user_subscriptions_customer_idx
  on public.user_subscriptions (stripe_customer_id)
  where stripe_customer_id is not null;

grant select, insert, update on table public.user_subscriptions to authenticated;

alter table public.user_subscriptions enable row level security;

create policy "Users can read their own subscription"
  on public.user_subscriptions
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own subscription"
  on public.user_subscriptions
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own subscription"
  on public.user_subscriptions
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Service role can manage subscriptions"
  on public.user_subscriptions
  for all
  to service_role
  using (true)
  with check (true);
