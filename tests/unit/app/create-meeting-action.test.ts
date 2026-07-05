import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  redirectError,
  redirect,
  createClient,
  getRelationshipById,
  createMeeting,
  getBillingUsage,
  trackProductEvent,
} = vi.hoisted(() => ({
  redirectError: Object.assign(new Error("NEXT_REDIRECT"), {
    digest: "NEXT_REDIRECT;replace;/app/relationships/rel-1/meetings/meeting-1;307;",
  }),
  redirect: vi.fn(),
  createClient: vi.fn(),
  getRelationshipById: vi.fn(),
  createMeeting: vi.fn(),
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
  getRelationshipById,
}));

vi.mock("@/lib/meetings/repository", () => ({
  createMeeting,
}));

vi.mock("@/lib/analytics/repository", () => ({
  trackProductEvent,
}));

vi.mock("@/lib/billing/repository", () => ({
  getBillingUsage,
}));

import { createMeetingAction } from "@/app/app/relationships/[relationshipId]/meetings/new/actions";

describe("createMeetingAction", () => {
  beforeEach(() => {
    redirect.mockClear();
    createClient.mockReset();
    getRelationshipById.mockReset();
    createMeeting.mockReset();
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
    getRelationshipById.mockResolvedValue({ id: "rel-1", personName: "Alex" });
    createMeeting.mockResolvedValue({ id: "meeting-1" });
    getBillingUsage.mockResolvedValue({
      plan: "pro",
      canCreateMeeting: true,
      canGenerateAi: true,
    });
    trackProductEvent.mockResolvedValue(undefined);
  });

  it("redirects to the new meeting after a successful draft creation", async () => {
    const formData = new FormData();
    formData.set("purpose", "Weekly sync");
    formData.set("scheduledAt", "");

    await expect(
      createMeetingAction("rel-1", {
        fieldErrors: {},
        formError: null,
        values: { purpose: "", scheduledAt: "" },
      }, formData),
    ).rejects.toBe(redirectError);

    expect(redirect).toHaveBeenCalledWith("/app/relationships/rel-1/meetings/meeting-1");
  });
});
