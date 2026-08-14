-- Professional background for each person (LinkedIn URL and/or free-typed profile).

alter table public."11s_people"
  add column if not exists background text not null default ''
    check (char_length(background) <= 8000),
  add column if not exists linkedin_url text not null default ''
    check (char_length(linkedin_url) <= 500);

comment on column public."11s_people".background is
  'Free-typed professional background or pasted LinkedIn About/experience text.';
comment on column public."11s_people".linkedin_url is
  'Optional LinkedIn profile URL for this person.';
