create index between_discussions_person_owner_idx
  on public.between_discussions (person_id, user_id);

create index between_prep_ideas_person_owner_idx
  on public.between_prep_ideas (person_id, user_id);
