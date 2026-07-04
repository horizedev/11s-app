import { describe, expect, it } from "vitest";

import {
  getEmptyActionItemFormState,
  validateActionItemInput,
} from "@/lib/action-items/validation";

describe("validateActionItemInput", () => {
  it("accepts a title with optional owner, due date, and notes", () => {
    expect(
      validateActionItemInput({
        title: " Send pricing recap ",
        owner: "other_person",
        dueDate: "2026-07-11",
        notes: " Include enterprise packaging options. ",
      }),
    ).toEqual({
      success: true,
      data: {
        title: "Send pricing recap",
        owner: "other_person",
        dueDate: "2026-07-11",
        notes: "Include enterprise packaging options.",
      },
    });
  });

  it("rejects a blank title and preserves the submitted values", () => {
    expect(
      validateActionItemInput({
        title: "   ",
        owner: "me",
        dueDate: "",
        notes: "Need this before the next check-in.",
      }),
    ).toEqual({
      success: false,
      state: {
        ...getEmptyActionItemFormState(),
        fieldErrors: {
          title: "Add an action item title before saving.",
        },
        values: {
          title: "",
          owner: "me",
          dueDate: "",
          notes: "Need this before the next check-in.",
        },
      },
    });
  });

  it("rejects an unsupported due date", () => {
    expect(
      validateActionItemInput({
        title: "Follow up on staffing",
        owner: "shared",
        dueDate: "2026-13-99",
        notes: "",
      }),
    ).toEqual({
      success: false,
      state: {
        ...getEmptyActionItemFormState(),
        fieldErrors: {
          dueDate: "Choose a valid due date or leave it blank.",
        },
        values: {
          title: "Follow up on staffing",
          owner: "shared",
          dueDate: "2026-13-99",
          notes: "",
        },
      },
    });
  });
});
