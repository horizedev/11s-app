export const ACTION_ITEM_OWNERS = [
  "me",
  "other_person",
  "shared",
  "unspecified",
] as const;

export const ACTION_ITEM_STATUSES = ["open", "completed", "cancelled"] as const;

export type ActionItemOwner = (typeof ACTION_ITEM_OWNERS)[number];
export type ActionItemStatus = (typeof ACTION_ITEM_STATUSES)[number];

export const ACTION_ITEM_OWNER_LABELS: Record<ActionItemOwner, string> = {
  me: "Me",
  other_person: "Other person",
  shared: "Shared",
  unspecified: "Unspecified",
};
