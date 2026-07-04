create table public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  relationship_id uuid references public.relationships (id) on delete cascade,
  meeting_id uuid references public.meetings (id) on delete cascade,
  generation_type text not null,
  input_context_summary text,
  output_text text,
  status text not null default 'succeeded',
  error_code text,
  created_at timestamptz not null default timezone('utc', now()),
  constraint ai_generations_type_valid check (generation_type in ('agenda_ideas', 'followup_summary')),
  constraint ai_generations_status_valid check (status in ('succeeded', 'failed'))
);

create index ai_generations_user_created_idx
  on public.ai_generations (user_id, created_at desc);

create index ai_generations_meeting_type_idx
  on public.ai_generations (meeting_id, generation_type, created_at desc);

grant select, insert on table public.ai_generations to authenticated;

alter table public.ai_generations enable row level security;

create policy "Users can read their own AI generations"
  on public.ai_generations
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own AI generations"
  on public.ai_generations
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and (
      relationship_id is null
      or exists (
        select 1
        from public.relationships
        where relationships.id = ai_generations.relationship_id
          and relationships.user_id = (select auth.uid())
      )
    )
    and (
      meeting_id is null
      or exists (
        select 1
        from public.meetings
        where meetings.id = ai_generations.meeting_id
          and meetings.user_id = (select auth.uid())
      )
    )
  );

create table public.product_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  event_name text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index product_events_user_event_created_idx
  on public.product_events (user_id, event_name, created_at desc);

grant select, insert on table public.product_events to authenticated;

alter table public.product_events enable row level security;

create policy "Users can read their own product events"
  on public.product_events
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own product events"
  on public.product_events
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
