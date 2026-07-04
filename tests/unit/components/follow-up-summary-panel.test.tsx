import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FollowUpSummaryPanel } from "@/components/follow-up-summary-panel";
import { getEmptyFollowUpSummaryState } from "@/lib/ai/state";

describe("FollowUpSummaryPanel", () => {
  it("renders a generated summary with copy affordance and private-note reminder", () => {
    render(
      <FollowUpSummaryPanel
        generateAction={vi.fn(async () => getEmptyFollowUpSummaryState())}
        copyEventAction={vi.fn(async () => {})}
        initialState={{
          ...getEmptyFollowUpSummaryState(),
          summary: "# Follow-up\n\n## Recap\nShared recap only.",
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Follow-up summary" })).toBeInTheDocument();
    expect(screen.getByText(/private notes are excluded/i)).toBeInTheDocument();
    expect(screen.getByText(/shared recap only/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy summary" })).toBeInTheDocument();
  });
});
