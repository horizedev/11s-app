import { describe, expect, it } from "vitest";

import {
  buildPrepBriefInputSnapshot,
  buildPrepBriefPrompt,
} from "@/lib/ai/prep-brief";

const baseContext = {
  relationship: {
    id: "relationship-1",
    personName: "Maya",
    relationshipTypeLabel: "Manager",
    personContext: "Engineering manager for the platform team",
    relationshipGoal: "Grow into technical leadership",
    status: "active" as const,
  },
  meeting: {
    id: "meeting-1",
    purpose: "Career growth sync",
    scheduledAt: "2026-07-21T09:00:00.000Z",
    status: "draft" as const,
  },
  agendaItems: [
    {
      title: "Discuss promotion timeline",
      description: "Review packet milestones",
      categoryLabel: "Growth",
    },
  ],
  priorShareableNotes: ["We aligned on the promotion packet timeline."],
  priorDecisions: ["Draft packet by Friday"],
  openActionItems: [
    {
      title: "Send promotion packet draft",
      ownerLabel: "Me",
      dueDate: "2026-07-10",
      status: "open" as const,
      meetingId: "meeting-1",
    },
  ],
  privateNotes: ["Maya seemed worried about budget politics."],
};

describe("prep brief helpers", () => {
  it("excludes private notes from the snapshot and prompt by default", () => {
    const snapshot = buildPrepBriefInputSnapshot({
      ...baseContext,
      includePrivateNotes: false,
    });
    const prompt = buildPrepBriefPrompt(snapshot);

    expect(snapshot.privateNotes).toEqual([]);
    expect(snapshot.includedPrivateNotes).toBe(false);
    expect(prompt).not.toContain("budget politics");
  });

  it("includes private notes only when explicitly opted in", () => {
    const snapshot = buildPrepBriefInputSnapshot({
      ...baseContext,
      includePrivateNotes: true,
    });
    const prompt = buildPrepBriefPrompt(snapshot);

    expect(snapshot.privateNotes).toEqual([
      "Maya seemed worried about budget politics.",
    ]);
    expect(snapshot.includedPrivateNotes).toBe(true);
    expect(prompt).toContain("budget politics");
    expect(prompt).toContain("never suggest sharing them verbatim");
  });

  it("requires the markdown sections from the product spec", () => {
    const snapshot = buildPrepBriefInputSnapshot({
      ...baseContext,
      includePrivateNotes: false,
    });
    const prompt = buildPrepBriefPrompt(snapshot);

    expect(prompt).toContain("## Situation snapshot");
    expect(prompt).toContain("## Open loops");
    expect(prompt).toContain("## Suggested agenda");
    expect(prompt).toContain("## Smart questions");
    expect(prompt).toContain("## Tone and risk notes");
    expect(prompt).toContain("## Recommended next step");
  });
});
