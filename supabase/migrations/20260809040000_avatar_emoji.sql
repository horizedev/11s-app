-- Clear photo storage paths from avatar_path so the column can hold emoji avatars.
-- Values that look like storage object paths (contain / or a file extension) are reset.
update public."11s_people"
set avatar_path = null
where avatar_path is not null
  and (
    avatar_path like '%/%'
    or avatar_path like '%.jpg'
    or avatar_path like '%.jpeg'
    or avatar_path like '%.png'
    or avatar_path like '%.webp'
    or avatar_path like '%.gif'
  );

comment on column public."11s_people".avatar_path is
  'Optional emoji used as the person avatar in the workspace UI.';
