import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AiPrepBriefPanel } from "@/components/ai-prep-brief-panel";
import { getEmptyPrepBriefState } from "@/lib/ai/state";

describe("AiPrepBriefPanel", () => {
  it("renders the Pro teaser and upgrade CTA for gated users", () => {
    render(
      <AiPrepBriefPanel
        generateAction={vi.fn(async () => getEmptyPrepBriefState())}
        copyEventAction={vi.fn(async () => {})}
        upgradeAction={vi.fn(async () => {})}
        initialState={getEmptyPrepBriefState()}
        showUpgradeCta
      />,
    );

    expect(
      screen.getByRole("heading", { name: "AI Prep Brief" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /AI Prep Brief is a Pro feature\. Upgrade to turn your relationship history, notes, and open actions into a focused 1:1 prep plan\./i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Upgrade to Pro" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Generate prep brief/i }),
    ).not.toBeInTheDocument();
  });

  it("renders an existing saved brief even when the user is gated", () => {
    render(
      <AiPrepBriefPanel
        generateAction={vi.fn(async () => getEmptyPrepBriefState())}
        copyEventAction={vi.fn(async () => {})}
        upgradeAction={vi.fn(async () => {})}
        initialState={getEmptyPrepBriefState({
          id: "brief-1",
          contentMarkdown: "## Situation snapshot\n- Ready",
          includedPrivateNotes: true,
          model: "DeepSeek-V4-Pro",
          inputSnapshot: {},
          createdAt: "2026-07-05T10:00:00.000Z",
        })}
        showUpgradeCta
      />,
    );

    expect(screen.getByText(/Ready/)).toBeInTheDocument();
    expect(
      screen.getByText(/Private notes included in this generation/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Copy brief" }),
    ).toBeInTheDocument();
  });

  it("copies the raw markdown brief and shows copied status", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });
    const copyEventAction = vi.fn(async () => {});

    render(
      <AiPrepBriefPanel
        generateAction={vi.fn(async () => getEmptyPrepBriefState())}
        copyEventAction={copyEventAction}
        upgradeAction={vi.fn(async () => {})}
        initialState={getEmptyPrepBriefState({
          id: "brief-1",
          contentMarkdown: "## Situation snapshot\n- Ready",
          includedPrivateNotes: false,
          model: "DeepSeek-V4-Pro",
          inputSnapshot: {},
          createdAt: "2026-07-05T10:00:00.000Z",
        })}
        showUpgradeCta={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy brief" }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("## Situation snapshot\n- Ready");
    });
    await waitFor(() => {
      expect(copyEventAction).toHaveBeenCalled();
    });
    expect(screen.getByText(/Copied markdown brief/i)).toBeInTheDocument();
  });
});
