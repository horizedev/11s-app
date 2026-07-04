import { describe, expect, it } from "vitest";

import {
  buildAgendaIdeas,
  buildFollowUpSummary,
} from "@/lib/ai/generation";

describe("AI-assisted generation helpers", () => {
  it("builds first-meeting agenda ideas and considers prior open action items", () => {
    const ideas = buildAgendaIdeas({
      relationship: {
        personName: "Maya",
        relationshipTypeLabel: "Manager",
        personContext: "Engineering manager for the platform team",
        relationshipGoal: "Grow into technical leadership",
      },
      openActionItems: [
        {
          title: "Send promotion packet draft",
          ownerLabel: "Me",
          dueDate: "2026-07-10",
        },
      ],
      priorMeetingHighlights: [],
    });

    expect(ideas.length).toBeGreaterThanOrEqual(5);
    expect(ideas[0]).toMatchObject({ category: expect.any(String), title: expect.any(String) });
    expect(
      ideas.some((idea) =>
        `${idea.title} ${idea.description}`.toLowerCase().includes("promotion packet draft"),
      ),
    ).toBe(true);
  });

  it("builds a shareable follow-up summary that excludes private notes", () => {
    const summary = buildFollowUpSummary({
      relationshipName: "Maya",
      meetingPurpose: "Career growth sync",
      agendaItems: ["Discuss promotion timeline"],
      shareableNotes: "We aligned on the promotion packet timeline.",
      privateNotes: "Maya seemed worried about budget politics.",
      decisions: ["Draft packet by Friday"],
      actionItems: [
        {
          title: "Send promotion packet draft",
          ownerLabel: "Me",
          dueDate: "2026-07-10",
          status: "open",
        },
      ],
      tone: "professional",
    });

    expect(summary).toContain("Career growth sync");
    expect(summary).toContain("Send promotion packet draft");
    expect(summary).toContain("Me");
    expect(summary).not.toContain("budget politics");
  });
});
