import { describe, expect, it } from "vitest";

import { mapStripeSubscriptionToRecord } from "@/lib/billing/stripe-events";

describe("Stripe subscription event mapping", () => {
  it("maps active pro subscription data into a subscription record", () => {
    const mapped = mapStripeSubscriptionToRecord({
      id: "sub_123",
      customer: "cus_123",
      status: "active",
      current_period_end: 1_800_000_000,
      items: {
        data: [
          {
            price: { id: "price_pro" },
          },
        ],
      },
    });

    expect(mapped).toEqual({
      stripeCustomerId: "cus_123",
      stripeSubscriptionId: "sub_123",
      stripePriceId: "price_pro",
      plan: "pro",
      status: "active",
      currentPeriodEnd: "2027-01-15T08:00:00.000Z",
    });
  });

  it("treats canceled subscriptions as free while preserving Stripe ids", () => {
    const mapped = mapStripeSubscriptionToRecord({
      id: "sub_123",
      customer: "cus_123",
      status: "canceled",
      current_period_end: null,
      items: { data: [] },
    });

    expect(mapped.plan).toBe("free");
    expect(mapped.status).toBe("canceled");
    expect(mapped.currentPeriodEnd).toBeNull();
  });

  it("reads expanded customer objects and unknown statuses safely", () => {
    const mapped = mapStripeSubscriptionToRecord({
      id: "sub_123",
      customer: { id: "cus_expanded" },
      status: "paused",
      items: { data: [{ price: { id: "price_pro" } }] },
    });

    expect(mapped.stripeCustomerId).toBe("cus_expanded");
    expect(mapped.plan).toBe("free");
    expect(mapped.status).toBe("inactive");
  });
});
