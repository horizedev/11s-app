import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ResetPasswordForm } from "@/components/reset-password-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Reset password — 11s / 重設密碼",
  description: "Choose a new password for your 11s account.",
};

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  // The recovery link signs the user in through /auth/callback before
  // landing here, so a valid session is required to continue.
  if (error || !data?.claims?.sub) {
    redirect("/login?error=reset-link-invalid");
  }

  return <ResetPasswordForm />;
}
