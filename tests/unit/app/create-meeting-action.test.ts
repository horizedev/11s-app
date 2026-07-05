import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  redirectError,
  redirect,
  createClient,
  getRelationshipById,
  createMeeting,
  trackProductEvent,
} = vi.hoisted(() => ({
  redirectError: new Error("NEXT_REDIRECT"),
  redirect: vi.fn(),
  createClient: vi.fn(),
  getRelationshipById: vi.fn(),
  createMeeting: vi.fn(),
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

import { createMeetingAction } from "@/app/app/relationships/[relationshipId]/meetings/new/actions";

describe("createMeetingAction", () => {
  beforeEach(() => {
    redirect.mockClear();
    createClient.mockReset();
    getRelationshipById.mockReset();
    createMeeting.mockReset();
    trackProductEvent.mockReset();

    createClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-1" } },
        }),
      },
    });
    getRelationshipById.mockResolvedValue({ id: "rel-1", personName: "Alex" });
    createMeeting.mockResolvedValue({ id: "meeting-1" });
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
