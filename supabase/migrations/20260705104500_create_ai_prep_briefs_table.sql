create table public.ai_prep_briefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  relationship_id uuid not null references public.relationships (id) on delete cascade,
  meeting_id uuid not null references public.meetings (id) on delete cascade,
  content_markdown text not null,
  included_private_notes boolean not null default false,
  model text,
  input_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index ai_prep_briefs_user_meeting_created_idx
  on public.ai_prep_briefs (user_id, meeting_id, created_at desc);

grant select, insert on table public.ai_prep_briefs to authenticated;

alter table public.ai_prep_briefs enable row level security;

create policy "Users can read their own prep briefs"
  on public.ai_prep_briefs
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own prep briefs"
  on public.ai_prep_briefs
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.relationships
      where relationships.id = ai_prep_briefs.relationship_id
        and relationships.user_id = (select auth.uid())
    )
    and exists (
      select 1
      from public.meetings
      where meetings.id = ai_prep_briefs.meeting_id
        and meetings.relationship_id = ai_prep_briefs.relationship_id
        and meetings.user_id = (select auth.uid())
    )
  );

create policy "Service role can manage prep briefs"
  on public.ai_prep_briefs
  for all
  to service_role
  using (true)
  with check (true);
