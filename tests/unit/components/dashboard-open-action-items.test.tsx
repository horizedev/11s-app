import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DashboardOpenActionItems } from "@/components/dashboard-open-action-items";

describe("DashboardOpenActionItems", () => {
  it("groups open action items by relationship", () => {
    render(
      <DashboardOpenActionItems
        completeAction={vi.fn(async () => {})}
        groups={[
          {
            relationshipId: "relationship-1",
            relationshipName: "Alex Morgan",
            items: [
              {
                id: "action-1",
                relationshipId: "relationship-1",
                meetingId: "meeting-1",
                title: "Send pricing recap",
                owner: "me",
                ownerLabel: "Me",
                dueDate: "2026-07-11",
                notes: null,
                status: "open",
                completedAt: null,
                createdAt: "2026-07-04T00:00:00.000Z",
                updatedAt: "2026-07-04T00:00:00.000Z",
              },
            ],
          },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Open action items" })).toBeInTheDocument();
    expect(screen.getByText("Alex Morgan")).toBeInTheDocument();
    expect(screen.getByText("Send pricing recap")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open relationship" })).toHaveAttribute(
      "href",
      "/app/relationships/relationship-1",
    );
  });
});
