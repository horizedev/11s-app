import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MeetingNotesPanel } from "@/components/meeting-notes-panel";
import { getEmptyMeetingNotesFormState } from "@/lib/meeting-notes/validation";

describe("MeetingNotesPanel", () => {
  it("renders distinct shareable and private note sections", () => {
    render(
      <MeetingNotesPanel
        action={vi.fn(async () => getEmptyMeetingNotesFormState())}
        initialState={getEmptyMeetingNotesFormState()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Meeting notes" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Shareable notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Private notes")).toBeInTheDocument();
    expect(
      screen.getByText(/private notes stay out of follow-up summaries by default/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save notes" }),
    ).toBeInTheDocument();
  });
});
