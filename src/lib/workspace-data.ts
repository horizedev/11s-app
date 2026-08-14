import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/database.types";
import {
  FREE_PEOPLE_LIMIT,
  FREE_PREPS_PER_30_DAYS,
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
} from "@/lib/types";

type Client = SupabaseClient<Database>;
type PersonRow = Tables<"11s_people">;
type DiscussionRow = Tables<"11s_discussions">;
type PrepIdeaRow = Tables<"11s_prep_ideas">;
type CareerNeedRow = Tables<"11s_career_needs">;

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

function toDiscussion(row: DiscussionRow): Discussion {
  return {
    id: row.id,
    date: row.occurred_at,
    title: row.title,
    summary: row.summary,
    topics: row.topics,
    followUps: row.follow_ups,
    mood: row.mood as DiscussionMood,
  };
}

function toPrepIdea(row: PrepIdeaRow): PrepIdea {
  return {
    id: row.id,
    category: row.category as PrepCategory,
    title: row.title,
    rationale: row.rationale,
    prompt: row.prompt,
    kind: (row.kind as PrepIdeaKind) || "support",
  };
}

function toCareerNeed(row: CareerNeedRow): CareerNeed {
  return {
    id: row.id,
    body: row.body,
    status: row.status as CareerNeedStatus,
    createdAt: row.created_at,
  };
}

function toPerson(
  row: PersonRow,
  discussions: Discussion[],
  prepIdeas: PrepIdea[],
): Person {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    organization: row.organization,
    relationship: row.relationship as Relationship,
    lastMeetingAt: row.last_meeting_at ?? "",
    notes: row.notes,
    lastNotes: row.last_notes ?? "",
    background: row.background ?? "",
    linkedinUrl: row.linkedin_url ?? "",
    avatarEmoji: resolvePersonAvatarEmoji(row.avatar_path),
    color: row.color,
    discussions,
    prepIdeas,
  };
}

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function loadPrepQuota(
  client: Client,
  plan: Plan,
): Promise<PrepQuota> {
  if (plan === "pro") {
    return { used: 0, limit: null };
  }

  const { count, error } = await client
    .from("11s_prep_usage")
    .select("id", { count: "exact", head: true })
    .gte("created_at", prepWindowStartIso());
  throwIfError(error);

  return {
    used: count ?? 0,
    limit: FREE_PREPS_PER_30_DAYS,
  };
}

export async function loadWorkspace(client: Client): Promise<WorkspaceSnapshot> {
  const [
    peopleResult,
    discussionsResult,
    ideasResult,
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
  throwIfError(preferenceResult.error);
  throwIfError(careerNeedsResult.error);

  const discussionsByPerson = new Map<string, Discussion[]>();
  for (const row of discussionsResult.data ?? []) {
    const current = discussionsByPerson.get(row.person_id) ?? [];
    current.push(toDiscussion(row));
    discussionsByPerson.set(row.person_id, current);
  }

  const ideasByPerson = new Map<string, PrepIdea[]>();
  const generalIdeas: PrepIdea[] = [];
  for (const row of ideasResult.data ?? []) {
    if (row.person_id === null) {
      generalIdeas.push(toPrepIdea(row));
      continue;
    }
    const current = ideasByPerson.get(row.person_id) ?? [];
    current.push(toPrepIdea(row));
    ideasByPerson.set(row.person_id, current);
  }

  const prepMeta: PrepMetaByPerson = {};
  const people = (peopleResult.data ?? []).map((row) => {
    if (row.prep_opening && row.prep_source) {
      prepMeta[row.id] = {
        opening: row.prep_opening,
        source: row.prep_source as PrepResponse["source"],
      };
    }

    return toPerson(
      row,
      discussionsByPerson.get(row.id) ?? [],
      ideasByPerson.get(row.id) ?? [],
    );
  });

  const savedLocale = preferenceResult.data?.locale;
  const generalSource = preferenceResult.data?.general_prep_source;
  const plan = planFromPreferences(preferenceResult.data);
  const prepQuota = await loadPrepQuota(client, plan);

  return {
    people,
    prepMeta,
    contextBank: preferenceResult.data?.context_bank ?? "",
    generalPrep: {
      opening: preferenceResult.data?.general_prep_opening ?? "",
      ideas: generalIdeas,
      source:
        generalSource === "ai" || generalSource === "starter"
          ? generalSource
          : null,
    },
    career: {
      direction: preferenceResult.data?.career_direction ?? "",
      targetRole: preferenceResult.data?.career_target_role ?? "",
      timeline: preferenceResult.data?.career_timeline ?? "",
      bragDoc: preferenceResult.data?.brag_doc ?? "",
      needs: (careerNeedsResult.data ?? []).map(toCareerNeed),
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
  };

  const row: TablesInsert<"11s_people"> = {
    id: person.id,
    user_id: userId,
    name: person.name,
    role: person.role,
    organization: person.organization,
    relationship: person.relationship,
    notes: person.notes,
    last_notes: "",
    background: person.background,
    linkedin_url: person.linkedinUrl,
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

  if (fields.name !== undefined) update.name = fields.name;
  if (fields.role !== undefined) update.role = fields.role;
  if (fields.organization !== undefined) {
    update.organization = fields.organization;
  }
  if (fields.relationship !== undefined) {
    update.relationship = fields.relationship;
  }
  if (fields.notes !== undefined) update.notes = fields.notes;
  if (fields.lastNotes !== undefined) update.last_notes = fields.lastNotes;
  if (fields.background !== undefined) update.background = fields.background;
  if (fields.linkedinUrl !== undefined) update.linkedin_url = fields.linkedinUrl;
  if (fields.avatarEmoji !== undefined) update.avatar_path = fields.avatarEmoji;
  if (fields.lastMeetingAt !== undefined) {
    update.last_meeting_at = fields.lastMeetingAt || null;
  }
  if (fields.prepOpening !== undefined) {
    update.prep_opening = fields.prepOpening;
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
    title: discussion.title,
    summary: discussion.summary,
    topics: discussion.topics,
    follow_ups: discussion.followUps,
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
    title: input.title,
    summary: input.summary,
    topics: input.topics,
    follow_ups: input.followUps,
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
    const rows: TablesInsert<"11s_prep_ideas">[] = response.ideas.map(
      (idea, index) => ({
        id: idea.id,
        user_id: userId,
        person_id: personId,
        category: idea.category,
        title: idea.title,
        rationale: idea.rationale,
        prompt: idea.prompt,
        kind: idea.kind ?? "support",
        sort_order: index,
      }),
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
    const rows: TablesInsert<"11s_prep_ideas">[] = response.ideas.map(
      (idea, index) => ({
        id: idea.id,
        user_id: userId,
        person_id: null,
        category: idea.category,
        title: idea.title,
        rationale: idea.rationale,
        prompt: idea.prompt,
        kind: idea.kind ?? "support",
        sort_order: index,
      }),
    );
    const insertResult = await client.from("11s_prep_ideas").insert(rows);
    throwIfError(insertResult.error);
  }

  const preferenceResult = await client.from("11s_preferences").upsert({
    user_id: userId,
    general_prep_opening: response.opening,
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

export async function saveContextBank(
  client: Client,
  userId: string,
  contextBank: string,
) {
  const result = await client.from("11s_preferences").upsert({
    user_id: userId,
    context_bank: contextBank,
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
    career_direction: profile.direction,
    career_target_role: profile.targetRole,
    career_timeline: profile.timeline,
    brag_doc: profile.bragDoc,
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
    body: need.body,
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
