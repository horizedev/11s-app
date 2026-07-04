import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DecisionsPanel } from "@/components/decisions-panel";
import { getEmptyDecisionFormState } from "@/lib/meeting-notes/validation";

describe("DecisionsPanel", () => {
  it("shows prior decisions and the form for adding another one", () => {
    render(
      <DecisionsPanel
        action={vi.fn(async () => getEmptyDecisionFormState())}
        decisions={[
          {
            id: "decision-1",
            body: "Send the updated proposal on Tuesday.",
            createdAt: "2026-07-04T00:00:00.000Z",
            updatedAt: "2026-07-04T00:00:00.000Z",
          },
        ]}
        initialState={getEmptyDecisionFormState()}
      />,
    );

    expect(screen.getByRole("heading", { name: "Decisions" })).toBeInTheDocument();
    expect(
      screen.getByText("Send the updated proposal on Tuesday."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Decision")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add decision" }),
    ).toBeInTheDocument();
  });
});
