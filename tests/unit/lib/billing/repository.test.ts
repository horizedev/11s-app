import { describe, expect, it, vi } from "vitest";

import {
  countActiveRelationships,
  countMonthlyAiGenerations,
  countTotalMeetings,
  getBillingUsage,
} from "@/lib/billing/repository";

function makeCountClient(count: number, error: unknown = null) {
  const maybeSingle = vi.fn();
  const order = vi.fn();
  const gte = vi.fn();
  const eq = vi.fn();
  const select = vi.fn();
  const from = vi.fn(() => ({ select }));

  select.mockReturnValue({ eq });
  eq.mockImplementation(() => ({ eq, gte, order }));
  gte.mockReturnValue({ order });
  order.mockResolvedValue({ count, error });
  maybeSingle.mockResolvedValue({ data: null, error: null });

  return { from, select, eq, gte, order, maybeSingle };
}

describe("billing repository usage counters", () => {
  it("counts active relationships with Supabase exact count", async () => {
    const client = makeCountClient(1);

    await expect(
      countActiveRelationships({ supabase: client as never, userId: "user-1" }),
    ).resolves.toBe(1);

    expect(client.from).toHaveBeenCalledWith("relationships");
    expect(client.select).toHaveBeenCalledWith("id", {
      count: "exact",
      head: true,
    });
    expect(client.eq).toHaveBeenCalledWith("status", "active");
  });

  it("counts total meetings with Supabase exact count", async () => {
    const client = makeCountClient(3);

    await expect(
      countTotalMeetings({ supabase: client as never, userId: "user-1" }),
    ).resolves.toBe(3);

    expect(client.from).toHaveBeenCalledWith("meetings");
  });

  it("counts monthly AI generations from the start of the UTC month", async () => {
    const client = makeCountClient(5);

    await expect(
      countMonthlyAiGenerations({
        supabase: client as never,
        userId: "user-1",
        now: new Date("2026-07-20T12:30:00.000Z"),
      }),
    ).resolves.toBe(5);

    expect(client.from).toHaveBeenCalledWith("ai_generations");
    expect(client.eq).toHaveBeenCalledWith("status", "succeeded");
    expect(client.gte).toHaveBeenCalledWith(
      "created_at",
      "2026-07-01T00:00:00.000Z",
    );
  });

  it("combines subscription and usage into an entitlement snapshot", async () => {
    const query = {
      maybeSingle: vi.fn().mockResolvedValue({
        data: { plan: "pro", status: "active" },
        error: null,
      }),
      order: vi
        .fn()
        .mockResolvedValueOnce({ count: 4, error: null })
        .mockResolvedValueOnce({ count: 8, error: null })
        .mockResolvedValueOnce({ count: 9, error: null }),
      gte: vi.fn(),
      eq: vi.fn(),
      select: vi.fn(),
    };
    query.select
      .mockReturnValueOnce({ eq: query.eq })
      .mockReturnValue({ eq: query.eq });
    query.eq.mockReturnValue({
      eq: query.eq,
      gte: query.gte,
      maybeSingle: query.maybeSingle,
      order: query.order,
    });
    query.gte.mockReturnValue({ order: query.order });
    const supabase = { from: vi.fn(() => ({ select: query.select })) };

    const snapshot = await getBillingUsage({
      supabase: supabase as never,
      userId: "user-1",
      now: new Date("2026-07-20T12:30:00.000Z"),
    });

    expect(snapshot.plan).toBe("pro");
    expect(snapshot.activeRelationships).toBe(4);
    expect(snapshot.totalMeetings).toBe(8);
    expect(snapshot.monthlyAiGenerations).toBe(9);
    expect(snapshot.canCreateRelationship).toBe(true);
  });
});
