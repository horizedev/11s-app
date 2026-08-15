import { decryptText, importEncryptionKey } from "@/lib/crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Exports every row the signed-in user owns across all 11s tables as a
 * single JSON download (GDPR-style data portability). Sensitive fields are
 * decrypted so the export is human-readable.
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
    prepUsage,
    referralsMade,
    referralsReceived,
  ] = await Promise.all([
    admin.auth.admin.getUserById(userId),
    admin.from("11s_preferences").select("*").eq("user_id", userId).maybeSingle(),
    admin.from("11s_people").select("*").eq("user_id", userId),
    admin.from("11s_discussions").select("*").eq("user_id", userId),
    admin.from("11s_prep_ideas").select("*").eq("user_id", userId),
    admin.from("11s_talking_points").select("*").eq("user_id", userId),
    admin.from("11s_career_needs").select("*").eq("user_id", userId),
    admin.from("11s_prep_usage").select("*").eq("user_id", userId),
    admin.from("11s_referrals").select("*").eq("referrer_id", userId),
    admin.from("11s_referrals").select("*").eq("referred_user_id", userId),
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
  const openRow = async <T extends Record<string, unknown>>(
    row: T,
    fields: string[],
  ): Promise<T> => {
    const next = { ...row };
    for (const field of fields) {
      if (field in next) {
        next[field as keyof T] = (Array.isArray(next[field])
          ? await openList(next[field])
          : await openText(next[field])) as T[keyof T];
      }
    }
    return next;
  };

  const PEOPLE_FIELDS = ["name", "role", "organization", "notes", "last_notes", "background", "linkedin_url", "prep_opening"];
  const DISCUSSION_FIELDS = ["title", "summary", "topics", "follow_ups"];
  const IDEA_FIELDS = ["title", "rationale", "prompt"];
  const POINT_FIELDS = ["body"];
  const NEED_FIELDS = ["body"];
  const PREF_FIELDS = ["context_bank", "general_prep_opening", "brag_doc", "career_direction", "career_target_role", "career_timeline"];

  const authUser = userResult.data.user;
  const payload = {
    exported_at: new Date().toISOString(),
    account: authUser
      ? {
          id: authUser.id,
          email: authUser.email,
          created_at: authUser.created_at,
          last_sign_in_at: authUser.last_sign_in_at,
          providers: authUser.app_metadata?.providers ?? [],
        }
      : { id: userId },
    preferences: preferences.data
      ? await openRow(preferences.data, PREF_FIELDS)
      : null,
    people: await Promise.all((people.data ?? []).map((row) => openRow(row, PEOPLE_FIELDS))),
    discussions: await Promise.all((discussions.data ?? []).map((row) => openRow(row, DISCUSSION_FIELDS))),
    prep_ideas: await Promise.all((prepIdeas.data ?? []).map((row) => openRow(row, IDEA_FIELDS))),
    talking_points: await Promise.all((talkingPoints.data ?? []).map((row) => openRow(row, POINT_FIELDS))),
    career_needs: await Promise.all((careerNeeds.data ?? []).map((row) => openRow(row, NEED_FIELDS))),
    prep_usage: prepUsage.data ?? [],
    referrals_made: referralsMade.data ?? [],
    referred_by: referralsReceived.data ?? [],
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
