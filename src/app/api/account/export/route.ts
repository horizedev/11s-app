import { decryptText, importEncryptionKey } from "@/lib/crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const SENSITIVE_PERSON_FIELDS = [
  "name",
  "role",
  "organization",
  "notes",
  "last_notes",
  "background",
  "linkedin_url",
  "prep_opening",
] as const;
const SENSITIVE_DISCUSSION_FIELDS = ["title", "summary", "topics", "follow_ups"] as const;
const SENSITIVE_IDEA_FIELDS = ["title", "rationale", "prompt"] as const;
const SENSITIVE_PREF_FIELDS = [
  "context_bank",
  "general_prep_opening",
  "brag_doc",
  "career_direction",
  "career_target_role",
  "career_timeline",
] as const;

type Row = Record<string, unknown>;

/**
 * Exports the signed-in user's own data as a human-readable JSON document.
 * Internal identifiers (row IDs, foreign keys, Stripe references, admin and
 * notification flags) are intentionally excluded so the export reflects the
 * user's content, not our system design.
 */
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = data.claims.sub;
  const admin = createAdminClient();

  const [
    userResult,
    preferences,
    people,
    discussions,
    prepIdeas,
    talkingPoints,
    careerNeeds,
    referralsMade,
  ] = await Promise.all([
    admin.auth.admin.getUserById(userId),
    admin.from("11s_preferences").select("*").eq("user_id", userId).maybeSingle(),
    admin.from("11s_people").select("*").eq("user_id", userId),
    admin.from("11s_discussions").select("*").eq("user_id", userId),
    admin.from("11s_prep_ideas").select("*").eq("user_id", userId),
    admin.from("11s_talking_points").select("*").eq("user_id", userId),
    admin.from("11s_career_needs").select("*").eq("user_id", userId),
    admin.from("11s_referrals").select("*").eq("referrer_id", userId),
  ]);

  const encryptionKey = process.env.DATA_ENCRYPTION_KEY
    ? await importEncryptionKey(process.env.DATA_ENCRYPTION_KEY).catch(() => null)
    : null;

  const openText = async (value: unknown): Promise<unknown> =>
    typeof value === "string" && encryptionKey
      ? decryptText(value, encryptionKey)
      : value;
  const openList = async (value: unknown): Promise<unknown> =>
    Array.isArray(value) && encryptionKey
      ? Promise.all(
          value.map((item) =>
            typeof item === "string" ? decryptText(item, encryptionKey) : item,
          ),
        )
      : value;

  async function openFields(row: Row, fields: readonly string[]): Promise<Row> {
    const next: Row = { ...row };
    for (const field of fields) {
      if (!(field in next)) continue;
      next[field] = Array.isArray(next[field])
        ? await openList(next[field])
        : await openText(next[field]);
    }
    return next;
  }

  const text = (value: unknown): string =>
    typeof value === "string" ? value : "";
  const dateOnly = (value: unknown): string | null =>
    typeof value === "string" && value ? value : null;

  const prefs = preferences.data
    ? await openFields(preferences.data as unknown as Row, SENSITIVE_PREF_FIELDS)
    : null;

  const personIdToName = new Map<string, string>();
  const peopleOut = await Promise.all(
    (people.data ?? []).map(async (row) => {
      const open = await openFields(row as unknown as Row, SENSITIVE_PERSON_FIELDS);
      const name = text(open.name);
      personIdToName.set(row.id, name);
      return {
        name,
        role: text(open.role),
        organization: text(open.organization),
        relationship: text(row.relationship),
        linkedin_url: text(open.linkedin_url),
        background: text(open.background),
        avatar_emoji: typeof row.avatar_path === "string" ? row.avatar_path : null,
        notes_for_next_meeting: text(open.notes),
        archived_notes_from_last_meeting: text(open.last_notes),
        last_meeting_at: dateOnly(row.last_meeting_at),
        created_at: row.created_at,
      };
    }),
  );

  const discussionsOut = await Promise.all(
    (discussions.data ?? []).map(async (row) => {
      const open = await openFields(row as unknown as Row, SENSITIVE_DISCUSSION_FIELDS);
      return {
        person: personIdToName.get(row.person_id) ?? null,
        occurred_at: row.occurred_at,
        title: text(open.title),
        summary: text(open.summary),
        topics: Array.isArray(open.topics) ? open.topics : [],
        follow_ups: Array.isArray(open.follow_ups) ? open.follow_ups : [],
        mood: text(row.mood),
      };
    }),
  );

  const ideasOut = await Promise.all(
    (prepIdeas.data ?? []).map(async (row) => {
      const open = await openFields(row as unknown as Row, SENSITIVE_IDEA_FIELDS);
      return {
        person: row.person_id
          ? (personIdToName.get(row.person_id) ?? null)
          : null,
        category: text(row.category),
        kind: text(row.kind),
        title: text(open.title),
        rationale: text(open.rationale),
        prompt: text(open.prompt),
      };
    }),
  );

  const talkingPointsOut = await Promise.all(
    (talkingPoints.data ?? []).map(async (row) => {
      const open = await openFields(row as unknown as Row, ["body"]);
      return {
        person: personIdToName.get(row.person_id) ?? null,
        body: text(open.body),
        source: text(row.source),
        created_at: row.created_at,
      };
    }),
  );

  const needsOut = await Promise.all(
    (careerNeeds.data ?? []).map(async (row) => {
      const open = await openFields(row as unknown as Row, ["body"]);
      return {
        body: text(open.body),
        status: text(row.status),
        created_at: row.created_at,
      };
    }),
  );

  const authUser = userResult.data.user;
  const payload = {
    exported_at: new Date().toISOString(),
    account: {
      email: authUser?.email ?? null,
      created_at: authUser?.created_at ?? null,
    },
    plan: {
      plan: prefs ? text(prefs.plan) : "free",
      subscription_status: prefs ? text(prefs.subscription_status) : "none",
      current_period_end: prefs ? prefs.current_period_end ?? null : null,
    },
    preferences: prefs
      ? {
          locale: text(prefs.locale),
          context_bank: text(prefs.context_bank),
          general_prep_opening: text(prefs.general_prep_opening),
          general_prep_source: text(prefs.general_prep_source) || null,
          career: {
            direction: text(prefs.career_direction),
            target_role: text(prefs.career_target_role),
            timeline: text(prefs.career_timeline),
            brag_doc: text(prefs.brag_doc),
          },
        }
      : null,
    people: peopleOut,
    discussions: discussionsOut,
    talking_points: talkingPointsOut,
    prep_ideas: ideasOut,
    career_needs: needsOut,
    referrals: {
      invited_count: (referralsMade.data ?? []).length,
      free_months_redeemed: prefs?.referral_redeemed_count ?? 0,
    },
  };

  const date = new Date().toISOString().slice(0, 10);
  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="11s-export-${date}.json"`,
      "Cache-Control": "private, no-store",
    },
  });
}
