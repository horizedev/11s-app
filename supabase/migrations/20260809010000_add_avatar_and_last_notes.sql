-- Person profile photos + archive slot for notes used in the last meeting.

alter table public."11s_people"
  add column if not exists avatar_path text,
  add column if not exists last_notes text not null default '';

comment on column public."11s_people".avatar_path is
  'Storage object path in the 11s-avatars bucket (user_id/person_id.ext).';

comment on column public."11s_people".last_notes is
  'Notes archived from the previous meeting so the next-meeting notepad can be cleared.';

-- Public bucket for contact avatars (profile pictures). Upload/update/delete
-- still require ownership via RLS; public read is intentional for avatars.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  '11s-avatars',
  '11s-avatars',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "11s avatars public read" on storage.objects;
create policy "11s avatars public read"
  on storage.objects
  for select
  to public
  using (bucket_id = '11s-avatars');

drop policy if exists "11s avatars owner insert" on storage.objects;
create policy "11s avatars owner insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = '11s-avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

drop policy if exists "11s avatars owner update" on storage.objects;
create policy "11s avatars owner update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = '11s-avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  )
  with check (
    bucket_id = '11s-avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

drop policy if exists "11s avatars owner delete" on storage.objects;
create policy "11s avatars owner delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = '11s-avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
