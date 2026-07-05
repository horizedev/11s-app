import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const redirect = vi.fn((url: string) => {
    const error = new Error("NEXT_REDIRECT");
    (error as Error & { digest: string }).digest = `NEXT_REDIRECT;replace;${url};307;`;
    throw error;
  });

  return {
    createCheckoutSession: vi.fn(),
    createClient: vi.fn(),
    createCustomerPortalSession: vi.fn(),
    getOrCreateStripeCustomerId: vi.fn(),
    getUserSubscription: vi.fn(),
    redirect,
  };
});

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: mocks.createClient,
}));

vi.mock("@/lib/billing/repository", () => ({
  getOrCreateStripeCustomerId: mocks.getOrCreateStripeCustomerId,
  getUserSubscription: mocks.getUserSubscription,
}));

vi.mock("@/lib/billing/stripe", () => ({
  createCheckoutSession: mocks.createCheckoutSession,
  createCustomerPortalSession: mocks.createCustomerPortalSession,
}));

import { startCheckoutAction, openCustomerPortalAction } from "@/app/app/billing/actions";

describe("billing server actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-1", email: "user@example.com" } },
        }),
      },
    });
    mocks.getOrCreateStripeCustomerId.mockResolvedValue("cus_123");
    mocks.getUserSubscription.mockResolvedValue({ stripeCustomerId: "cus_123" });
    mocks.createCheckoutSession.mockResolvedValue("https://checkout.stripe.test/session");
    mocks.createCustomerPortalSession.mockResolvedValue("https://billing.stripe.test/session");
  });

  it("redirects unauthenticated users to login before checkout", async () => {
    mocks.createClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
    });

    await expect(startCheckoutAction()).rejects.toMatchObject({
      digest: "NEXT_REDIRECT;replace;/auth/login?next=%2Fapp%2Fbilling;307;",
    });
    expect(mocks.createCheckoutSession).not.toHaveBeenCalled();
  });

  it("creates a Stripe checkout session and redirects to it", async () => {
    await expect(startCheckoutAction()).rejects.toMatchObject({
      digest: "NEXT_REDIRECT;replace;https://checkout.stripe.test/session;307;",
    });

    expect(mocks.getOrCreateStripeCustomerId).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "user-1", email: "user@example.com" }),
    );
    expect(mocks.createCheckoutSession).toHaveBeenCalledWith({
      customerId: "cus_123",
      userId: "user-1",
    });
  });

  it("opens the customer portal for users with a Stripe customer", async () => {
    await expect(openCustomerPortalAction()).rejects.toMatchObject({
      digest: "NEXT_REDIRECT;replace;https://billing.stripe.test/session;307;",
    });

    expect(mocks.createCustomerPortalSession).toHaveBeenCalledWith({
      customerId: "cus_123",
    });
  });
});
