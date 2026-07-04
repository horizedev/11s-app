import {
  AGENDA_ITEM_CATEGORIES,
  type AgendaItemCategory,
} from "@/lib/agenda/types";

export type CreateAgendaItemInput = {
  title: string;
  description: string | null;
  category: AgendaItemCategory | null;
};

export type AgendaItemFormValues = {
  title: string;
  description: string;
  category: string;
};

export type AgendaItemFormState = {
  fieldErrors: Partial<Record<keyof AgendaItemFormValues, string>>;
  formError: string | null;
  values: AgendaItemFormValues;
};

type ValidationSuccess = {
  success: true;
  data: CreateAgendaItemInput;
};

type ValidationFailure = {
  success: false;
  state: AgendaItemFormState;
};

type RawAgendaItemInput = Partial<
  Record<keyof AgendaItemFormValues, FormDataEntryValue | string | null | undefined>
>;

export function getEmptyAgendaItemFormState(): AgendaItemFormState {
  return {
    fieldErrors: {},
    formError: null,
    values: {
      title: "",
      description: "",
      category: "",
    },
  };
}

export function toAgendaItemFormValues(
  input: Partial<CreateAgendaItemInput>,
): AgendaItemFormValues {
  return {
    title: input.title ?? "",
    description: input.description ?? "",
    category: input.category ?? "",
  };
}

export function validateAgendaItemInput(
  rawInput: RawAgendaItemInput,
): ValidationSuccess | ValidationFailure {
  const values: AgendaItemFormValues = {
    title: readTrimmedString(rawInput.title),
    description: readTrimmedString(rawInput.description),
    category: readTrimmedString(rawInput.category),
  };

  const fieldErrors: AgendaItemFormState["fieldErrors"] = {};

  if (!values.title) {
    fieldErrors.title = "Add an agenda item title before saving.";
  }

  if (
    values.category &&
    !AGENDA_ITEM_CATEGORIES.includes(values.category as AgendaItemCategory)
  ) {
    fieldErrors.category = "Choose a valid agenda category.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      state: {
        ...getEmptyAgendaItemFormState(),
        fieldErrors,
        values,
      },
    };
  }

  return {
    success: true,
    data: {
      title: values.title,
      description: values.description || null,
      category: values.category ? (values.category as AgendaItemCategory) : null,
    },
  };
}

function readTrimmedString(value: RawAgendaItemInput[keyof RawAgendaItemInput]) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}
