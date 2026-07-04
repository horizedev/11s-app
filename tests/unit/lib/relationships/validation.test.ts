import { describe, expect, it } from "vitest";

import {
  getEmptyRelationshipFormState,
  validateRelationshipInput,
} from "@/lib/relationships/validation";

describe("validateRelationshipInput", () => {
  it("accepts the minimum required relationship fields", () => {
    const result = validateRelationshipInput({
      personName: "  Alex Morgan  ",
      relationshipType: "manager",
      personContext: "",
      relationshipGoal: "",
      cadence: "",
    });

    expect(result).toEqual({
      success: true,
      data: {
        personName: "Alex Morgan",
        relationshipType: "manager",
        personContext: null,
        relationshipGoal: null,
        cadence: null,
      },
    });
  });

  it("returns field errors and preserves submitted values when required fields are missing", () => {
    const result = validateRelationshipInput({
      personName: "   ",
      relationshipType: "",
      personContext: "Product peer",
      relationshipGoal: "",
      cadence: "weekly",
    });

    expect(result).toEqual({
      success: false,
      state: {
        ...getEmptyRelationshipFormState(),
        fieldErrors: {
          personName: "Enter the person's name.",
          relationshipType: "Choose the relationship type.",
        },
        values: {
          personName: "",
          relationshipType: "",
          personContext: "Product peer",
          relationshipGoal: "",
          cadence: "weekly",
        },
      },
    });
  });

  it("rejects unsupported relationship types and cadences", () => {
    const result = validateRelationshipInput({
      personName: "Taylor",
      relationshipType: "boss",
      personContext: "",
      relationshipGoal: "",
      cadence: "sometimes",
    });

    expect(result).toEqual({
      success: false,
      state: {
        ...getEmptyRelationshipFormState(),
        fieldErrors: {
          relationshipType: "Choose a valid relationship type.",
          cadence: "Choose a valid meeting cadence or leave it blank.",
        },
        values: {
          personName: "Taylor",
          relationshipType: "boss",
          personContext: "",
          relationshipGoal: "",
          cadence: "sometimes",
        },
      },
    });
  });
});
