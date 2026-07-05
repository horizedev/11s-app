import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const redirect = vi.fn((url: string) => {
    const error = new Error("NEXT_REDIRECT");
    (error as Error & { digest: string }).digest = `NEXT_REDIRECT;replace;${url};307;`;
    throw error;
  });

  return {
    createClient: vi.fn(),
    createRelationship: vi.fn(),
    getBillingUsage: vi.fn(),
    trackProductEvent: vi.fn(),
    redirect,
  };
});

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: mocks.createClient,
}));

vi.mock("@/lib/relationships/repository", () => ({
  createRelationship: mocks.createRelationship,
}));

vi.mock("@/lib/analytics/repository", () => ({
  trackProductEvent: mocks.trackProductEvent,
}));

vi.mock("@/lib/billing/repository", () => ({
  getBillingUsage: mocks.getBillingUsage,
}));

import { getEmptyRelationshipFormState } from "@/lib/relationships/validation";

describe("createRelationshipAction", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.createClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "user-1",
            },
          },
        }),
      },
      from: vi.fn(() => ({
        insert: vi.fn().mockResolvedValue({ error: null }),
      })),
    });
    mocks.createRelationship.mockResolvedValue({
      id: "relationship-1",
    });
    mocks.getBillingUsage.mockResolvedValue({
      canCreateRelationship: true,
    });
    mocks.trackProductEvent.mockResolvedValue(undefined);
  });

  it("rethrows the redirect after a successful relationship creation", async () => {
    const { createRelationshipAction } = await import("@/app/app/relationships/new/actions");
    const formData = new FormData();
    formData.set("personName", "Soonam");
    formData.set("relationshipType", "manager");

    await expect(
      createRelationshipAction(getEmptyRelationshipFormState(), formData),
    ).rejects.toMatchObject({
      digest: "NEXT_REDIRECT;replace;/app/relationships/relationship-1;307;",
    });

    expect(mocks.createRelationship).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
      }),
    );
    expect(mocks.trackProductEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        entityId: "relationship-1",
        eventName: "relationship_created",
      }),
    );
  });
});
