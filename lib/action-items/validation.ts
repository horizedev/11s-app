import {
  ACTION_ITEM_OWNERS,
  type ActionItemOwner,
} from "@/lib/action-items/types";

export type CreateActionItemInput = {
  title: string;
  owner: ActionItemOwner;
  dueDate: string | null;
  notes: string | null;
};

export type ActionItemFormValues = {
  title: string;
  owner: string;
  dueDate: string;
  notes: string;
};

export type ActionItemFormState = {
  fieldErrors: Partial<Record<keyof ActionItemFormValues, string>>;
  formError: string | null;
  values: ActionItemFormValues;
};

type ValidationSuccess = {
  success: true;
  data: CreateActionItemInput;
};

type ValidationFailure = {
  success: false;
  state: ActionItemFormState;
};

type RawActionItemInput = Partial<
  Record<keyof ActionItemFormValues, FormDataEntryValue | string | null | undefined>
>;

const actionItemOwnerSet = new Set<string>(ACTION_ITEM_OWNERS);

export function getEmptyActionItemFormState(): ActionItemFormState {
  return {
    fieldErrors: {},
    formError: null,
    values: {
      title: "",
      owner: "unspecified",
      dueDate: "",
      notes: "",
    },
  };
}

export function toActionItemFormValues(
  input: Partial<CreateActionItemInput>,
): ActionItemFormValues {
  return {
    title: input.title ?? "",
    owner: input.owner ?? "unspecified",
    dueDate: input.dueDate ?? "",
    notes: input.notes ?? "",
  };
}

export function validateActionItemInput(
  rawInput: RawActionItemInput,
): ValidationSuccess | ValidationFailure {
  const values: ActionItemFormValues = {
    title: readTrimmedString(rawInput.title),
    owner: readTrimmedString(rawInput.owner) || "unspecified",
    dueDate: readTrimmedString(rawInput.dueDate),
    notes: readTrimmedString(rawInput.notes),
  };

  const fieldErrors: ActionItemFormState["fieldErrors"] = {};

  if (!values.title) {
    fieldErrors.title = "Add an action item title before saving.";
  }

  if (!actionItemOwnerSet.has(values.owner)) {
    fieldErrors.owner = "Choose a valid owner.";
  }

  if (values.dueDate && Number.isNaN(Date.parse(values.dueDate))) {
    fieldErrors.dueDate = "Choose a valid due date or leave it blank.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      state: {
        ...getEmptyActionItemFormState(),
        fieldErrors,
        values,
      },
    };
  }

  return {
    success: true,
    data: {
      title: values.title,
      owner: values.owner as ActionItemOwner,
      dueDate: values.dueDate || null,
      notes: values.notes || null,
    },
  };
}

function readTrimmedString(value: RawActionItemInput[keyof RawActionItemInput]) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}
