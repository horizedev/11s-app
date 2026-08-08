import { generateText, Output } from "ai";
import { z } from "zod";

import { getDictionary, type Locale } from "@/lib/i18n";
import type { PrepCategory, PrepIdea, PrepResponse } from "@/lib/types";

export const runtime = "nodejs";

const categorySchema = z.enum([
  "Follow up",
  "Growth",
  "Support",
  "Alignment",
  "Personal",
]);

const requestSchema = z.object({
  locale: z.enum(["en", "zh-TW"]).optional(),
  person: z.object({
    name: z.string().min(1).max(120),
    role: z.string().max(160),
    organization: z.string().max(160),
    relationship: z.enum([
      "manager",
      "direct-report",
      "peer",
      "mentor",
      "friend",
    ]),
    cadence: z.string().max(80),
    notes: z.string().max(12_000),
    discussions: z
      .array(
        z.object({
          date: z.string().max(80),
          title: z.string().max(200),
          summary: z.string().max(2_000),
          topics: z.array(z.string().max(160)).max(12),
          followUps: z.array(z.string().max(300)).max(12),
        }),
      )
      .max(10),
  }),
});

const aiOutputSchema = z.object({
  opening: z.string().min(1).max(220),
  ideas: z
    .array(
      z.object({
        category: categorySchema,
        title: z.string().min(3).max(100),
        rationale: z.string().min(5).max(240),
        prompt: z.string().min(3).max(180),
      }),
    )
    .min(4)
    .max(6),
});

type PrepInput = z.infer<typeof requestSchema>["person"];

function makeIdea(
  category: PrepCategory,
  title: string,
  rationale: string,
  prompt: string,
): PrepIdea {
  return {
    id: crypto.randomUUID(),
    category,
    title,
    rationale,
    prompt,
  };
}

function buildStarterResponse(
  person: PrepInput,
  locale: Locale,
): PrepResponse {
  const t = getDictionary(locale);
  const noteLines = person.notes
    .split("\n")
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
  const latest = person.discussions[0];
  const unresolved = latest?.followUps[0];
  const latestTopic = latest?.topics[0];
  const relationship = t.relationship[person.relationship];

  const ideas: PrepIdea[] = [];

  if (locale === "zh-TW") {
    if (unresolved) {
      ideas.push(
        makeIdea(
          "Follow up",
          `跟進「${unresolved}」`,
          "這是你最近一次對話留下的追蹤事項。",
          `自從我們約定「${unresolved}」之後，有什麼變化？`,
        ),
      );
    } else if (latestTopic) {
      ideas.push(
        makeIdea(
          "Follow up",
          `再談一次「${latestTopic}」`,
          "回到近期主題，可以延續對話的連貫性。",
          `自從上次談過「${latestTopic}」之後，你的想法有什麼演變？`,
        ),
      );
    }

    if (noteLines[0]) {
      ideas.push(
        makeIdea(
          "Alignment",
          noteLines[0],
          "這直接來自你為下次對話保存的筆記。",
          `關於「${noteLines[0]}」，什麼結果會最有幫助？`,
        ),
      );
    }

    if (noteLines[1]) {
      ideas.push(
        makeIdea(
          "Support",
          noteLines[1],
          "你的筆記顯示這值得專屬空間，而不只是快速更新。",
          `圍繞「${noteLines[1]}」，什麼支持或釐清會最有幫助？`,
        ),
      );
    }

    ideas.push(
      makeIdea(
        person.relationship === "friend" ? "Personal" : "Growth",
        person.relationship === "friend"
          ? "留一點空間做私人關心"
          : "邀請一段坦誠的回饋",
        `與${relationship}的固定對話，很適合浮現例行更新容易漏掉的事。`,
        person.relationship === "friend"
          ? "最近除了日常更新之外，有什麼事讓你特別有能量？"
          : "有哪一件事我可以做得不一樣，讓我們的合作更有效？",
      ),
    );

    ideas.push(
      makeIdea(
        "Support",
        "問問什麼事比預期更耗能量",
        "開放的能量檢查，可以在小摩擦變成大問題前先看見。",
        "現在有什麼事比它應該的更耗能量？",
      ),
    );

    ideas.push(
      makeIdea(
        "Alignment",
        "用清楚的下一步收尾",
        "簡短回顧會讓對話更容易行動與記得。",
        "今天我們各自最想帶走的一件事是什麼？",
      ),
    );

    return {
      opening: latest
        ? `延續「${latest.title}」，同時為現在重要的事留空間。`
        : `用這次第一次對話，了解對 ${person.name} 來說什麼樣的固定確認最有幫助。`,
      ideas: ideas.slice(0, 5),
      source: "starter",
    };
  }

  if (unresolved) {
    ideas.push(
      makeIdea(
        "Follow up",
        `Close the loop on ${unresolved.toLowerCase()}`,
        "This was captured as a follow-up in your most recent conversation.",
        `What has changed since we agreed to “${unresolved}”?`,
      ),
    );
  } else if (latestTopic) {
    ideas.push(
      makeIdea(
        "Follow up",
        `Revisit ${latestTopic.toLowerCase()}`,
        "Returning to a recent theme creates continuity between conversations.",
        `How has your thinking on ${latestTopic.toLowerCase()} evolved since we last spoke?`,
      ),
    );
  }

  if (noteLines[0]) {
    ideas.push(
      makeIdea(
        "Alignment",
        noteLines[0],
        "This comes directly from the note you saved for the next conversation.",
        `What would make a useful outcome for “${noteLines[0]}”?`,
      ),
    );
  }

  if (noteLines[1]) {
    ideas.push(
      makeIdea(
        "Support",
        noteLines[1],
        "Your saved note suggests this deserves dedicated space rather than a quick status update.",
        `What support or clarity would be most useful around “${noteLines[1]}”?`,
      ),
    );
  }

  ideas.push(
    makeIdea(
      person.relationship === "friend" ? "Personal" : "Growth",
      person.relationship === "friend"
        ? "Make space for a personal check-in"
        : "Invite one piece of candid feedback",
      `A recurring conversation with a ${relationship.toLowerCase()} is a good place to surface what routine updates can miss.`,
      person.relationship === "friend"
        ? "What has been giving you energy lately, outside the usual updates?"
        : "What is one thing I could do differently to make our work together more effective?",
    ),
  );

  ideas.push(
    makeIdea(
      "Support",
      "Ask what is taking more energy than expected",
      "An open energy check can reveal friction before it becomes a larger issue.",
      "What is taking more energy than it should right now?",
    ),
  );

  ideas.push(
    makeIdea(
      "Alignment",
      "End with a clear next step",
      "A short recap makes the conversation easier to act on and remember.",
      "What is the one thing each of us wants to carry forward from today?",
    ),
  );

  return {
    opening: latest
      ? `Build on “${latest.title}” while making room for what matters now.`
      : `Use this first conversation to learn what a useful recurring check-in looks like for ${person.name}.`,
    ideas: ideas.slice(0, 5),
    source: "starter",
  };
}

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return Response.json(
      { error: "The preparation context was incomplete." },
      { status: 400 },
    );
  }

  const { person } = parsed.data;
  const locale: Locale = parsed.data.locale ?? "en";
  const hasGatewayCredentials = Boolean(
    process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN,
  );

  if (!hasGatewayCredentials) {
    return Response.json(buildStarterResponse(person, locale));
  }

  try {
    const languageInstruction =
      locale === "zh-TW"
        ? "Write every opening, title, rationale, and prompt in Traditional Chinese (繁體中文)."
        : "Write every opening, title, rationale, and prompt in English.";

    const { output } = await generateText({
      model: "openai/gpt-5.6-luna",
      maxOutputTokens: 1_100,
      output: Output.object({ schema: aiOutputSchema }),
      system: `You are a thoughtful 1:1 conversation coach. Create practical, specific talking points using only the context supplied.

Rules:
- Preserve continuity by following up on prior discussions and saved notes.
- Phrase ideas as invitations to a two-way conversation, never as interrogation.
- Do not infer sensitive personal facts, diagnoses, motives, or performance problems.
- Avoid generic status-update questions.
- Keep the tone warm, direct, and appropriate to the relationship.
- Return 4 to 6 distinct ideas spanning the most useful categories.
- Category field values must remain exactly one of: Follow up, Growth, Support, Alignment, Personal.
- ${languageInstruction}`,
      prompt: `Prepare the next 1:1 using this context:

${JSON.stringify(person, null, 2)}`,
    });

    return Response.json({
      opening: output.opening,
      ideas: output.ideas.map((idea) => ({
        ...idea,
        id: crypto.randomUUID(),
      })),
      source: "ai",
    } satisfies PrepResponse);
  } catch {
    return Response.json(buildStarterResponse(person, locale));
  }
}
