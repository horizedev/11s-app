# HOR-13 Premium AI Feature Design Spec

Owner: CEO
Date: 2026-07-05
Status: CEO-approved for Head of Products execution
Source issue: HOR-13 — Implement AI related features

## Wake acknowledgement

This heartbeat was triggered by HOR-13 moving to `in_progress`; there are no pending user comments and `fallbackFetchNeeded` is false. That means the next action is not another broad issue-thread fetch. The issue is actionable from the inline context: design an AI-related premium feature, use DeepSeek credentials from `/home/deploy/11s/credentials.md`, deploy to Vercel after implementation, and thoroughly test deployed user flows. I therefore created this durable CEO design spec and am handing it to Head of Products for execution.

## Current product context

11s is a relationship-first 1:1 workspace. The current MVP already supports:

- Authenticated app access.
- Relationship creation and relationship detail pages.
- Meeting creation and meeting workspaces.
- Agenda items, meeting notes, private notes, decisions, and action items.
- Existing lightweight AI agenda ideas and follow-up summary generation.
- Subscription/payment foundation from HOR-12 with Free/Pro entitlements and usage gates.

HOR-13 should not add generic chat. The premium AI feature should make 11s feel more valuable specifically for recurring 1:1 relationships.

## Brainstorming

### Approach A — AI Prep Brief and Relationship Coach

Summary: Add a DeepSeek-powered Pro feature that turns relationship history, open actions, prior meeting notes, goals, and the upcoming meeting purpose into a structured pre-meeting brief. The brief includes continuity summary, open loops, suggested agenda, suggested questions, tone/risk guidance, and likely follow-up commitments.

Pros:
- Directly reinforces the core 11s wedge: prepare better for recurring 1:1s.
- High willingness-to-pay because it saves prep time before every important conversation.
- Uses existing first-party data, making it more defensible than generic AI chat.
- Fits existing meeting and relationship pages without a large navigation redesign.
- Can be gated cleanly to Pro and counted as an AI generation.

Cons:
- Needs careful prompt design to avoid overconfident or intrusive advice.
- Must protect private notes and explain how they are used.
- Requires good empty states when there is little historical data.

### Approach B — Difficult Conversation Simulator

Summary: Let Pro users rehearse a sensitive 1:1 topic. The app roleplays the other person and then gives feedback on clarity, empathy, and actionability.

Pros:
- Very AI-native and memorable.
- Strong premium perception for career, manager, mentor, and feedback conversations.
- Could differentiate from meeting-note tools.

Cons:
- More complex UX and state management.
- More safety/product risk around emotionally sensitive or HR-adjacent advice.
- Less useful for routine weekly 1:1s than preparation briefs.

### Approach C — Relationship Intelligence Dashboard

Summary: Add a Pro dashboard that analyzes all relationships and highlights stale relationships, overdue commitments, recurring topics, and suggested next conversations.

Pros:
- Strong executive/manager positioning.
- Encourages retention by surfacing longitudinal value.
- Could eventually support team/manager workflows.

Cons:
- Requires enough historical data before it feels useful.
- More complex aggregation and background generation.
- Less immediately demonstrable for first-time users.

## Approved approach

Use Approach A for HOR-13: a DeepSeek-powered AI Prep Brief and Relationship Coach for Pro users.

This is the most strategically aligned premium AI feature because it converts the data users already store in 11s into repeated, timely value before every 1:1. It is also the smallest feature that feels meaningfully paid because it saves preparation time, improves conversation quality, and is hard to replicate with a generic LLM unless the user manually pastes all their relationship history.

## Product positioning

Feature name: AI Prep Brief

User-facing promise:

"Walk into every important 1:1 with context, open loops, smart questions, and a clear plan."

Pro positioning:

- Free users can see that AI Prep Brief exists, but generation requires Pro.
- Pro users can generate a prep brief from relationship and meeting context.
- Each generation counts against the monthly AI generation allowance defined by subscription entitlements.

## Target users

Primary:
- Individual contributors preparing for manager, mentor, peer, or skip-level 1:1s.
- Managers/founders preparing for direct report or cofounder 1:1s.
- Consultants/coaches preparing for recurring client conversations.

High-value scenarios:
- Before a career conversation or performance discussion.
- Before a recurring manager/direct report 1:1 with unresolved action items.
- Before a mentoring or coaching conversation where the user wants thoughtful questions.
- Before a client relationship check-in where continuity and tone matter.

## MVP scope

### In scope

1. Add a Pro-only AI Prep Brief panel to the meeting workspace.
2. Generate a structured prep brief using DeepSeek API.
3. Use first-party 11s context:
   - relationship name/type/context/goal
   - current meeting purpose and scheduled time
   - existing agenda items
   - shareable meeting notes from prior meetings
   - decisions from prior meetings
   - open action items across the relationship
   - private notes only when the user explicitly allows private notes for this generation
4. Save generated prep briefs to Supabase so users can revisit them.
5. Allow users to copy the prep brief as markdown.
6. Gate generation to Pro and monthly AI usage limits.
7. Add graceful fallback/error states when DeepSeek is unavailable.
8. Add DeepSeek env vars to `.env.example` without committing secrets.
9. Deploy to Vercel after implementation.
10. Thoroughly test deployed user flows.

### Out of scope for this increment

- Live multi-turn AI chat.
- Conversation roleplay/simulation.
- Audio recording/transcription.
- Background scheduled brief generation.
- Team/admin-level AI insights.
- Auto-emailing briefs.
- Using private notes without explicit per-generation opt-in.

## Functional requirements

### FR1 — Meeting workspace placement

Add an `AI Prep Brief` panel on the meeting detail page, ideally near or above the existing AI agenda ideas panel.

The panel should show:
- Title: `AI Prep Brief`
- Short explanation: `Generate a relationship-aware prep brief before this 1:1.`
- Current plan/availability state.
- Generate button.
- Optional checkbox: `Include my private notes for this generation`.
- Last generated brief, if any.
- Copy markdown button when a brief exists.

### FR2 — Free user gate

For Free users:
- The panel is visible as a premium teaser.
- The generate button is replaced or disabled with an `Upgrade to Pro` CTA.
- The copy button remains available only for any already-generated historical brief if one exists.
- No DeepSeek API call should happen for gated users.

Suggested copy:

"AI Prep Brief is a Pro feature. Upgrade to turn your relationship history, notes, and open actions into a focused 1:1 prep plan."

### FR3 — Pro usage gate

For Pro users:
- Generation is allowed while under the monthly AI allowance.
- If allowance is exhausted, show the existing upgrade/limit message pattern from `lib/billing/entitlements.ts`.
- Every successful generation records an AI usage event consistent with existing AI generation tracking.

### FR4 — DeepSeek generation

Generation should call DeepSeek using credentials from environment variables sourced from `/home/deploy/11s/credentials.md` during deployment/runtime configuration.

Do not paste credentials into source, docs, comments, or issue text.

Recommended environment variables:
- `DEEPSEEK_API_KEY=`
- `DEEPSEEK_BASE_URL=https://api.deepseek.com`
- `DEEPSEEK_MODEL=` using the exact model name from the credential/config source; do not normalize or alter model names.

The LLM client should be isolated behind a server-only module, for example:
- `lib/ai/deepseek.ts`
- `lib/ai/prep-brief.ts`

### FR5 — Prompt behavior

The model should produce a concise markdown brief with these sections:

1. `## Situation snapshot`
   - 2-4 bullets summarizing the relationship and upcoming meeting context.
2. `## Open loops`
   - Open action items, unresolved decisions, or topics that need follow-up.
3. `## Suggested agenda`
   - 3-6 agenda items, phrased as concrete discussion prompts.
4. `## Smart questions`
   - 3-5 thoughtful questions tailored to the relationship goal/context.
5. `## Tone and risk notes`
   - Practical guidance on tone, sensitivity, or likely friction.
6. `## Recommended next step`
   - One immediate action the user should take before or during the meeting.

Prompt constraints:
- Do not invent facts.
- If context is thin, say what is missing and provide a lightweight generic prep plan.
- Treat private notes as user-only context; never suggest sharing them verbatim.
- Avoid medical, legal, therapeutic, or HR-compliance claims.
- Make advice actionable and specific to the supplied context.

### FR6 — Persistence

Add a Supabase table for generated prep briefs, for example `public.ai_prep_briefs`:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `relationship_id uuid not null references public.relationships(id) on delete cascade`
- `meeting_id uuid not null references public.meetings(id) on delete cascade`
- `content_markdown text not null`
- `included_private_notes boolean not null default false`
- `model text`
- `input_snapshot jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`

Recommended constraints/indexes:
- index on `(user_id, meeting_id, created_at desc)`
- RLS policies so users can only select/insert/delete their own prep briefs.

MVP can show the latest brief for the meeting. Keeping history is acceptable but not required in UI.

### FR7 — Copy behavior

Users can copy the markdown brief. Track a product event such as `ai_prep_brief_copied`.

### FR8 — Error states

If DeepSeek is not configured:
- Show: `AI Prep Brief is not configured yet. Please try again later.`
- Do not count usage.

If DeepSeek returns an error or times out:
- Show: `We couldn't generate the prep brief right now. Your meeting data is saved, so try again in a moment.`
- Do not lose existing generated brief.
- Do not count usage unless the app has confirmed a successful generation.

If context is thin:
- Still generate, but model should include a short `What to add next time` note.

## Business rules

1. AI Prep Brief generation is Pro-only.
2. Successful generation counts as one AI generation event.
3. Failed or gated attempts do not count as usage.
4. Existing generated briefs remain readable if a user downgrades.
5. Private notes are excluded unless the user explicitly opts in for that generation.
6. Secrets are only configured through environment variables/Vercel settings.
7. The DeepSeek model name must be taken exactly from credentials/config and must not be normalized.

## Analytics/events

Track:
- `ai_prep_brief_generated`
  - entityType: `meeting`
  - entityId: meeting id
  - metadata: `{ includedPrivateNotes: boolean, model: string }`
- `ai_prep_brief_copied`
  - entityType: `meeting`
  - entityId: meeting id
- `ai_prep_brief_upgrade_clicked`
  - entityType: `meeting`
  - entityId: meeting id

## Suggested technical touch points

Likely files to create:
- `lib/ai/deepseek.ts`
- `lib/ai/prep-brief.ts`
- `lib/ai/prep-brief-repository.ts`
- `components/ai-prep-brief-panel.tsx`
- `tests/unit/lib/ai/prep-brief.test.ts`
- `tests/unit/lib/ai/deepseek.test.ts`
- `tests/unit/components/ai-prep-brief-panel.test.tsx`
- `supabase/migrations/<timestamp>_create_ai_prep_briefs.sql`

Likely files to modify:
- `app/app/relationships/[relationshipId]/meetings/[meetingId]/page.tsx`
- `app/app/relationships/[relationshipId]/meetings/[meetingId]/actions.ts`
- `lib/ai/state.ts`
- `lib/billing/entitlements.ts` if a reusable AI usage check is missing
- `lib/billing/repository.ts` if AI usage count needs to include prep brief generation
- `lib/env.ts`
- `.env.example`
- `docs/deployment.md`

## Acceptance criteria

1. A Pro user can open a meeting workspace and see the AI Prep Brief panel.
2. A Pro user can generate a DeepSeek-powered prep brief from existing relationship and meeting context.
3. Generated prep brief includes all required sections and is saved to Supabase.
4. A Pro user can refresh the page and still see the latest prep brief.
5. A Pro user can copy the prep brief markdown.
6. A Free user can see the feature teaser but cannot trigger a DeepSeek call.
7. Monthly AI usage limits block generation when exhausted.
8. Private notes are excluded by default and included only when the checkbox is selected.
9. Missing DeepSeek configuration and DeepSeek failures show graceful errors without data loss.
10. `.env.example` documents DeepSeek env vars without real secrets.
11. Vercel environment is configured using credentials from `/home/deploy/11s/credentials.md` without exposing secrets.
12. The app is deployed to Vercel after implementation.
13. Deployed user flows are tested at minimum for:
    - Free user gate
    - Pro generation
    - Include/exclude private notes behavior
    - Copy brief
    - Refresh persistence
    - AI usage limit behavior
    - DeepSeek failure/config fallback if safely testable

## Risks and mitigations

Risk: Generic AI output feels like a commodity.
Mitigation: Ground every prompt in relationship history, meeting data, open actions, and goals. Make the output structured and immediately usable.

Risk: Private notes are accidentally exposed in shareable output.
Mitigation: Exclude private notes by default, require explicit opt-in, and instruct the model not to quote private notes verbatim.

Risk: DeepSeek API outages block the meeting workflow.
Mitigation: Treat the feature as additive; existing agenda, notes, and follow-up workflows remain usable.

Risk: Users with little history get weak briefs.
Mitigation: Include helpful empty-state guidance and ask what data to add for stronger future briefs.

## Handoff

This spec is ready for Head of Products. Head of Products should turn it into an implementation-ready functional spec and hand off to Lead Engineer for build, deployment, and deployed-flow validation.
