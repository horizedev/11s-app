import { describe, expect, it } from "vitest";

import {
  getEmptyMeetingFormState,
  validateMeetingInput,
} from "@/lib/meetings/validation";

describe("validateMeetingInput", () => {
  it("accepts an empty draft meeting payload", () => {
    const result = validateMeetingInput({
      purpose: "",
      scheduledAt: "",
    });

    expect(result).toEqual({
      success: true,
      data: {
        purpose: null,
        scheduledAt: null,
      },
    });
  });

  it("rejects an invalid scheduled date while preserving submitted values", () => {
    const result = validateMeetingInput({
      purpose: "Promotion check-in",
      scheduledAt: "not-a-date",
    });

    expect(result).toEqual({
      success: false,
      state: {
        ...getEmptyMeetingFormState(),
        fieldErrors: {
          scheduledAt: "Enter a valid meeting date and time or leave it blank.",
        },
        values: {
          purpose: "Promotion check-in",
          scheduledAt: "not-a-date",
        },
      },
    });
  });
});
