import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database.types";

export const REFERRAL_COOKIE = "11s_ref";
/** Referral links stay attributable for 30 days after the click. */
export const REFERRAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
/** A signup only counts as a referral within this window after user creation. */
const NEW_USER_WINDOW_MS = 24 * 60 * 60 * 1000;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Referral codes are the referrer's user id, so no code table is needed. */
export function isReferralCode(value: string | null | undefined): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

/**
 * Attribute a freshly signed-up user to a referrer. No-ops unless the
 * account was created recently, the code is valid, and it is not a
 * self-referral. The unique constraint on referred_user_id makes repeat
 * calls idempotent. Runs with a service-role client because authenticated
 * users may not insert referral rows.
 */
export async function claimReferral(
  admin: SupabaseClient<Database>,
  userId: string,
  referralCode: string,
): Promise<void> {
  if (!isReferralCode(referralCode) || referralCode === userId) return;

  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data.user?.created_at) return;

  const createdAt = new Date(data.user.created_at).getTime();
  if (!Number.isFinite(createdAt) || Date.now() - createdAt > NEW_USER_WINDOW_MS) {
    return;
  }

  await admin
    .from("11s_referrals")
    .upsert(
      { referrer_id: referralCode, referred_user_id: userId },
      { onConflict: "referred_user_id", ignoreDuplicates: true },
    );
}
