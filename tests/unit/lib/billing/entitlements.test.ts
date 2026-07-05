import { describe, expect, it } from "vitest";

import {
  FREE_AI_GENERATIONS_PER_MONTH,
  FREE_MEETINGS_LIMIT,
  FREE_RELATIONSHIPS_LIMIT,
  PRO_AI_GENERATIONS_PER_MONTH,
  resolvePlan,
  evaluateUsage,
} from "@/lib/billing/entitlements";

import type { SubscriptionStatus } from "@/lib/billing/plans";

describe("billing entitlements", () => {
  it("treats missing and inactive subscriptions as free", () => {
    expect(resolvePlan(null)).toBe("free");
    expect(resolvePlan({ plan: "pro", status: "canceled" })).toBe("free");
    expect(resolvePlan({ plan: "pro", status: "past_due" })).toBe("free");
  });

  it("resolves active and trialing pro subscriptions as pro", () => {
    expect(resolvePlan({ plan: "pro", status: "active" })).toBe("pro");
    expect(resolvePlan({ plan: "pro", status: "trialing" })).toBe("pro");
  });

  it("applies free relationship, meeting, and AI caps", () => {
    const usage = evaluateUsage({
      plan: "free",
      activeRelationships: FREE_RELATIONSHIPS_LIMIT,
      totalMeetings: FREE_MEETINGS_LIMIT,
      monthlyAiGenerations: FREE_AI_GENERATIONS_PER_MONTH,
    });

    expect(usage.canCreateRelationship).toBe(false);
    expect(usage.canCreateMeeting).toBe(false);
    expect(usage.canGenerateAi).toBe(false);
    expect(usage.relationshipLimit).toBe(FREE_RELATIONSHIPS_LIMIT);
    expect(usage.meetingLimit).toBe(FREE_MEETINGS_LIMIT);
    expect(usage.aiGenerationLimit).toBe(FREE_AI_GENERATIONS_PER_MONTH);
  });

  it("keeps pro unlimited for relationships and meetings but capped for AI", () => {
    const usage = evaluateUsage({
      plan: "pro",
      activeRelationships: 500,
      totalMeetings: 500,
      monthlyAiGenerations: PRO_AI_GENERATIONS_PER_MONTH,
    });

    expect(usage.canCreateRelationship).toBe(true);
    expect(usage.canCreateMeeting).toBe(true);
    expect(usage.canGenerateAi).toBe(false);
    expect(usage.relationshipLimit).toBeNull();
    expect(usage.meetingLimit).toBeNull();
    expect(usage.aiGenerationLimit).toBe(PRO_AI_GENERATIONS_PER_MONTH);
  });

  it("does not recognize inactive Stripe statuses as paid", () => {
    const inactiveStatuses: SubscriptionStatus[] = [
      "inactive",
      "incomplete",
      "incomplete_expired",
      "past_due",
      "canceled",
      "unpaid",
    ];

    for (const status of inactiveStatuses) {
      expect(resolvePlan({ plan: "pro", status })).toBe("free");
    }
  });
});
