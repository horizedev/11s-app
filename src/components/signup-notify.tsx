"use client";

import { useEffect } from "react";

const SIGNUP_NOTIFY_KEY = "11s.signupNotified.v1";

/**
 * Fires the signup Telegram notification once from the workspace, covering
 * flows that pass through /auth/callback (Google OAuth, email confirmation).
 * The API route is idempotent per account, so repeats across devices are
 * safe; the localStorage flag just saves a request.
 */
export function SignupNotify() {
  useEffect(() => {
    try {
      if (window.localStorage.getItem(SIGNUP_NOTIFY_KEY) === "1") return;
    } catch {
      // ignore storage errors
    }

    fetch("/api/notify/signup", { method: "POST" })
      .then(async (response) => {
        const result = (await response.json().catch(() => null)) as {
          notified?: boolean;
        } | null;
        // Only cache a definitive "not new / already sent" outcome when the
        // call succeeded; failures should be retried on the next visit.
        if (response.ok) {
          try {
            window.localStorage.setItem(SIGNUP_NOTIFY_KEY, "1");
          } catch {
            // ignore storage errors
          }
        }
        return result;
      })
      .catch(() => {
        // Best effort; the next visit retries.
      });
  }, []);

  return null;
}
