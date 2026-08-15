import { encryptText, importEncryptionKey, isEncrypted } from "@/lib/crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * One-shot backfill: rewrites every sensitive column with AES-256-GCM
 * ciphertext. Idempotent — rows already carrying the "v1." envelope are
 * skipped. Admin-only.
 */
export async function POST() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: preferences } = await supabase
    .from("11s_preferences")
    .select("is_admin")
    .eq("user_id", data.claims.sub)
    .maybeSingle();

  if (preferences?.is_admin !== true) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const base64Key = process.env.DATA_ENCRYPTION_KEY;
  if (!base64Key) {
    return Response.json(
      { error: "DATA_ENCRYPTION_KEY is not configured." },
      { status: 503 },
    );
  }
  const key = await importEncryptionKey(base64Key);
  const admin = createAdminClient();

  async function seal(value: unknown): Promise<unknown> {
    if (typeof value !== "string" || value === "" || isEncrypted(value)) {
      return value;
    }
    return encryptText(value, key);
  }

  async function sealRows(
    table:
      | "11s_people"
      | "11s_discussions"
      | "11s_prep_ideas"
      | "11s_talking_points"
      | "11s_career_needs",
    fields: string[],
  ): Promise<number> {
    let updated = 0;
    const { data: rows, error: readError } = await admin
      .from(table)
      .select("*")
      .limit(10_000);
    if (readError) throw new Error(`${table}: ${readError.message}`);

    for (const row of rows ?? []) {
      const record = row as Record<string, unknown>;
      const update: Record<string, unknown> = {};
      for (const field of fields) {
        const sealed = await seal(record[field]);
        if (sealed !== record[field]) update[field] = sealed;
      }
      if (Object.keys(update).length === 0) continue;
      const { error: updateError } = await admin
        .from(table)
        .update(update as never)
        .eq("id", record.id as string);
      if (updateError) throw new Error(`${table}: ${updateError.message}`);
      updated += 1;
    }
    return updated;
  }

  const counts: Record<string, number> = {};
  counts.people = await sealRows("11s_people", [
    "name",
    "role",
    "organization",
    "notes",
    "last_notes",
    "background",
    "linkedin_url",
    "prep_opening",
  ]);
  counts.discussions = await sealRows("11s_discussions", [
    "title",
    "summary",
  ]);
  // topics / follow_ups are text[] — seal each element.
  {
    let updated = 0;
    const { data: rows, error: readError } = await admin
      .from("11s_discussions")
      .select("id, topics, follow_ups")
      .limit(10_000);
    if (readError) throw new Error(readError.message);
    for (const row of rows ?? []) {
      const sealArray = async (items: string[]) =>
        Promise.all(items.map((item) => seal(item) as Promise<string>));
      const topics = await sealArray(row.topics ?? []);
      const followUps = await sealArray(row.follow_ups ?? []);
      if (
        topics.some((item, i) => item !== row.topics?.[i]) ||
        followUps.some((item, i) => item !== row.follow_ups?.[i])
      ) {
        const { error: updateError } = await admin
          .from("11s_discussions")
          .update({ topics, follow_ups: followUps })
          .eq("id", row.id);
        if (updateError) throw new Error(updateError.message);
        updated += 1;
      }
    }
    counts.discussion_arrays = updated;
  }
  counts.prep_ideas = await sealRows("11s_prep_ideas", [
    "title",
    "rationale",
    "prompt",
  ]);
  counts.talking_points = await sealRows("11s_talking_points", ["body"]);
  counts.career_needs = await sealRows("11s_career_needs", ["body"]);

  // Preferences use user_id as the primary key.
  {
    let updated = 0;
    const { data: rows, error: readError } = await admin
      .from("11s_preferences")
      .select("*")
      .limit(10_000);
    if (readError) throw new Error(readError.message);
    for (const row of rows ?? []) {
      const record = row as Record<string, unknown>;
      const update: Record<string, unknown> = {};
      for (const field of [
        "context_bank",
        "general_prep_opening",
        "brag_doc",
        "career_direction",
        "career_target_role",
        "career_timeline",
      ]) {
        const sealed = await seal(record[field]);
        if (sealed !== record[field]) update[field] = sealed;
      }
      if (Object.keys(update).length === 0) continue;
      const { error: updateError } = await admin
        .from("11s_preferences")
        .update(update as never)
        .eq("user_id", record.user_id as string);
      if (updateError) throw new Error(updateError.message);
      updated += 1;
    }
    counts.preferences = updated;
  }

  return Response.json({ ok: true, updated: counts });
}
