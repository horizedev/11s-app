import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { OneOnOneApp } from "@/components/one-on-one-app";
import { ReferralClaim } from "@/components/referral-claim";
import { createClient } from "@/lib/supabase/server";
import {
  loadWorkspace,
  type WorkspaceSnapshot,
} from "@/lib/workspace-data";

export const metadata: Metadata = {
  title: "Workspace — 11s / 工作區",
  description: "Prepare for your next conversation. 為下一次對話做好準備。",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function WorkspacePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/login?next=/workspace");
  }

  const params = await searchParams;
  const upgraded = params.upgraded === "1";

  // Load the first snapshot with the already-verified server session so the
  // page does not depend on a fresh browser-side token. If this fails, the
  // client falls back to loading (with retries) on mount.
  let initialSnapshot: WorkspaceSnapshot | null = null;
  try {
    initialSnapshot = await loadWorkspace(supabase);
  } catch (loadFailure) {
    console.error("Initial workspace load failed", loadFailure);
  }

  return (
    <>
      <ReferralClaim />
      <OneOnOneApp
        userId={data.claims.sub}
        userEmail={
          typeof data.claims.email === "string" ? data.claims.email : undefined
        }
        initialSnapshot={initialSnapshot}
        justUpgraded={upgraded}
      />
    </>
  );
}
