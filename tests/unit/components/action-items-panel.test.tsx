import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActionItemsPanel } from "@/components/action-items-panel";
import { getEmptyActionItemFormState } from "@/lib/action-items/validation";

describe("ActionItemsPanel", () => {
  it("renders the creation form and saved open items", () => {
    render(
      <ActionItemsPanel
        action={vi.fn(async () => getEmptyActionItemFormState())}
        completeAction={vi.fn(async () => {})}
        initialState={getEmptyActionItemFormState()}
        items={[
          {
            id: "action-1",
            relationshipId: "relationship-1",
            meetingId: "meeting-1",
            title: "Send pricing recap",
            owner: "me",
            ownerLabel: "Me",
            dueDate: "2026-07-11",
            notes: "Include enterprise packaging options.",
            status: "open",
            completedAt: null,
            createdAt: "2026-07-04T00:00:00.000Z",
            updatedAt: "2026-07-04T00:00:00.000Z",
          },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Action items" })).toBeInTheDocument();
    expect(screen.getByText("Send pricing recap")).toBeInTheDocument();
    expect(screen.getByText(/me • due jul 11, 2026/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Action item")).toBeInTheDocument();
    expect(screen.getByLabelText("Owner")).toBeInTheDocument();
    expect(screen.getByLabelText("Due date")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add action item" })).toBeInTheDocument();
  });
});
