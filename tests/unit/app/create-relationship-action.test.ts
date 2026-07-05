import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  redirectError,
  redirect,
  createClient,
  createRelationship,
  getBillingUsage,
  trackProductEvent,
} = vi.hoisted(() => ({
  redirectError: Object.assign(new Error("NEXT_REDIRECT"), {
    digest: "NEXT_REDIRECT;replace;/app/relationships/rel-1;307;",
  }),
  redirect: vi.fn(),
  createClient: vi.fn(),
  createRelationship: vi.fn(),
  getBillingUsage: vi.fn(),
  trackProductEvent: vi.fn(),
}));

redirect.mockImplementation(() => {
  throw redirectError;
});

vi.mock("next/navigation", () => ({
  redirect,
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient,
}));

vi.mock("@/lib/relationships/repository", () => ({
  createRelationship,
}));

vi.mock("@/lib/analytics/repository", () => ({
  trackProductEvent,
}));

vi.mock("@/lib/billing/repository", () => ({
  getBillingUsage,
}));

import { createRelationshipAction } from "@/app/app/relationships/new/actions";

describe("createRelationshipAction", () => {
  beforeEach(() => {
    redirect.mockClear();
    createClient.mockReset();
    createRelationship.mockReset();
    getBillingUsage.mockReset();
    trackProductEvent.mockReset();

    createClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-1" } },
        }),
      },
      from: vi.fn(),
    });
    createRelationship.mockResolvedValue({ id: "rel-1" });
    getBillingUsage.mockResolvedValue({
      plan: "pro",
      canCreateRelationship: true,
      canGenerateAi: true,
    });
    trackProductEvent.mockResolvedValue(undefined);
  });

  it("redirects to the new relationship after a successful creation", async () => {
    const formData = new FormData();
    formData.set("personName", "Alex Morgan");
    formData.set("relationshipType", "peer");
    formData.set("personContext", "");
    formData.set("relationshipGoal", "");
    formData.set("cadence", "");

    await expect(
      createRelationshipAction(
        {
          fieldErrors: {},
          formError: null,
          values: {
            personName: "",
            relationshipType: "",
            personContext: "",
            relationshipGoal: "",
            cadence: "",
          },
        },
        formData,
      ),
    ).rejects.toBe(redirectError);

    expect(redirect).toHaveBeenCalledWith("/app/relationships/rel-1");
  });
});
