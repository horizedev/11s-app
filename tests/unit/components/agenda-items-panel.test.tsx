import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AgendaItemsPanel } from "@/components/agenda-items-panel";
import { getEmptyAgendaItemFormState } from "@/lib/agenda/validation";

describe("AgendaItemsPanel", () => {
  it("renders the empty agenda state and creation form", () => {
    render(
      <AgendaItemsPanel
        action={vi.fn(async () => getEmptyAgendaItemFormState())}
        initialState={getEmptyAgendaItemFormState()}
        items={[]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Agenda" })).toBeInTheDocument();
    expect(screen.getByText("No agenda items yet.")).toBeInTheDocument();
    expect(screen.getByLabelText("Agenda item")).toBeInTheDocument();
    expect(screen.getByLabelText("Details")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add agenda item" }),
    ).toBeInTheDocument();
  });

  it("renders saved agenda items in order", () => {
    render(
      <AgendaItemsPanel
        action={vi.fn(async () => getEmptyAgendaItemFormState())}
        initialState={getEmptyAgendaItemFormState()}
        items={[
          {
            id: "agenda-1",
            meetingId: "meeting-1",
            relationshipId: "relationship-1",
            title: "Review open blockers",
            description: "Check staffing and launch timing.",
            category: "blocker",
            categoryLabel: "Blocker",
            position: 0,
            isDiscussed: false,
            createdAt: "2026-07-04T15:00:00.000Z",
            updatedAt: "2026-07-04T15:00:00.000Z",
          },
          {
            id: "agenda-2",
            meetingId: "meeting-1",
            relationshipId: "relationship-1",
            title: "Plan next quarter goals",
            description: null,
            category: "growth",
            categoryLabel: "Growth",
            position: 1,
            isDiscussed: true,
            createdAt: "2026-07-04T15:05:00.000Z",
            updatedAt: "2026-07-04T15:05:00.000Z",
          },
        ]}
      />,
    );

    expect(screen.getByText("Review open blockers")).toBeInTheDocument();
    expect(screen.getByText("Check staffing and launch timing.")).toBeInTheDocument();
    expect(screen.getByText("Plan next quarter goals")).toBeInTheDocument();
    expect(screen.getAllByText("Growth")).toHaveLength(2);
    expect(screen.getByText("Discussed")).toBeInTheDocument();
  });
});
