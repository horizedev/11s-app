import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  redirectError,
  redirect,
  createClient,
  getMeetingById,
  createAgendaItem,
  trackProductEvent,
} = vi.hoisted(() => ({
  redirectError: Object.assign(new Error("NEXT_REDIRECT"), {
    digest: "NEXT_REDIRECT;replace;/app/relationships/rel-1/meetings/meeting-1;307;",
  }),
  redirect: vi.fn(),
  createClient: vi.fn(),
  getMeetingById: vi.fn(),
  createAgendaItem: vi.fn(),
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

vi.mock("@/lib/meetings/repository", () => ({
  getMeetingById,
}));

vi.mock("@/lib/agenda/repository", () => ({
  createAgendaItem,
  listAgendaItemsForMeeting: vi.fn(),
}));

vi.mock("@/lib/analytics/repository", () => ({
  trackProductEvent,
}));

import { createAgendaItemAction } from "@/app/app/relationships/[relationshipId]/meetings/[meetingId]/actions";

describe("createAgendaItemAction", () => {
  beforeEach(() => {
    redirect.mockClear();
    createClient.mockReset();
    getMeetingById.mockReset();
    createAgendaItem.mockReset();
    trackProductEvent.mockReset();

    createClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-1" } },
        }),
      },
    });
    getMeetingById.mockResolvedValue({ id: "meeting-1" });
    createAgendaItem.mockResolvedValue({ id: "agenda-1" });
    trackProductEvent.mockResolvedValue(undefined);
  });

  it("redirects back to the meeting after a successful agenda save", async () => {
    const formData = new FormData();
    formData.set("title", "Promotion path");
    formData.set("description", "");
    formData.set("category", "update");
    formData.set("source", "manual");

    await expect(
      createAgendaItemAction(
        "rel-1",
        "meeting-1",
        {
          fieldErrors: {},
          formError: null,
          values: { title: "", description: "", category: "" },
        },
        formData,
      ),
    ).rejects.toBe(redirectError);

    expect(redirect).toHaveBeenCalledWith("/app/relationships/rel-1/meetings/meeting-1");
  });
});
