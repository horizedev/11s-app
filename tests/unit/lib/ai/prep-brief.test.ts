import { beforeEach, describe, expect, it, vi } from "vitest";

const deepSeekMocks = vi.hoisted(() => ({
  getDeepSeekConfig: vi.fn(),
  requestDeepSeekCompletion: vi.fn(),
}));

vi.mock("@/lib/ai/deepseek", () => ({
  getDeepSeekConfig: deepSeekMocks.getDeepSeekConfig,
  requestDeepSeekCompletion: deepSeekMocks.requestDeepSeekCompletion,
}));

import {
  buildPrepBriefInputSnapshot,
  buildPrepBriefPrompts,
  generatePrepBrief,
} from "@/lib/ai/prep-brief";

const baseContext = {
  relationship: {
    personName: "Maya",
    relationshipTypeLabel: "Manager",
    personContext: "Engineering manager for the platform team",
    relationshipGoal: "Grow into technical leadership",
    status: "active" as const,
  },
  meeting: {
    purpose: "Career growth sync",
    scheduledAt: "2026-07-12T15:00:00.000Z",
    status: "draft" as const,
  },
  agendaItems: [
    { title: "Promotion packet", description: "Review draft" },
  ],
  currentMeetingNotes: {
    shareableNotes: "We aligned on the timeline.",
    privateNotes: "Maya seemed stressed about budget politics.",
    decisions: [{ body: "Draft the packet by Friday" }],
  },
  priorShareableNotes: ["Last meeting focused on sponsorship."],
  priorDecisions: ["Prepare examples for the packet."],
  openActionItems: [
    {
      title: "Send promotion packet draft",
      ownerLabel: "Me",
      dueDate: "2026-07-10",
      status: "open" as const,
      meetingId: "meeting-0",
    },
  ],
};

describe("prep brief generation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    deepSeekMocks.getDeepSeekConfig.mockReturnValue({
      apiKey: "deepseek_test_key",
      baseUrl: "https://api.deepseek.test",
      model: "DeepSeek-V4-Pro",
    });
  });

  it("excludes private notes from the snapshot by default", () => {
    const snapshot = buildPrepBriefInputSnapshot({
      ...baseContext,
      includePrivateNotes: false,
    });

    expect(snapshot.includedPrivateNotes).toBe(false);
    expect(snapshot.privateNotes).toBeUndefined();
  });

  it("includes private notes only when explicitly opted in", () => {
    const snapshot = buildPrepBriefInputSnapshot({
      ...baseContext,
      includePrivateNotes: true,
    });

    expect(snapshot.includedPrivateNotes).toBe(true);
    expect(snapshot.privateNotes).toEqual([
      "Maya seemed stressed about budget politics.",
    ]);
  });

  it("includes the required markdown sections and privacy guardrails in the prompt", () => {
    const snapshot = buildPrepBriefInputSnapshot({
      ...baseContext,
      includePrivateNotes: true,
    });

    const prompts = buildPrepBriefPrompts(snapshot);

    expect(prompts.systemPrompt).toContain("Do not invent facts");
    expect(prompts.systemPrompt).toContain("Do not quote private notes verbatim");
    expect(prompts.userPrompt).toContain("## Situation snapshot");
    expect(prompts.userPrompt).toContain("## Open loops");
    expect(prompts.userPrompt).toContain("## Suggested agenda");
    expect(prompts.userPrompt).toContain("## Smart questions");
    expect(prompts.userPrompt).toContain("## Tone and risk notes");
    expect(prompts.userPrompt).toContain("## Recommended next step");
  });

  it("returns a config error result without calling DeepSeek when config is missing", async () => {
    deepSeekMocks.getDeepSeekConfig.mockReturnValue(null);

    await expect(
      generatePrepBrief({
        ...baseContext,
        includePrivateNotes: false,
      }),
    ).resolves.toEqual({
      status: "config_error",
      message: "AI Prep Brief is not configured yet. Please try again later.",
    });

    expect(deepSeekMocks.requestDeepSeekCompletion).not.toHaveBeenCalled();
  });
});
