import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MeetingForm } from "@/components/meeting-form";
import { getEmptyMeetingFormState } from "@/lib/meetings/validation";

describe("MeetingForm", () => {
  it("renders the fields needed to prepare a draft meeting", () => {
    render(
      <MeetingForm
        action={vi.fn(async () => getEmptyMeetingFormState())}
        initialState={getEmptyMeetingFormState()}
        relationshipName="Alex Morgan"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Prepare the next 1:1" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Meeting purpose")).toBeInTheDocument();
    expect(screen.getByLabelText("Meeting date and time")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create draft meeting" }),
    ).toBeInTheDocument();
  });
});
