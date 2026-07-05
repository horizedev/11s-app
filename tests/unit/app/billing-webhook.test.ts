import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  constructStripeWebhookEvent: vi.fn(),
  createAdminClient: vi.fn(),
  ensureStripeCustomerForUser: vi.fn(),
  upsertSubscriptionFromStripe: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: mocks.createAdminClient,
}));

vi.mock("@/lib/billing/stripe", () => ({
  constructStripeWebhookEvent: mocks.constructStripeWebhookEvent,
}));

vi.mock("@/lib/billing/repository", () => ({
  ensureStripeCustomerForUser: mocks.ensureStripeCustomerForUser,
  upsertSubscriptionFromStripe: mocks.upsertSubscriptionFromStripe,
}));

import { POST } from "@/app/api/stripe/webhook/route";

describe("Stripe webhook route", () => {
  it("rejects requests without a Stripe signature", async () => {
    const response = await POST(new Request("https://app.test/api/stripe/webhook", { method: "POST", body: "{}" }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Missing Stripe signature." });
  });

  it("upserts subscription records for subscription events", async () => {
    const supabase = {};
    mocks.createAdminClient.mockReturnValue(supabase);
    mocks.constructStripeWebhookEvent.mockResolvedValue({
      type: "customer.subscription.updated",
      data: { object: { id: "sub_123", customer: "cus_123", status: "active", items: { data: [] } } },
    });
    mocks.upsertSubscriptionFromStripe.mockResolvedValue(undefined);

    const response = await POST(
      new Request("https://app.test/api/stripe/webhook", {
        method: "POST",
        body: "{}",
        headers: { "stripe-signature": "sig_123" },
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ received: true });
    expect(mocks.upsertSubscriptionFromStripe).toHaveBeenCalledWith({
      supabase,
      subscription: expect.objectContaining({ id: "sub_123" }),
    });
  });

  it("records checkout customer ownership from checkout completion metadata", async () => {
    const supabase = {};
    mocks.createAdminClient.mockReturnValue(supabase);
    mocks.constructStripeWebhookEvent.mockResolvedValue({
      type: "checkout.session.completed",
      data: { object: { customer: "cus_123", metadata: { user_id: "user-1" } } },
    });

    const response = await POST(
      new Request("https://app.test/api/stripe/webhook", {
        method: "POST",
        body: "{}",
        headers: { "stripe-signature": "sig_123" },
      }),
    );

    expect(response.status).toBe(200);
    expect(mocks.ensureStripeCustomerForUser).toHaveBeenCalledWith({
      supabase,
      userId: "user-1",
      stripeCustomerId: "cus_123",
    });
  });
});
