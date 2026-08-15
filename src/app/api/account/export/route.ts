import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Exports every row the signed-in user owns across all 11s tables as a
 * single JSON download (GDPR-style data portability).
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
    preferences: preferences.data ?? null,
    people: people.data ?? [],
    discussions: discussions.data ?? [],
    prep_ideas: prepIdeas.data ?? [],
    talking_points: talkingPoints.data ?? [],
    career_needs: careerNeeds.data ?? [],
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
