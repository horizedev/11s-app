-- Referral program: a user earns 1 quota per new user who signs up with
-- their referral link (?ref=<user_id>). 3 quota redeem 1 free month of Pro,
-- unlimited times. Redeemed months are tracked so quota balance is
-- count(11s_referrals) - referral_redeemed_count * 3.

alter table public."11s_preferences"
  add column referral_redeemed_count integer not null default 0
    check (referral_redeemed_count >= 0);

comment on column public."11s_preferences".referral_redeemed_count is
  'How many free Pro months the user has redeemed with referral quota.';

create table public."11s_referrals" (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references auth.users (id) on delete cascade,
  referred_user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint "11s_referrals_referred_user_key" unique (referred_user_id),
  constraint "11s_referrals_no_self" check (referrer_id <> referred_user_id)
);

comment on table public."11s_referrals" is
  'One row per successful referral: the new user who signed up via a referral link and the user who referred them.';

create index "11s_referrals_referrer_idx"
  on public."11s_referrals" (referrer_id);

alter table public."11s_referrals" enable row level security;

-- Referrers can read their own referral rows; inserts happen only through
-- the service role after signup attribution.
create policy "Users read their 11s referrals"
  on public."11s_referrals"
  for select
  to authenticated
  using ((select auth.uid()) = referrer_id);

revoke all on table public."11s_referrals" from anon;
grant select on table public."11s_referrals" to authenticated;

-- Atomically spend 3 referral quota for one month of Pro. Runs as the
-- service role only; locks the preferences row so concurrent redeems for
-- the same user cannot both pass the balance check.
create or replace function public."11s_redeem_referral_credit"(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_pref public."11s_preferences"%rowtype;
  v_referrals integer;
  v_balance integer;
  v_base timestamptz;
  v_new_end timestamptz;
begin
  select * into v_pref
    from public."11s_preferences"
    where user_id = p_user_id
    for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'no_preferences');
  end if;

  -- Paid Stripe subscribers keep billing-managed access; no redemption.
  if v_pref.stripe_customer_id is not null
     and v_pref.plan = 'pro'
     and v_pref.subscription_status in ('active', 'trialing') then
    return jsonb_build_object('ok', false, 'error', 'already_pro');
  end if;

  select count(*) into v_referrals
    from public."11s_referrals"
    where referrer_id = p_user_id;

  v_balance := v_referrals - v_pref.referral_redeemed_count * 3;

  if v_balance < 3 then
    return jsonb_build_object(
      'ok', false, 'error', 'not_enough_quota', 'balance', v_balance);
  end if;

  -- Stack on a still-active referral period, otherwise start from now.
  if v_pref.plan = 'pro'
     and v_pref.stripe_customer_id is null
     and v_pref.subscription_status in ('active', 'trialing')
     and v_pref.current_period_end is not null
     and v_pref.current_period_end > now() then
    v_base := v_pref.current_period_end;
  else
    v_base := now();
  end if;

  v_new_end := v_base + interval '1 month';

  update public."11s_preferences"
    set plan = 'pro',
        subscription_status = 'active',
        current_period_end = v_new_end,
        referral_redeemed_count = referral_redeemed_count + 1,
        updated_at = now()
    where user_id = p_user_id;

  return jsonb_build_object(
    'ok', true,
    'current_period_end', v_new_end,
    'balance', v_balance - 3);
end;
$$;

revoke all on function public."11s_redeem_referral_credit"(uuid)
  from public, anon, authenticated;
