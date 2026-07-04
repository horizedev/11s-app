export const RELATIONSHIP_TYPES = [
  "manager",
  "direct_report",
  "peer",
  "mentor",
  "client",
  "friend_family",
  "other",
] as const;

export const RELATIONSHIP_CADENCES = [
  "weekly",
  "biweekly",
  "monthly",
  "quarterly",
] as const;

export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];
export type RelationshipCadence = (typeof RELATIONSHIP_CADENCES)[number];

export const RELATIONSHIP_TYPE_LABELS: Record<RelationshipType, string> = {
  manager: "Manager",
  direct_report: "Direct report",
  peer: "Peer",
  mentor: "Mentor",
  client: "Client",
  friend_family: "Friend or family",
  other: "Other",
};

export const RELATIONSHIP_CADENCE_LABELS: Record<RelationshipCadence, string> = {
  weekly: "Weekly",
  biweekly: "Every 2 weeks",
  monthly: "Monthly",
  quarterly: "Quarterly",
};
