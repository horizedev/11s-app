import type { SupabaseClient } from "@supabase/supabase-js";

import { decryptList, decryptText, encryptList, encryptText, importEncryptionKey } from "@/lib/crypto";
import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";
import {
  dailyPrepLimit,
  FREE_PEOPLE_LIMIT,
  planFromPreferences,
  prepWindowStartIso,
  type Plan,
} from "@/lib/billing";
import type { Locale } from "@/lib/i18n";
import {
  isPersonEmoji,
  pickDefaultEmoji,
  resolvePersonAvatarEmoji,
} from "@/lib/avatars";
import type {
  CareerNeed,
  CareerNeedStatus,
  CareerProfile,
  Discussion,
  DiscussionMood,
  GeneralPrep,
  Person,
  PrepCategory,
  PrepIdea,
  PrepIdeaKind,
  PrepQuota,
  PrepResponse,
  Relationship,
  TalkingPoint,
  TalkingPointSource,
} from "@/lib/types";

type Client = SupabaseClient<Database>;
type PersonRow = Tables<"11s_people">;
type DiscussionRow = Tables<"11s_discussions">;
type PrepIdeaRow = Tables<"11s_prep_ideas">;
type TalkingPointRow = Tables<"11s_talking_points">;
type CareerNeedRow = Tables<"11s_career_needs">;

/**
 * Encryption key for sensitive user content at rest. Resolved lazily and
 * cached for the session: server components use DATA_ENCRYPTION_KEY
 * directly, the browser fetches it once from /api/crypto/key. When no key
 * is configured the app keeps working with plaintext values.
 */
let cachedKey: CryptoKey | null | undefined;

async function getEncryptionKey(): Promise<CryptoKey | null> {
  if (cachedKey !== undefined) return cachedKey;

  let base64: string | undefined;
  if (typeof window === "undefined") {
    base64 = process.env.DATA_ENCRYPTION_KEY;
  } else {
    try {
      const response = await fetch("/api/crypto/key");
      if (response.ok) {
        const body = (await response.json()) as { key?: string };
        base64 = body.key;
      }
    } catch {
      base64 = undefined;
    }
  }

  if (!base64) {
    cachedKey = null;
    return null;
  }

  try {
    cachedKey = await importEncryptionKey(base64);
  } catch {
    cachedKey = null;
  }
  return cachedKey;
}

const enc = async (
  value: string | null | undefined,
): Promise<string | null> => {
  if (value == null || value === "") return value ?? null;
  const key = await getEncryptionKey();
  return key ? encryptText(value, key) : value;
};

/** Encrypts a value for a not-null text column (empty string stays as-is). */
const encReq = async (value: string): Promise<string> => {
  if (value === "") return value;
  const key = await getEncryptionKey();
  return key ? encryptText(value, key) : value;
};

const dec = async <T extends string | null | undefined>(value: T): Promise<T> => {
  if (!value) return value;
  const key = await getEncryptionKey();
  return (key ? await decryptText(value, key) : value) as T;
};

const encList = async (items: string[]): Promise<string[]> => {
  const key = await getEncryptionKey();
  return key ? encryptList(items, key) : items;
};

const decList = async (items: string[]): Promise<string[]> => {
  const key = await getEncryptionKey();
  return key ? decryptList(items, key) : items;
};

export type PrepMetaByPerson = Record<
  string,
  Pick<PrepResponse, "opening" | "source">
>;

export type WorkspaceSnapshot = {
  people: Person[];
  prepMeta: PrepMetaByPerson;
  contextBank: string;
  generalPrep: GeneralPrep;
  career: CareerProfile;
  locale: Locale | null;
  plan: Plan;
  prepQuota: PrepQuota;
};

export class PlanLimitError extends Error {
  code = "PLAN_LIMIT_PEOPLE";

  constructor() {
    super("The free plan has reached its people limit.");
  }
}

type NewPersonData = Pick<
  Person,
  | "name"
  | "role"
  | "organization"
  | "relationship"
  | "notes"
  | "background"
  | "linkedinUrl"
  | "avatarEmoji"
>;

type PersonFields = {
  name?: string;
  role?: string;
  organization?: string;
  relationship?: Relationship;
  notes?: string;
  lastNotes?: string;
  lastMeetingAt?: string;
  background?: string;
  linkedinUrl?: string;
  avatarEmoji?: string | null;
  prepOpening?: string | null;
  prepSource?: PrepResponse["source"] | null;
};

async function toDiscussion(row: DiscussionRow): Promise<Discussion> {
  return {
    id: row.id,
    date: row.occurred_at,
    title: await dec(row.title),
    summary: await dec(row.summary),
    topics: await decList(row.topics),
    followUps: await decList(row.follow_ups),
    mood: row.mood as DiscussionMood,
  };
}

async function toPrepIdea(row: PrepIdeaRow): Promise<PrepIdea> {
  return {
    id: row.id,
    category: row.category as PrepCategory,
    title: await dec(row.title),
    rationale: await dec(row.rationale),
    prompt: await dec(row.prompt),
    kind: (row.kind as PrepIdeaKind) || "support",
  };
}

async function toCareerNeed(row: CareerNeedRow): Promise<CareerNeed> {
  return {
    id: row.id,
    body: await dec(row.body),
    status: row.status as CareerNeedStatus,
    createdAt: row.created_at,
  };
}

async function toTalkingPoint(row: TalkingPointRow): Promise<TalkingPoint> {
  return {
    id: row.id,
    body: await dec(row.body),
    source: (row.source as TalkingPointSource) || "manual",
  };
}

async function toPerson(
  row: PersonRow,
  discussions: Discussion[],
  prepIdeas: PrepIdea[],
  talkingPoints: TalkingPoint[],
): Promise<Person> {
  return {
    id: row.id,
    name: await dec(row.name),
    role: await dec(row.role),
    organization: await dec(row.organization),
    relationship: row.relationship as Relationship,
    lastMeetingAt: row.last_meeting_at ?? "",
    notes: await dec(row.notes),
    lastNotes: await dec(row.last_notes ?? ""),
    background: await dec(row.background ?? ""),
    linkedinUrl: await dec(row.linkedin_url ?? ""),
    avatarEmoji: resolvePersonAvatarEmoji(row.avatar_path),
    color: row.color,
    discussions,
    prepIdeas,
    talkingPoints,
  };
}

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function loadPrepQuota(
  client: Client,
  plan: Plan,
): Promise<PrepQuota> {
  const { count, error } = await client
    .from("11s_prep_usage")
    .select("id", { count: "exact", head: true })
    .gte("created_at", prepWindowStartIso());
  throwIfError(error);

  return {
    used: count ?? 0,
    limit: dailyPrepLimit(plan),
  };
}

export async function loadWorkspace(client: Client): Promise<WorkspaceSnapshot> {
  const [
    peopleResult,
    discussionsResult,
    ideasResult,
    talkingPointsResult,
    preferenceResult,
    careerNeedsResult,
  ] = await Promise.all([
    client
      .from("11s_people")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    client
      .from("11s_discussions")
      .select("*")
      .order("occurred_at", { ascending: false }),
    client
      .from("11s_prep_ideas")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    client
      .from("11s_talking_points")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    client
      .from("11s_preferences")
      .select(
        "locale, plan, subscription_status, stripe_customer_id, current_period_end, context_bank, general_prep_opening, general_prep_source, brag_doc, career_direction, career_target_role, career_timeline",
      )
      .maybeSingle(),
    client
      .from("11s_career_needs")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  throwIfError(peopleResult.error);
  throwIfError(discussionsResult.error);
  throwIfError(ideasResult.error);
  throwIfError(talkingPointsResult.error);
  throwIfError(preferenceResult.error);
  throwIfError(careerNeedsResult.error);

  const discussionsByPerson = new Map<string, Discussion[]>();
  for (const row of discussionsResult.data ?? []) {
    const current = discussionsByPerson.get(row.person_id) ?? [];
    current.push(await toDiscussion(row));
    discussionsByPerson.set(row.person_id, current);
  }

  const ideasByPerson = new Map<string, PrepIdea[]>();
  const generalIdeas: PrepIdea[] = [];
  for (const row of ideasResult.data ?? []) {
    if (row.person_id === null) {
      generalIdeas.push(await toPrepIdea(row));
      continue;
    }
    const current = ideasByPerson.get(row.person_id) ?? [];
    current.push(await toPrepIdea(row));
    ideasByPerson.set(row.person_id, current);
  }

  const talkingPointsByPerson = new Map<string, TalkingPoint[]>();
  for (const row of talkingPointsResult.data ?? []) {
    const current = talkingPointsByPerson.get(row.person_id) ?? [];
    current.push(await toTalkingPoint(row));
    talkingPointsByPerson.set(row.person_id, current);
  }

  const prepMeta: PrepMetaByPerson = {};
  const people = await Promise.all(
    (peopleResult.data ?? []).map(async (row) => {
      if (row.prep_opening && row.prep_source) {
        prepMeta[row.id] = {
          opening: await dec(row.prep_opening),
          source: row.prep_source as PrepResponse["source"],
        };
      }

      return toPerson(
        row,
        discussionsByPerson.get(row.id) ?? [],
        ideasByPerson.get(row.id) ?? [],
        talkingPointsByPerson.get(row.id) ?? [],
      );
    }),
  );

  const savedLocale = preferenceResult.data?.locale;
  const generalSource = preferenceResult.data?.general_prep_source;
  const plan = planFromPreferences(preferenceResult.data);
  const prepQuota = await loadPrepQuota(client, plan);

  return {
    people,
    prepMeta,
    contextBank: await dec(preferenceResult.data?.context_bank ?? ""),
    generalPrep: {
      opening: await dec(preferenceResult.data?.general_prep_opening ?? ""),
      ideas: generalIdeas,
      source:
        generalSource === "ai" || generalSource === "starter"
          ? generalSource
          : null,
    },
    career: {
      direction: await dec(preferenceResult.data?.career_direction ?? ""),
      targetRole: await dec(preferenceResult.data?.career_target_role ?? ""),
      timeline: await dec(preferenceResult.data?.career_timeline ?? ""),
      bragDoc: await dec(preferenceResult.data?.brag_doc ?? ""),
      needs: await Promise.all(
        (careerNeedsResult.data ?? []).map(toCareerNeed),
      ),
    },
    locale:
      savedLocale === "en" || savedLocale === "zh-TW" ? savedLocale : null,
    plan,
    prepQuota,
  };
}

export async function createPerson(
  client: Client,
  userId: string,
  input: NewPersonData,
  color: string,
  sortOrder: number,
): Promise<Person> {
  const { data: preferences } = await client
    .from("11s_preferences")
    .select("plan, subscription_status, stripe_customer_id, current_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  if (planFromPreferences(preferences) === "free") {
    const { count } = await client
      .from("11s_people")
      .select("id", { count: "exact", head: true });
    if ((count ?? 0) >= FREE_PEOPLE_LIMIT) {
      throw new PlanLimitError();
    }
  }

  const avatarEmoji =
    input.avatarEmoji && isPersonEmoji(input.avatarEmoji)
      ? input.avatarEmoji
      : pickDefaultEmoji(input.name || crypto.randomUUID());

  const person: Person = {
    id: crypto.randomUUID(),
    name: input.name,
    role: input.role,
    organization: input.organization,
    relationship: input.relationship,
    notes: input.notes,
    lastMeetingAt: "",
    lastNotes: "",
    background: input.background ?? "",
    linkedinUrl: input.linkedinUrl ?? "",
    avatarEmoji,
    color,
    discussions: [],
    prepIdeas: [],
    talkingPoints: [],
  };

  const row: TablesInsert<"11s_people"> = {
    id: person.id,
    user_id: userId,
    name: await encReq(person.name),
    role: await encReq(person.role),
    organization: await encReq(person.organization),
    relationship: person.relationship,
    notes: await encReq(person.notes),
    last_notes: "",
    background: await encReq(person.background),
    linkedin_url: await encReq(person.linkedinUrl),
    avatar_path: person.avatarEmoji,
    color: person.color,
    sort_order: sortOrder,
  };

  const result = await client.from("11s_people").insert(row);
  throwIfError(result.error);
  return person;
}

export async function savePersonFields(
  client: Client,
  personId: string,
  fields: PersonFields,
) {
  const update: TablesUpdate<"11s_people"> = {
    updated_at: new Date().toISOString(),
  };

  if (fields.name !== undefined) update.name = await encReq(fields.name);
  if (fields.role !== undefined) update.role = await encReq(fields.role);
  if (fields.organization !== undefined) {
    update.organization = await encReq(fields.organization);
  }
  if (fields.relationship !== undefined) {
    update.relationship = fields.relationship;
  }
  if (fields.notes !== undefined) update.notes = await encReq(fields.notes);
  if (fields.lastNotes !== undefined) update.last_notes = await encReq(fields.lastNotes);
  if (fields.background !== undefined) update.background = await encReq(fields.background);
  if (fields.linkedinUrl !== undefined) update.linkedin_url = await encReq(fields.linkedinUrl);
  if (fields.avatarEmoji !== undefined) update.avatar_path = fields.avatarEmoji;
  if (fields.lastMeetingAt !== undefined) {
    update.last_meeting_at = fields.lastMeetingAt || null;
  }
  if (fields.prepOpening !== undefined) {
    update.prep_opening = await enc(fields.prepOpening);
  }
  if (fields.prepSource !== undefined) {
    update.prep_source = fields.prepSource;
  }

  const result = await client
    .from("11s_people")
    .update(update)
    .eq("id", personId);
  throwIfError(result.error);
}

export async function deletePerson(client: Client, personId: string) {
  const result = await client.from("11s_people").delete().eq("id", personId);
  throwIfError(result.error);
}

export async function createDiscussion(
  client: Client,
  userId: string,
  personId: string,
  input: Omit<Discussion, "id">,
) {
  const discussion: Discussion = {
    id: crypto.randomUUID(),
    ...input,
  };

  const row: TablesInsert<"11s_discussions"> = {
    id: discussion.id,
    user_id: userId,
    person_id: personId,
    occurred_at: discussion.date,
    title: await encReq(discussion.title),
    summary: await encReq(discussion.summary),
    topics: await encList(discussion.topics),
    follow_ups: await encList(discussion.followUps),
    mood: discussion.mood,
  };

  const result = await client.from("11s_discussions").insert(row);
  throwIfError(result.error);
  await savePersonFields(client, personId, {
    lastMeetingAt: discussion.date,
  });

  return discussion;
}

export async function updateDiscussion(
  client: Client,
  personId: string,
  discussionId: string,
  input: Omit<Discussion, "id">,
  discussions: Discussion[],
) {
  const update: TablesUpdate<"11s_discussions"> = {
    occurred_at: input.date,
    title: await encReq(input.title),
    summary: await encReq(input.summary),
    topics: await encList(input.topics),
    follow_ups: await encList(input.followUps),
    mood: input.mood,
  };

  const result = await client
    .from("11s_discussions")
    .update(update)
    .eq("id", discussionId);
  throwIfError(result.error);

  const nextDiscussions = discussions
    .map((discussion) =>
      discussion.id === discussionId
        ? { id: discussionId, ...input }
        : discussion,
    )
    .toSorted(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

  await savePersonFields(client, personId, {
    lastMeetingAt: nextDiscussions[0]?.date ?? "",
  });

  return nextDiscussions;
}

export async function replacePrepIdeas(
  client: Client,
  userId: string,
  personId: string,
  response: PrepResponse,
) {
  const deleteResult = await client
    .from("11s_prep_ideas")
    .delete()
    .eq("person_id", personId);
  throwIfError(deleteResult.error);

  if (response.ideas.length > 0) {
    const rows: TablesInsert<"11s_prep_ideas">[] = await Promise.all(
      response.ideas.map(async (idea, index) => ({
        id: idea.id,
        user_id: userId,
        person_id: personId,
        category: idea.category,
        title: await encReq(idea.title),
        rationale: await encReq(idea.rationale),
        prompt: await encReq(idea.prompt),
        kind: idea.kind ?? "support",
        sort_order: index,
      })),
    );
    const insertResult = await client.from("11s_prep_ideas").insert(rows);
    throwIfError(insertResult.error);
  }

  await savePersonFields(client, personId, {
    prepOpening: response.opening,
    prepSource: response.source,
  });
}

export async function replaceGeneralPrepIdeas(
  client: Client,
  userId: string,
  response: PrepResponse,
) {
  const deleteResult = await client
    .from("11s_prep_ideas")
    .delete()
    .eq("user_id", userId)
    .is("person_id", null);
  throwIfError(deleteResult.error);

  if (response.ideas.length > 0) {
    const rows: TablesInsert<"11s_prep_ideas">[] = await Promise.all(
      response.ideas.map(async (idea, index) => ({
        id: idea.id,
        user_id: userId,
        person_id: null,
        category: idea.category,
        title: await encReq(idea.title),
        rationale: await encReq(idea.rationale),
        prompt: await encReq(idea.prompt),
        kind: idea.kind ?? "support",
        sort_order: index,
      })),
    );
    const insertResult = await client.from("11s_prep_ideas").insert(rows);
    throwIfError(insertResult.error);
  }

  const preferenceResult = await client.from("11s_preferences").upsert({
    user_id: userId,
    general_prep_opening: await enc(response.opening),
    general_prep_source: response.source,
    updated_at: new Date().toISOString(),
  });
  throwIfError(preferenceResult.error);
}

export async function dismissPrepIdea(client: Client, ideaId: string) {
  const result = await client
    .from("11s_prep_ideas")
    .delete()
    .eq("id", ideaId);
  throwIfError(result.error);
}

export async function createTalkingPoint(
  client: Client,
  userId: string,
  personId: string,
  body: string,
  source: TalkingPointSource,
  sortOrder: number,
): Promise<TalkingPoint> {
  const point: TalkingPoint = {
    id: crypto.randomUUID(),
    body,
    source,
  };

  const row: TablesInsert<"11s_talking_points"> = {
    id: point.id,
    user_id: userId,
    person_id: personId,
    body: await encReq(point.body),
    source: point.source,
    sort_order: sortOrder,
  };

  const result = await client.from("11s_talking_points").insert(row);
  throwIfError(result.error);
  return point;
}

export async function deleteTalkingPoint(client: Client, pointId: string) {
  const result = await client
    .from("11s_talking_points")
    .delete()
    .eq("id", pointId);
  throwIfError(result.error);
}

export async function saveContextBank(
  client: Client,
  userId: string,
  contextBank: string,
) {
  const result = await client.from("11s_preferences").upsert({
    user_id: userId,
    context_bank: await encReq(contextBank),
    updated_at: new Date().toISOString(),
  });
  throwIfError(result.error);
}

export async function saveCareerProfile(
  client: Client,
  userId: string,
  profile: {
    direction: string;
    targetRole: string;
    timeline: string;
    bragDoc: string;
  },
) {
  const result = await client.from("11s_preferences").upsert({
    user_id: userId,
    career_direction: await encReq(profile.direction),
    career_target_role: await encReq(profile.targetRole),
    career_timeline: await encReq(profile.timeline),
    brag_doc: await encReq(profile.bragDoc),
    updated_at: new Date().toISOString(),
  });
  throwIfError(result.error);
}

export async function createCareerNeed(
  client: Client,
  userId: string,
  body: string,
): Promise<CareerNeed> {
  const need: CareerNeed = {
    id: crypto.randomUUID(),
    body,
    status: "open",
    createdAt: new Date().toISOString(),
  };

  const row: TablesInsert<"11s_career_needs"> = {
    id: need.id,
    user_id: userId,
    body: await encReq(need.body),
    status: need.status,
    created_at: need.createdAt,
  };

  const result = await client.from("11s_career_needs").insert(row);
  throwIfError(result.error);
  return need;
}

export async function updateCareerNeedStatus(
  client: Client,
  needId: string,
  status: CareerNeedStatus,
) {
  const result = await client
    .from("11s_career_needs")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", needId);
  throwIfError(result.error);
}

export async function deleteCareerNeed(client: Client, needId: string) {
  const result = await client
    .from("11s_career_needs")
    .delete()
    .eq("id", needId);
  throwIfError(result.error);
}

export async function grantPrepCreditForLogging(
  client: Client,
  userId: string,
  plan: Plan,
): Promise<boolean> {
  if (plan !== "free") return false;

  const { data, error } = await client
    .from("11s_prep_usage")
    .select("id")
    .eq("user_id", userId)
    .gte("created_at", prepWindowStartIso())
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  throwIfError(error);

  if (!data) return false;

  const deleteResult = await client
    .from("11s_prep_usage")
    .delete()
    .eq("id", data.id);
  throwIfError(deleteResult.error);
  return true;
}

export async function saveLocale(
  client: Client,
  userId: string,
  locale: Locale,
) {
  const result = await client.from("11s_preferences").upsert({
    user_id: userId,
    locale,
    updated_at: new Date().toISOString(),
  });
  throwIfError(result.error);
}
