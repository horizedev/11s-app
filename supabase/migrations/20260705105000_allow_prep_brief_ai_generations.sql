alter table public.ai_generations
  drop constraint ai_generations_type_valid;

alter table public.ai_generations
  add constraint ai_generations_type_valid
  check (generation_type in ('agenda_ideas', 'followup_summary', 'prep_brief'));
