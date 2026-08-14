"use client";

import { useEffect } from "react";

import { REFERRAL_COOKIE } from "@/lib/referrals";

/**
 * Fires referral attribution once when the referral cookie is present,
 * covering sign-up flows that never pass through /auth/callback. The API
 * route clears the cookie afterwards.
 */
export function ReferralClaim() {
  useEffect(() => {
    if (!document.cookie.includes(`${REFERRAL_COOKIE}=`)) return;
    fetch("/api/referrals/claim", { method: "POST" }).catch(() => {
      // Best effort; the cookie persists so a later visit retries.
    });
  }, []);

  return null;
}
