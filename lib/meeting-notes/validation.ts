export type SaveMeetingNotesInput = {
  shareableNotes: string | null;
  privateNotes: string | null;
};

export type CreateDecisionInput = {
  body: string;
};

export type MeetingNotesFormValues = {
  shareableNotes: string;
  privateNotes: string;
};

export type MeetingNotesFormState = {
  fieldErrors: Partial<Record<keyof MeetingNotesFormValues, string>>;
  formError: string | null;
  values: MeetingNotesFormValues;
};

export type DecisionFormValues = {
  body: string;
};

export type DecisionFormState = {
  fieldErrors: Partial<Record<keyof DecisionFormValues, string>>;
  formError: string | null;
  values: DecisionFormValues;
};

type ValidationSuccess<T> = {
  success: true;
  data: T;
};

type ValidationFailure<T> = {
  success: false;
  state: T;
};

type RawMeetingNotesInput = Partial<
  Record<keyof MeetingNotesFormValues, FormDataEntryValue | string | null | undefined>
>;

type RawDecisionInput = Partial<
  Record<keyof DecisionFormValues, FormDataEntryValue | string | null | undefined>
>;

export function getEmptyMeetingNotesFormState(): MeetingNotesFormState {
  return {
    fieldErrors: {},
    formError: null,
    values: {
      shareableNotes: "",
      privateNotes: "",
    },
  };
}

export function getEmptyDecisionFormState(): DecisionFormState {
  return {
    fieldErrors: {},
    formError: null,
    values: {
      body: "",
    },
  };
}

export function toMeetingNotesFormValues(
  input: Partial<SaveMeetingNotesInput>,
): MeetingNotesFormValues {
  return {
    shareableNotes: input.shareableNotes ?? "",
    privateNotes: input.privateNotes ?? "",
  };
}

export function toDecisionFormValues(
  input: Partial<CreateDecisionInput>,
): DecisionFormValues {
  return {
    body: input.body ?? "",
  };
}

export function validateMeetingNotesInput(
  rawInput: RawMeetingNotesInput,
): ValidationSuccess<SaveMeetingNotesInput> | ValidationFailure<MeetingNotesFormState> {
  const values = {
    shareableNotes: readTrimmedString(rawInput.shareableNotes),
    privateNotes: readTrimmedString(rawInput.privateNotes),
  };

  return {
    success: true,
    data: {
      shareableNotes: values.shareableNotes || null,
      privateNotes: values.privateNotes || null,
    },
  };
}

export function validateDecisionInput(
  rawInput: RawDecisionInput,
): ValidationSuccess<CreateDecisionInput> | ValidationFailure<DecisionFormState> {
  const values = {
    body: readTrimmedString(rawInput.body),
  };

  if (!values.body) {
    return {
      success: false,
      state: {
        ...getEmptyDecisionFormState(),
        fieldErrors: {
          body: "Add the decision that came out of this meeting.",
        },
        values,
      },
    };
  }

  return {
    success: true,
    data: values,
  };
}

function readTrimmedString(
  value: FormDataEntryValue | string | null | undefined,
) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}
