import { describe, expect, it, vi } from "vitest";

import {
  createPrepBrief,
  getLatestPrepBriefForMeeting,
} from "@/lib/ai/prep-brief-repository";

describe("prep brief repository", () => {
  it("loads the latest prep brief for a meeting", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: {
        id: "brief-1",
        user_id: "user-1",
        relationship_id: "relationship-1",
        meeting_id: "meeting-1",
        content_markdown: "## Situation snapshot\n- Ready",
        included_private_notes: true,
        model: "DeepSeek-V4-Pro",
        input_snapshot: { agendaCount: 2 },
        created_at: "2026-07-05T10:00:00.000Z",
      },
      error: null,
    });
    const limit = vi.fn(() => ({ maybeSingle }));
    const order = vi.fn(() => ({ limit }));
    const eq = vi.fn(() => ({ eq, order }));
    const select = vi.fn(() => ({ eq }));
    const supabase = {
      from: vi.fn(() => ({ select })),
    };

    await expect(
      getLatestPrepBriefForMeeting({
        supabase: supabase as never,
        userId: "user-1",
        relationshipId: "relationship-1",
        meetingId: "meeting-1",
      }),
    ).resolves.toMatchObject({
      id: "brief-1",
      contentMarkdown: "## Situation snapshot\n- Ready",
      includedPrivateNotes: true,
      model: "DeepSeek-V4-Pro",
      inputSnapshot: { agendaCount: 2 },
    });

    expect(supabase.from).toHaveBeenCalledWith("ai_prep_briefs");
    expect(select).toHaveBeenCalledWith(
      "id, user_id, relationship_id, meeting_id, content_markdown, included_private_notes, model, input_snapshot, created_at",
    );
    expect(order).toHaveBeenCalledWith("created_at", { ascending: false });
  });

  it("creates a prep brief row with the persisted snapshot", async () => {
    const single = vi.fn().mockResolvedValue({
      data: {
        id: "brief-2",
        user_id: "user-1",
        relationship_id: "relationship-1",
        meeting_id: "meeting-1",
        content_markdown: "## Situation snapshot\n- Saved",
        included_private_notes: false,
        model: "DeepSeek-V4-Pro",
        input_snapshot: { meetingPurpose: "Career check-in" },
        created_at: "2026-07-05T10:05:00.000Z",
      },
      error: null,
    });
    const select = vi.fn(() => ({ single }));
    const insert = vi.fn(() => ({ select }));
    const supabase = {
      from: vi.fn(() => ({ insert })),
    };

    await expect(
      createPrepBrief({
        supabase: supabase as never,
        userId: "user-1",
        relationshipId: "relationship-1",
        meetingId: "meeting-1",
        contentMarkdown: "## Situation snapshot\n- Saved",
        includedPrivateNotes: false,
        model: "DeepSeek-V4-Pro",
        inputSnapshot: { meetingPurpose: "Career check-in" },
      }),
    ).resolves.toMatchObject({
      id: "brief-2",
      contentMarkdown: "## Situation snapshot\n- Saved",
      includedPrivateNotes: false,
      model: "DeepSeek-V4-Pro",
    });

    expect(insert).toHaveBeenCalledWith({
      user_id: "user-1",
      relationship_id: "relationship-1",
      meeting_id: "meeting-1",
      content_markdown: "## Situation snapshot\n- Saved",
      included_private_notes: false,
      model: "DeepSeek-V4-Pro",
      input_snapshot: { meetingPurpose: "Career check-in" },
    });
  });
});
