import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AiPrepBriefPanel } from "@/components/ai-prep-brief-panel";
import { getEmptyPrepBriefState } from "@/lib/ai/state";

describe("AiPrepBriefPanel", () => {
  it("renders the free-user upgrade gate while keeping an existing brief visible", () => {
    render(
      <AiPrepBriefPanel
        copyEventAction={vi.fn(async () => {})}
        generateAction={vi.fn(async () => getEmptyPrepBriefState())}
        initialState={{
          ...getEmptyPrepBriefState(),
          brief: {
            id: "brief-1",
            relationshipId: "relationship-1",
            meetingId: "meeting-1",
            contentMarkdown: "## Situation snapshot\n- Shared context",
            includedPrivateNotes: false,
            model: "DeepSeek-V4-Pro",
            inputSnapshot: {},
            createdAt: "2026-07-05T00:00:00.000Z",
          },
        }}
        isPro={false}
      />,
    );

    expect(screen.getByRole("heading", { name: "AI Prep Brief" })).toBeInTheDocument();
    expect(screen.getByText(/pro feature/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Upgrade to Pro" })).toBeInTheDocument();
    expect(screen.getByText(/shared context/i)).toBeInTheDocument();
  });

  it("copies the raw markdown brief and shows copied status", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    render(
      <AiPrepBriefPanel
        copyEventAction={vi.fn(async () => {})}
        generateAction={vi.fn(async () => getEmptyPrepBriefState())}
        initialState={{
          ...getEmptyPrepBriefState(),
          brief: {
            id: "brief-1",
            relationshipId: "relationship-1",
            meetingId: "meeting-1",
            contentMarkdown: "## Situation snapshot\n- Shared context",
            includedPrivateNotes: true,
            model: "DeepSeek-V4-Pro",
            inputSnapshot: {},
            createdAt: "2026-07-05T00:00:00.000Z",
          },
        }}
        isPro={true}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy prep brief" }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("## Situation snapshot\n- Shared context");
    });
    expect(screen.getByText(/copied markdown prep brief/i)).toBeInTheDocument();
    expect(screen.getByText(/private notes included in this generation/i)).toBeInTheDocument();
  });
});
