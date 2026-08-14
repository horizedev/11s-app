-- Add reusable user context and allow preparation ideas without a person.

alter table public."11s_preferences"
  add column context_bank text not null default ''
    check (char_length(context_bank) <= 12000),
  add column general_prep_opening text
    check (
      general_prep_opening is null
      or char_length(general_prep_opening) <= 500
    ),
  add column general_prep_source text
    check (
      general_prep_source is null
      or general_prep_source in ('ai', 'starter')
    );

comment on column public."11s_preferences".context_bank is
  'Reusable private context about the user that can shape any conversation preparation.';
comment on column public."11s_preferences".general_prep_opening is
  'Latest generated opening for general small-talk preparation.';
comment on column public."11s_preferences".general_prep_source is
  'Whether the latest general small-talk preparation came from AI or starter logic.';

-- PostgreSQL foreign keys permit null values, so the existing composite
-- person-owner foreign key continues to protect every person-scoped row.
alter table public."11s_prep_ideas"
  alter column person_id drop not null;

alter table public."11s_prep_ideas"
  drop constraint "11s_prep_ideas_category_check";

alter table public."11s_prep_ideas"
  add constraint "11s_prep_ideas_category_check"
  check (
    category in (
      'Follow up',
      'Growth',
      'Support',
      'Alignment',
      'Personal',
      'Small talk'
    )
  );

create index "11s_prep_ideas_general_sort_idx"
  on public."11s_prep_ideas" (user_id, sort_order, created_at)
  where person_id is null;

comment on table public."11s_prep_ideas" is
  'Saved person-specific preparation and general small-talk ideas for an 11s user.';
