import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActionItemsPanel } from "@/components/action-items-panel";
import { AgendaItemsPanel } from "@/components/agenda-items-panel";
import { getEmptyActionItemFormState } from "@/lib/action-items/validation";
import { getEmptyAgendaItemFormState } from "@/lib/agenda/validation";

describe("meeting workspace form controls", () => {
  it("does not reuse DOM ids across agenda and action item forms", () => {
    const { container } = render(
      <>
        <AgendaItemsPanel
          action={vi.fn(async () => getEmptyAgendaItemFormState())}
          initialState={getEmptyAgendaItemFormState()}
          items={[]}
        />
        <ActionItemsPanel
          action={vi.fn(async () => getEmptyActionItemFormState())}
          completeAction={vi.fn(async () => {})}
          initialState={getEmptyActionItemFormState()}
          items={[]}
        />
      </>,
    );

    const ids = Array.from(container.querySelectorAll("[id]"), (element) => element.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

    expect(duplicateIds).toEqual([]);
  });
});
