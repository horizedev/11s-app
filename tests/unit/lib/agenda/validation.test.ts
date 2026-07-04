import { describe, expect, it } from "vitest";

import {
  getEmptyAgendaItemFormState,
  validateAgendaItemInput,
} from "@/lib/agenda/validation";

describe("validateAgendaItemInput", () => {
  it("accepts a title with optional details and category", () => {
    const result = validateAgendaItemInput({
      title: " Review promotion goals ",
      description: " Align on scope, timing, and sponsor feedback. ",
      category: "growth",
    });

    expect(result).toEqual({
      success: true,
      data: {
        title: "Review promotion goals",
        description: "Align on scope, timing, and sponsor feedback.",
        category: "growth",
      },
    });
  });

  it("rejects a blank title and preserves the submitted values", () => {
    const result = validateAgendaItemInput({
      title: "   ",
      description: "Need to cover blockers.",
      category: "blocker",
    });

    expect(result).toEqual({
      success: false,
      state: {
        ...getEmptyAgendaItemFormState(),
        fieldErrors: {
          title: "Add an agenda item title before saving.",
        },
        values: {
          title: "",
          description: "Need to cover blockers.",
          category: "blocker",
        },
      },
    });
  });

  it("rejects an unsupported category", () => {
    const result = validateAgendaItemInput({
      title: "Reconnect after the last missed meeting",
      description: "",
      category: "invalid-category",
    });

    expect(result).toEqual({
      success: false,
      state: {
        ...getEmptyAgendaItemFormState(),
        fieldErrors: {
          category: "Choose a valid agenda category.",
        },
        values: {
          title: "Reconnect after the last missed meeting",
          description: "",
          category: "invalid-category",
        },
      },
    });
  });
});
