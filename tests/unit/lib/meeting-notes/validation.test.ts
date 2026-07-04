import { describe, expect, it } from "vitest";

import {
  getEmptyDecisionFormState,
  getEmptyMeetingNotesFormState,
  validateDecisionInput,
  validateMeetingNotesInput,
} from "@/lib/meeting-notes/validation";

describe("validateMeetingNotesInput", () => {
  it("accepts blank notes so the user can save one section at a time", () => {
    expect(
      validateMeetingNotesInput({
        shareableNotes: "",
        privateNotes: "",
      }),
    ).toEqual({
      success: true,
      data: {
        shareableNotes: null,
        privateNotes: null,
      },
    });
  });

  it("trims saved notes content", () => {
    expect(
      validateMeetingNotesInput({
        shareableNotes: "  Sent pricing update  ",
        privateNotes: "  Sensitive staffing note  ",
      }),
    ).toEqual({
      success: true,
      data: {
        shareableNotes: "Sent pricing update",
        privateNotes: "Sensitive staffing note",
      },
    });
  });
});

describe("validateDecisionInput", () => {
  it("requires a decision body", () => {
    expect(
      validateDecisionInput({
        body: "   ",
      }),
    ).toEqual({
      success: false,
      state: {
        ...getEmptyDecisionFormState(),
        fieldErrors: {
          body: "Add the decision that came out of this meeting.",
        },
        values: {
          body: "",
        },
      },
    });
  });

  it("trims the decision body before saving", () => {
    expect(
      validateDecisionInput({
        body: "  Ship the pilot to five customers next week.  ",
      }),
    ).toEqual({
      success: true,
      data: {
        body: "Ship the pilot to five customers next week.",
      },
    });
  });
});

describe("form state factories", () => {
  it("builds empty note state", () => {
    expect(getEmptyMeetingNotesFormState()).toEqual({
      fieldErrors: {},
      formError: null,
      values: {
        shareableNotes: "",
        privateNotes: "",
      },
    });
  });
});
