import {
  RELATIONSHIP_CADENCES,
  RELATIONSHIP_TYPES,
  type RelationshipCadence,
  type RelationshipType,
} from "@/lib/relationships/types";

export type CreateRelationshipInput = {
  personName: string;
  relationshipType: RelationshipType;
  personContext: string | null;
  relationshipGoal: string | null;
  cadence: RelationshipCadence | null;
};

export type RelationshipFormValues = {
  personName: string;
  relationshipType: string;
  personContext: string;
  relationshipGoal: string;
  cadence: string;
};

export type RelationshipFormState = {
  fieldErrors: Partial<Record<keyof RelationshipFormValues, string>>;
  formError: string | null;
  values: RelationshipFormValues;
};

type ValidationSuccess = {
  success: true;
  data: CreateRelationshipInput;
};

type ValidationFailure = {
  success: false;
  state: RelationshipFormState;
};

type RawRelationshipInput = Partial<
  Record<keyof RelationshipFormValues, FormDataEntryValue | string | null | undefined>
>;

const relationshipTypeSet = new Set<string>(RELATIONSHIP_TYPES);
const relationshipCadenceSet = new Set<string>(RELATIONSHIP_CADENCES);

export function getEmptyRelationshipFormState(): RelationshipFormState {
  return {
    fieldErrors: {},
    formError: null,
    values: {
      personName: "",
      relationshipType: "",
      personContext: "",
      relationshipGoal: "",
      cadence: "",
    },
  };
}

export function toRelationshipFormValues(
  input: Partial<CreateRelationshipInput>,
): RelationshipFormValues {
  return {
    personName: input.personName ?? "",
    relationshipType: input.relationshipType ?? "",
    personContext: input.personContext ?? "",
    relationshipGoal: input.relationshipGoal ?? "",
    cadence: input.cadence ?? "",
  };
}

export function validateRelationshipInput(
  rawInput: RawRelationshipInput,
): ValidationSuccess | ValidationFailure {
  const values: RelationshipFormValues = {
    personName: readTrimmedString(rawInput.personName),
    relationshipType: readTrimmedString(rawInput.relationshipType),
    personContext: readTrimmedString(rawInput.personContext),
    relationshipGoal: readTrimmedString(rawInput.relationshipGoal),
    cadence: readTrimmedString(rawInput.cadence),
  };

  const fieldErrors: RelationshipFormState["fieldErrors"] = {};

  if (!values.personName) {
    fieldErrors.personName = "Enter the person's name.";
  }

  if (!values.relationshipType) {
    fieldErrors.relationshipType = "Choose the relationship type.";
  } else if (!relationshipTypeSet.has(values.relationshipType)) {
    fieldErrors.relationshipType = "Choose a valid relationship type.";
  }

  if (values.cadence && !relationshipCadenceSet.has(values.cadence)) {
    fieldErrors.cadence = "Choose a valid meeting cadence or leave it blank.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      state: {
        ...getEmptyRelationshipFormState(),
        fieldErrors,
        values,
      },
    };
  }

  return {
    success: true,
    data: {
      personName: values.personName,
      relationshipType: values.relationshipType as RelationshipType,
      personContext: values.personContext || null,
      relationshipGoal: values.relationshipGoal || null,
      cadence: values.cadence
        ? (values.cadence as RelationshipCadence)
        : null,
    },
  };
}

function readTrimmedString(value: RawRelationshipInput[keyof RawRelationshipInput]) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}
