import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const redirect = vi.fn((url: string) => {
    const error = new Error("NEXT_REDIRECT");
    (error as Error & { digest: string }).digest = `NEXT_REDIRECT;replace;${url};307;`;
    throw error;
  });

  return {
    createAgendaItem: vi.fn(),
    createPrepBrief: vi.fn(),
    createClient: vi.fn(),
    createMeeting: vi.fn(),
    generatePrepBrief: vi.fn(),
    getMeetingById: vi.fn(),
    getBillingUsage: vi.fn(),
    getLatestPrepBriefForMeeting: vi.fn(),
    getMeetingNotesBundle: vi.fn(),
    getPriorMeetingContextByRelationship: vi.fn(),
    getRelationshipById: vi.fn(),
    listAgendaItemsForMeeting: vi.fn(),
    listOpenActionItemsByRelationship: vi.fn(),
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

vi.mock("@/lib/meetings/repository", () => ({
  createMeeting: mocks.createMeeting,
  getMeetingById: mocks.getMeetingById,
  completeMeeting: vi.fn(),
}));

vi.mock("@/lib/relationships/repository", () => ({
  getRelationshipById: mocks.getRelationshipById,
}));

vi.mock("@/lib/agenda/repository", () => ({
  createAgendaItem: mocks.createAgendaItem,
  listAgendaItemsForMeeting: mocks.listAgendaItemsForMeeting,
}));

vi.mock("@/lib/analytics/repository", () => ({
  trackProductEvent: mocks.trackProductEvent,
}));

vi.mock("@/lib/billing/repository", () => ({
  getBillingUsage: mocks.getBillingUsage,
}));

vi.mock("@/lib/action-items/repository", () => ({
  createActionItem: vi.fn(),
  listActionItemsForMeeting: vi.fn(),
  listOpenActionItemsByRelationship: mocks.listOpenActionItemsByRelationship,
}));

vi.mock("@/lib/meeting-notes/repository", () => ({
  createDecision: vi.fn(),
  getMeetingNotesBundle: mocks.getMeetingNotesBundle,
  getPriorMeetingContextByRelationship: mocks.getPriorMeetingContextByRelationship,
  saveMeetingNotes: vi.fn(),
}));

vi.mock("@/lib/ai/prep-brief", () => ({
  generatePrepBrief: mocks.generatePrepBrief,
}));

vi.mock("@/lib/ai/prep-brief-repository", () => ({
  createPrepBrief: mocks.createPrepBrief,
  getLatestPrepBriefForMeeting: mocks.getLatestPrepBriefForMeeting,
}));

import { getEmptyAgendaItemFormState } from "@/lib/agenda/validation";
import { getEmptyMeetingFormState } from "@/lib/meetings/validation";

describe("meeting server actions", () => {
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
    mocks.getRelationshipById.mockResolvedValue({
      id: "relationship-1",
      personName: "Soonam",
    });
    mocks.getMeetingById.mockResolvedValue({
      id: "meeting-1",
      purpose: "Career growth sync",
      scheduledAt: "2026-07-12T15:00:00.000Z",
      status: "draft",
    });
    mocks.createMeeting.mockResolvedValue({
      id: "meeting-1",
    });
    mocks.getBillingUsage.mockResolvedValue({
      plan: "pro",
      canCreateMeeting: true,
      canGenerateAi: true,
    });
    mocks.createAgendaItem.mockResolvedValue(undefined);
    mocks.listAgendaItemsForMeeting.mockResolvedValue([
      { title: "Promotion prep", description: "Review draft" },
    ]);
    mocks.listOpenActionItemsByRelationship.mockResolvedValue([
      {
        title: "Send promotion packet draft",
        ownerLabel: "Me",
        dueDate: "2026-07-10",
        status: "open",
      },
    ]);
    mocks.getMeetingNotesBundle.mockResolvedValue({
      shareableNotes: "We aligned on the timeline.",
      privateNotes: "Maya seemed stressed about budget politics.",
      decisions: [{ body: "Draft the packet by Friday" }],
    });
    mocks.getPriorMeetingContextByRelationship.mockResolvedValue({
      priorShareableNotes: ["Last meeting focused on sponsorship."],
      priorDecisions: ["Prepare examples for the packet."],
    });
    mocks.getLatestPrepBriefForMeeting.mockResolvedValue(null);
    mocks.generatePrepBrief.mockResolvedValue({
      status: "success",
      contentMarkdown: "## Situation snapshot\n- Ready",
      model: "DeepSeek-V4-Pro",
      inputSnapshot: { includedPrivateNotes: false },
    });
    mocks.createPrepBrief.mockResolvedValue({
      id: "brief-1",
      contentMarkdown: "## Situation snapshot\n- Ready",
      includedPrivateNotes: false,
      model: "DeepSeek-V4-Pro",
      inputSnapshot: { includedPrivateNotes: false },
      createdAt: "2026-07-05T10:00:00.000Z",
    });
    mocks.trackProductEvent.mockResolvedValue(undefined);
  });

  it("rethrows the redirect after a successful draft meeting creation", async () => {
    const { createMeetingAction } = await import(
      "@/app/app/relationships/[relationshipId]/meetings/new/actions"
    );

    await expect(
      createMeetingAction("relationship-1", getEmptyMeetingFormState(), new FormData()),
    ).rejects.toMatchObject({
      digest:
        "NEXT_REDIRECT;replace;/app/relationships/relationship-1/meetings/meeting-1;307;",
    });

    expect(mocks.createMeeting).toHaveBeenCalledWith(
      expect.objectContaining({
        relationshipId: "relationship-1",
        userId: "user-1",
      }),
    );
    expect(mocks.trackProductEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        entityId: "meeting-1",
        eventName: "meeting_created",
      }),
    );
  });

  it("rethrows the redirect after a successful agenda item creation", async () => {
    const { createAgendaItemAction } = await import(
      "@/app/app/relationships/[relationshipId]/meetings/[meetingId]/actions"
    );
    const formData = new FormData();
    formData.set("title", "Promotion prep");

    await expect(
      createAgendaItemAction(
        "relationship-1",
        "meeting-1",
        getEmptyAgendaItemFormState(),
        formData,
      ),
    ).rejects.toMatchObject({
      digest:
        "NEXT_REDIRECT;replace;/app/relationships/relationship-1/meetings/meeting-1;307;",
    });

    expect(mocks.createAgendaItem).toHaveBeenCalledWith(
      expect.objectContaining({
        meetingId: "meeting-1",
        relationshipId: "relationship-1",
        userId: "user-1",
      }),
    );
  });

  it("blocks free users from generating a prep brief before any AI call", async () => {
    mocks.getBillingUsage.mockResolvedValue({
      plan: "free",
      canCreateMeeting: true,
      canGenerateAi: true,
    });

    const { generatePrepBriefAction } = await import(
      "@/app/app/relationships/[relationshipId]/meetings/[meetingId]/actions"
    );

    await expect(
      generatePrepBriefAction(
        "relationship-1",
        "meeting-1",
        {
          brief: null,
          formError: null,
          values: { includePrivateNotes: false },
        },
        new FormData(),
      ),
    ).resolves.toMatchObject({
      formError:
        "AI Prep Brief is a Pro feature. Upgrade to turn your relationship history, notes, and open actions into a focused 1:1 prep plan.",
    });

    expect(mocks.generatePrepBrief).not.toHaveBeenCalled();
  });

  it("blocks Pro users at their AI usage limit before calling DeepSeek", async () => {
    mocks.getBillingUsage.mockResolvedValue({
      plan: "pro",
      canCreateMeeting: true,
      canGenerateAi: false,
    });

    const { generatePrepBriefAction } = await import(
      "@/app/app/relationships/[relationshipId]/meetings/[meetingId]/actions"
    );

    await expect(
      generatePrepBriefAction(
        "relationship-1",
        "meeting-1",
        {
          brief: null,
          formError: null,
          values: { includePrivateNotes: false },
        },
        new FormData(),
      ),
    ).resolves.toMatchObject({
      formError: expect.stringContaining("AI generation allowance"),
    });

    expect(mocks.generatePrepBrief).not.toHaveBeenCalled();
  });

  it("persists a successful prep brief and records usage and analytics", async () => {
    mocks.generatePrepBrief.mockResolvedValue({
      status: "success",
      contentMarkdown: "## Situation snapshot\n- Ready",
      model: "DeepSeek-V4-Pro",
      inputSnapshot: { includedPrivateNotes: true },
    });
    mocks.createPrepBrief.mockResolvedValue({
      id: "brief-1",
      contentMarkdown: "## Situation snapshot\n- Ready",
      includedPrivateNotes: true,
      model: "DeepSeek-V4-Pro",
      inputSnapshot: { includedPrivateNotes: true },
      createdAt: "2026-07-05T10:00:00.000Z",
    });

    const { generatePrepBriefAction } = await import(
      "@/app/app/relationships/[relationshipId]/meetings/[meetingId]/actions"
    );
    const formData = new FormData();
    formData.set("includePrivateNotes", "on");

    await expect(
      generatePrepBriefAction(
        "relationship-1",
        "meeting-1",
        {
          brief: null,
          formError: null,
          values: { includePrivateNotes: false },
        },
        formData,
      ),
    ).resolves.toMatchObject({
      brief: expect.objectContaining({
        id: "brief-1",
        contentMarkdown: "## Situation snapshot\n- Ready",
      }),
      formError: null,
      values: { includePrivateNotes: false },
    });

    expect(mocks.generatePrepBrief).toHaveBeenCalledWith(
      expect.objectContaining({
        includePrivateNotes: true,
      }),
    );
    expect(mocks.createPrepBrief).toHaveBeenCalledWith(
      expect.objectContaining({
        contentMarkdown: "## Situation snapshot\n- Ready",
        includedPrivateNotes: true,
      }),
    );
    expect(mocks.trackProductEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "ai_prep_brief_generated",
        entityId: "meeting-1",
      }),
    );
  });
});
