import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type RedeemResult = {
  ok: boolean;
  error?: string;
  balance?: number;
  current_period_end?: string;
};

export async function POST() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: rpcData, error: rpcError } = await admin.rpc(
    "11s_redeem_referral_credit",
    { p_user_id: data.claims.sub },
  );

  if (rpcError) {
    console.error("Referral redemption failed", rpcError);
    return Response.json(
      { error: "Could not redeem referral credit." },
      { status: 500 },
    );
  }

  const result = rpcData as RedeemResult | null;
  if (!result?.ok) {
    const status = result?.error === "already_pro" ? 409 : 400;
    return Response.json(
      {
        error: result?.error ?? "redeem_failed",
        balance: result?.balance ?? null,
      },
      { status },
    );
  }

  return Response.json({
    balance: result.balance,
    currentPeriodEnd: result.current_period_end ?? null,
  });
}
