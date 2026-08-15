import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminPage, type AdminStats, type AdminUserRow } from "@/components/admin-page";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin statistics — 11s / 管理統計",
  description: "11s workspace statistics. 11s 工作區統計數據。",
};

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_ROWS = 50_000;

function startOfUtcDay(now: number): string {
  const date = new Date(now);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
}

function startOfUtcMonth(now: number): string {
  const date = new Date(now);
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
}

export default async function AdminRoute() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/login?next=/admin");
  }

  const { data: preferences } = await supabase
    .from("11s_preferences")
    .select("is_admin")
    .eq("user_id", data.claims.sub)
    .maybeSingle();

  if (preferences?.is_admin !== true) {
    redirect("/workspace");
  }

  const stats = await loadAdminStats();
  return <AdminPage stats={stats} />;
}

async function loadAdminStats(): Promise<AdminStats> {
  const admin = createAdminClient();
  const now = Date.now();
  const todayStart = startOfUtcDay(now);
  const monthStart = startOfUtcMonth(now);
  const thirtyDaysAgo = new Date(now - 30 * DAY_MS).toISOString();

  const [
    usersResult,
    activeSubsResult,
    peopleResult,
    usageResult,
    discussionsTodayResult,
    peopleTodayResult,
    discussionsMonthResult,
    peopleMonthResult,
  ] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    admin
      .from("11s_preferences")
      .select("user_id", { count: "exact", head: true })
      .in("subscription_status", ["active", "trialing"]),
    admin.from("11s_people").select("user_id").limit(MAX_ROWS),
    admin
      .from("11s_prep_usage")
      .select("user_id, created_at, total_tokens")
      .limit(MAX_ROWS),
    admin.from("11s_discussions").select("user_id").gte("created_at", todayStart),
    admin.from("11s_people").select("user_id").gte("created_at", todayStart),
    admin
      .from("11s_discussions")
      .select("user_id")
      .gte("created_at", thirtyDaysAgo),
    admin.from("11s_people").select("user_id").gte("created_at", thirtyDaysAgo),
  ]);

  const users = usersResult.data?.users ?? [];
  const emailsById = new Map(
    users.map((user) => [user.id, user.email ?? ""]),
  );

  type UsageRow = {
    user_id: string;
    created_at: string;
    total_tokens: number | null;
  };
  const usageRows: UsageRow[] = usageResult.data ?? [];

  let creditsToday = 0;
  let creditsMonth = 0;
  let tokensToday = 0;
  let tokensMonth = 0;
  let tokensTotal = 0;
  const activeTodaySet = new Set<string>();
  const activeMonthSet = new Set<string>();
  const creditsByUser = new Map<
    string,
    { today: number; month: number; total: number; tokens: number }
  >();

  for (const row of usageRows) {
    const isToday = row.created_at >= todayStart;
    const isMonth = row.created_at >= monthStart;
    const isThirtyDays = row.created_at >= thirtyDaysAgo;
    const tokens = row.total_tokens ?? 0;

    if (isToday) {
      creditsToday += 1;
      tokensToday += tokens;
      activeTodaySet.add(row.user_id);
    }
    if (isMonth) {
      creditsMonth += 1;
      tokensMonth += tokens;
    }
    if (isThirtyDays) activeMonthSet.add(row.user_id);
    tokensTotal += tokens;

    const current = creditsByUser.get(row.user_id) ?? {
      today: 0,
      month: 0,
      total: 0,
      tokens: 0,
    };
    if (isToday) current.today += 1;
    if (isMonth) current.month += 1;
    current.total += 1;
    current.tokens += tokens;
    creditsByUser.set(row.user_id, current);
  }

  for (const row of discussionsTodayResult.data ?? []) {
    activeTodaySet.add(row.user_id);
  }
  for (const row of peopleTodayResult.data ?? []) {
    activeTodaySet.add(row.user_id);
  }
  for (const row of discussionsMonthResult.data ?? []) {
    activeMonthSet.add(row.user_id);
  }
  for (const row of peopleMonthResult.data ?? []) {
    activeMonthSet.add(row.user_id);
  }

  const peopleByUser = new Map<string, number>();
  for (const row of peopleResult.data ?? []) {
    peopleByUser.set(row.user_id, (peopleByUser.get(row.user_id) ?? 0) + 1);
  }

  const peopleCounts = [...peopleByUser.values()];
  const peopleTotal = peopleCounts.reduce((sum, count) => sum + count, 0);

  const perUser: AdminUserRow[] = users
    .map((user) => {
      const credits = creditsByUser.get(user.id);
      return {
        id: user.id,
        email: emailsById.get(user.id) ?? "",
        createdAt: user.created_at,
        people: peopleByUser.get(user.id) ?? 0,
        creditsToday: credits?.today ?? 0,
        creditsMonth: credits?.month ?? 0,
        creditsTotal: credits?.total ?? 0,
        tokensTotal: credits?.tokens ?? 0,
      };
    })
    .toSorted(
      (a, b) =>
        b.creditsTotal - a.creditsTotal ||
        b.people - a.people ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const stats: AdminStats = {
    totalUsers:
      "total" in usersResult.data && typeof usersResult.data.total === "number"
        ? usersResult.data.total
        : users.length,
    activeSubscriptions: activeSubsResult.count ?? 0,
    activeToday: activeTodaySet.size,
    activeMonth: activeMonthSet.size,
    peopleTotal,
    peopleAvg: users.length > 0 ? peopleTotal / users.length : 0,
    peopleMax: peopleCounts.length > 0 ? Math.max(...peopleCounts) : 0,
    creditsToday,
    creditsMonth,
    creditsTotal: usageRows.length,
    tokensToday,
    tokensMonth,
    tokensTotal,
    perUser,
  };

  return stats;
}
