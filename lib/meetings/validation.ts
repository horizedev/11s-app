export type CreateMeetingInput = {
  purpose: string | null;
  scheduledAt: string | null;
};

export type MeetingFormValues = {
  purpose: string;
  scheduledAt: string;
};

export type MeetingFormState = {
  fieldErrors: Partial<Record<keyof MeetingFormValues, string>>;
  formError: string | null;
  values: MeetingFormValues;
};

type ValidationSuccess = {
  success: true;
  data: CreateMeetingInput;
};

type ValidationFailure = {
  success: false;
  state: MeetingFormState;
};

type RawMeetingInput = Partial<
  Record<keyof MeetingFormValues, FormDataEntryValue | string | null | undefined>
>;

export function getEmptyMeetingFormState(): MeetingFormState {
  return {
    fieldErrors: {},
    formError: null,
    values: {
      purpose: "",
      scheduledAt: "",
    },
  };
}

export function toMeetingFormValues(
  input: Partial<CreateMeetingInput>,
): MeetingFormValues {
  return {
    purpose: input.purpose ?? "",
    scheduledAt: input.scheduledAt ?? "",
  };
}

export function validateMeetingInput(
  rawInput: RawMeetingInput,
): ValidationSuccess | ValidationFailure {
  const values: MeetingFormValues = {
    purpose: readTrimmedString(rawInput.purpose),
    scheduledAt: readTrimmedString(rawInput.scheduledAt),
  };

  const fieldErrors: MeetingFormState["fieldErrors"] = {};

  if (values.scheduledAt && Number.isNaN(Date.parse(values.scheduledAt))) {
    fieldErrors.scheduledAt =
      "Enter a valid meeting date and time or leave it blank.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      state: {
        ...getEmptyMeetingFormState(),
        fieldErrors,
        values,
      },
    };
  }

  return {
    success: true,
    data: {
      purpose: values.purpose || null,
      scheduledAt: values.scheduledAt || null,
    },
  };
}

function readTrimmedString(value: RawMeetingInput[keyof RawMeetingInput]) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}
