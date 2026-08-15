"use client";

import { useEffect } from "react";

/**
 * Fallback trigger for the signup Telegram notification, covering
 * email+password sign-up when email confirmation is disabled (no
 * /auth/callback visit). The API route is idempotent per account via the
 * signup_notified_at guard, so repeat calls across sessions, devices, and
 * accounts sharing a browser are all safe.
 */
export function SignupNotify() {
  useEffect(() => {
    fetch("/api/notify/signup", { method: "POST" }).catch(() => {
      // Best effort; the next workspace visit retries.
    });
  }, []);

  return null;
}
