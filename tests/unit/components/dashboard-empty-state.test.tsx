import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardEmptyState } from "@/components/dashboard-empty-state";

describe("DashboardEmptyState", () => {
  it("guides a first-time user to create their first 1:1", () => {
    render(<DashboardEmptyState />);

    expect(
      screen.getByRole("heading", { name: "Prepare your next 1:1" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Create your first 1:1" }),
    ).toHaveAttribute("href", "/app/relationships/new");
    expect(
      screen.getByText(
        /start with one person and keep your agenda, notes, and action items together/i,
      ),
    ).toBeInTheDocument();
  });
});
