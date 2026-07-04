import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AgendaIdeasPanel } from "@/components/agenda-ideas-panel";
import { getEmptyAgendaIdeasState } from "@/lib/ai/state";

describe("AgendaIdeasPanel", () => {
  it("renders generated ideas with one-click add forms", () => {
    render(
      <AgendaIdeasPanel
        generateAction={vi.fn(async () => getEmptyAgendaIdeasState())}
        addAction={vi.fn(async () => {})}
        initialState={{
          ...getEmptyAgendaIdeasState(),
          ideas: [
            {
              title: "Follow up on launch risks",
              description: "Discuss the highest-risk blocker and next step.",
              category: "blocker",
            },
          ],
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "AI agenda ideas" })).toBeInTheDocument();
    expect(screen.getByText("Follow up on launch risks")).toBeInTheDocument();
    expect(screen.getByText("Discuss the highest-risk blocker and next step.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add to agenda" })).toBeInTheDocument();
  });
});
