-- Application-level encryption (AES-256-GCM) stores ciphertext with a
-- "v1.<iv>.<data>" base64 envelope, which is longer than the plaintext
-- limits these checks enforced. Plaintext length is still validated in the
-- app layer (zod schemas and form inputs), so the DB checks are relaxed.

alter table public."11s_people"
  drop constraint if exists "11s_people_name_check",
  drop constraint if exists "11s_people_role_check",
  drop constraint if exists "11s_people_organization_check",
  drop constraint if exists "11s_people_notes_check",
  drop constraint if exists "11s_people_last_notes_check",
  drop constraint if exists "11s_people_background_check",
  drop constraint if exists "11s_people_linkedin_url_check",
  drop constraint if exists "11s_people_prep_opening_check";

alter table public."11s_discussions"
  drop constraint if exists "11s_discussions_title_check",
  drop constraint if exists "11s_discussions_summary_check";

alter table public."11s_prep_ideas"
  drop constraint if exists "11s_prep_ideas_title_check",
  drop constraint if exists "11s_prep_ideas_rationale_check",
  drop constraint if exists "11s_prep_ideas_prompt_check";

alter table public."11s_talking_points"
  drop constraint if exists "11s_talking_points_body_check";

alter table public."11s_career_needs"
  drop constraint if exists "11s_career_needs_body_check";

alter table public."11s_preferences"
  drop constraint if exists "11s_preferences_context_bank_check",
  drop constraint if exists "11s_preferences_brag_doc_check",
  drop constraint if exists "11s_preferences_career_direction_check",
  drop constraint if exists "11s_preferences_career_target_role_check",
  drop constraint if exists "11s_preferences_career_timeline_check",
  drop constraint if exists "11s_preferences_general_prep_opening_check";
