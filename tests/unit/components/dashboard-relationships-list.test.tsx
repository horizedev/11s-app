import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardRelationshipsList } from "@/components/dashboard-relationships-list";

describe("DashboardRelationshipsList", () => {
  it("renders active relationships as workspace links", () => {
    render(
      <DashboardRelationshipsList
        relationships={[
          {
            id: "rel_1",
            personName: "Alex Morgan",
            relationshipTypeLabel: "Manager",
            cadenceLabel: "Every 2 weeks",
            personContext: "Product leader for the growth team",
            relationshipGoal: "Keep promotion progress visible",
          },
          {
            id: "rel_2",
            personName: "Jordan Lee",
            relationshipTypeLabel: "Peer",
            cadenceLabel: null,
            personContext: null,
            relationshipGoal: null,
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Your relationships" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Open Alex Morgan" }),
    ).toHaveAttribute("href", "/app/relationships/rel_1");
    expect(screen.getByText(/manager.*every 2 weeks/i)).toBeInTheDocument();
    expect(
      screen.getByText("Product leader for the growth team"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Create another 1:1" }),
    ).toHaveAttribute("href", "/app/relationships/new");
  });
});
