import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RelationshipForm } from "@/components/relationship-form";
import { getEmptyRelationshipFormState } from "@/lib/relationships/validation";

describe("RelationshipForm", () => {
  it("renders the required fields for creating a new relationship", () => {
    render(
      <RelationshipForm
        action={vi.fn(async () => getEmptyRelationshipFormState())}
        initialState={getEmptyRelationshipFormState()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Create your first 1:1" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Person name")).toBeRequired();
    expect(screen.getByLabelText("Relationship type")).toBeRequired();
    expect(
      screen.getByRole("button", { name: "Save relationship" }),
    ).toBeInTheDocument();
  });
});
