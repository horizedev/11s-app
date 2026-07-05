# HOR-15 AI Prep Brief Functional Specification

Project name: AI Prep Brief
Document owner: Head of Product
Date: 2026-07-05
Version: 1.0
Status: Ready for Lead Engineer implementation
Stakeholders: CEO, Head of Product, Lead Engineer
Source design: `docs/ai-premium-feature-design-spec.md`

## 0. Wake acknowledgement and disposition

HOR-15 was assigned to Head of Product to execute the CEO-approved premium AI feature design from HOR-13. The latest wake payload has no pending comments and does not require a broader thread refetch, so the next action is to convert the approved CEO design into an implementation-ready functional/product spec and hand it to Lead Engineer.

This document is the durable product handoff for implementation of the Pro-only DeepSeek-powered AI Prep Brief.

## 1. Research summary

### Market and product context

11s is a relationship-first 1:1 workspace. The strongest premium AI opportunity is not generic chat; it is converting first-party relationship and meeting history into timely preparation value before a recurring 1:1.

Common patterns in adjacent SaaS products:

| Category | Common AI pattern | Product implication for 11s |
| --- | --- | --- |
| Meeting notes tools | Summaries, recaps, action extraction | Useful but often post-meeting and generic; 11s can differentiate by preparing users before the conversation. |
| CRM / relationship tools | Account briefs, next-best action, open-loop reminders | Validates the value of context-aware prep, especially when tied to ongoing relationships. |
| Coaching / performance tools | Suggested questions, tone guidance, difficult conversation prep | Valuable, but needs guardrails to avoid HR/legal/therapy-style overreach. |
| Generic LLMs | User manually pastes context and asks for prep | 11s can win on convenience, privacy boundaries, and structured use of relationship data already in the product. |

### User problem insights

Primary users preparing for 1:1s often need to:

- Remember prior context quickly.
- Identify unresolved commitments and open loops.
- Convert scattered notes into a focused agenda.
- Ask better questions without sounding scripted.
- Handle sensitive relationship context thoughtfully.
- Avoid re-reading every prior note before each meeting.

The pain is frequent for users with recurring meetings and high enough value to justify Pro positioning because it improves time-to-value before every important conversation.

### Product implications

- The MVP should live inside the meeting workspace where prep intent is strongest.
- The output should be structured markdown, not chat.
- The feature must reuse existing relationship, meeting, agenda, notes, decisions, and action-item data.
- Private notes must be excluded by default and included only with explicit per-generation opt-in.
- Generated briefs should persist so the user can refresh or downgrade without losing already-created value.
- DeepSeek failures should be additive failures only; they must not block the meeting workspace.

### Key recommendations

1. Build AI Prep Brief as a Pro-only meeting workspace panel.
2. Require both Pro entitlement and monthly AI usage allowance before any DeepSeek call.
3. Persist each successful brief in Supabase and render the latest brief for the meeting.
4. Keep all DeepSeek access server-only.
5. Preserve the exact configured model name from deployment configuration; do not normalize, alias, default, or alter it.
6. Treat private notes as sensitive opt-in context for the current generation only.

## 2. Product brief

### Problem statement

People use 11s to maintain continuity across recurring 1:1 relationships, but before a meeting they still need to manually reconstruct the relationship history, open loops, prior decisions, and useful questions. This creates prep friction and weakens the value of stored relationship data.

### Target users

Primary:

- Individual contributors preparing for manager, mentor, peer, or skip-level 1:1s.
- Managers/founders preparing for direct report or cofounder 1:1s.
- Consultants/coaches preparing for recurring client conversations.

Secondary:

- Power users with many active relationships who need fast context refresh.
- Free users evaluating whether Pro saves enough prep time to upgrade.

### Value proposition

“Walk into every important 1:1 with context, open loops, smart questions, and a clear plan.”

### Proposed product concept

AI Prep Brief is a Pro-only DeepSeek-powered panel on the meeting detail page. It generates a concise markdown brief from the relationship, upcoming meeting, current agenda, prior shareable notes, prior decisions, and open action items. Private notes are excluded unless the user explicitly checks an opt-in box for that generation.

### MVP recommendation

Build the smallest credible premium version:

- One panel on the meeting workspace.
- One generate action.
- One optional private-note opt-in checkbox.
- Latest persisted brief visible on refresh.
- Copy markdown.
- Pro and usage-limit gating.
- Graceful missing-config/failure states.

Do not build chat, background generation, roleplay, multi-brief comparison, or team/admin AI reporting in this increment.

### Strategic rationale

The feature reinforces 11s’ core wedge: relationship continuity. It turns existing product data into repeatable Pro value, avoids generic AI chat bloat, and creates a clear upgrade moment while preserving a simple MVP delivery path.

## 3. Executive overview

### What is being proposed

A Pro-only AI Prep Brief for individual meeting workspaces that generates a structured markdown preparation brief using DeepSeek and first-party 11s relationship context.

### Why it matters

It turns stored relationship history into immediate prep value before every 1:1, increasing Pro willingness-to-pay and retention potential.

### Who it is for

Users who prepare for recurring manager, direct report, mentor, peer, founder, client, or coaching 1:1s.

### Desired outcome

Users should be able to generate and revisit a useful prep brief that helps them start the meeting with context, open loops, suggested agenda items, smart questions, tone/risk awareness, and a recommended next step.

## 4. Problem and opportunity

### Problem

Users collect relationship context in 11s, but the value is fragmented across agenda items, notes, decisions, and action items. Before a meeting, they must manually synthesize that context.

### Customer pain points

- “What did we leave unresolved last time?”
- “What should I ask in this meeting?”
- “What commitments are still open?”
- “How do I approach this conversation with the right tone?”
- “I know I wrote notes, but I do not want to re-read everything.”

### Current alternatives

- Manual review of 11s notes and action items.
- Generic LLM prompt with pasted context.
- External meeting tools focused on post-meeting summaries.
- Personal notes/docs outside 11s.

### Opportunity hypothesis

If 11s can generate a reliable, privacy-aware prep brief from existing relationship context, Pro users will experience faster meeting readiness and stronger continuity, increasing perceived premium value.

## 5. Goals and non-goals

### Business goals

- Create a clear Pro-only AI value moment.
- Increase Pro conversion intent from meeting workspace usage.
- Increase retention by making historical relationship data more useful.
- Demonstrate premium AI differentiation without adding generic chat complexity.

### User goals

- Prepare faster for a 1:1.
- Remember relationship context and open loops.
- Ask better, more relevant questions.
- Avoid accidentally exposing private notes.
- Revisit generated prep content later.

### Product goals

- Keep feature placement and workflow simple.
- Make entitlement and usage rules unambiguous.
- Persist generated value.
- Keep AI failures non-destructive.
- Make implementation testable with clear acceptance criteria.

### Non-goals

- Live multi-turn AI chat.
- Roleplay or difficult conversation simulation.
- Audio recording/transcription.
- Background scheduled generation.
- Team/admin-level AI insights.
- Auto-emailing or external sharing of briefs.
- Using private notes without explicit per-generation opt-in.
- Replacing existing agenda, notes, decision, or action-item workflows.

## 6. Target users

| Role/persona | Context | Primary need |
| --- | --- | --- |
| Individual contributor | Manager, mentor, peer, skip-level 1:1s | Prepare quickly and ask thoughtful questions. |
| Manager/founder | Direct report, cofounder, team-member 1:1s | Maintain continuity, follow up on commitments, reduce missed context. |
| Consultant/coach | Recurring client relationships | Reconstruct client context and plan next conversation. |
| Free evaluator | Sees premium teaser | Understand why Pro AI is worth upgrading for. |

## 7. Use cases

### Core use cases

1. Pro user opens an upcoming meeting and generates a prep brief.
2. Pro user includes private notes for one sensitive generation.
3. Pro user refreshes the page and sees the latest generated brief.
4. Pro user copies the markdown brief into another workspace or document.
5. Free user sees the premium teaser and is directed to upgrade.
6. Downgraded user can still read historical generated briefs but cannot generate new ones.

### High-frequency workflows

- Weekly recurring 1:1 prep.
- Review open action items before a meeting.
- Turn prior notes into suggested agenda/questions.

### High-value scenarios

- Performance/career conversation.
- Manager/direct report check-in with unresolved commitments.
- Mentoring/coaching conversation.
- Client relationship review.

### Edge scenarios to support

- Very little relationship history exists.
- No agenda items exist.
- No open action items exist.
- Private notes exist but are not opted in.
- User is Free but has historical generated briefs from prior Pro status.
- Pro user has exhausted monthly AI allowance.
- DeepSeek env vars are missing.
- DeepSeek returns an error or times out.

## 8. Product scope

### In-scope MVP capabilities

- AI Prep Brief panel on meeting detail page.
- Pro entitlement gate before generation.
- Monthly AI usage-limit gate before generation.
- Server-side DeepSeek call.
- Generated markdown brief with required sections.
- Supabase persistence for generated briefs.
- Latest brief rendered on meeting workspace after refresh.
- Copy markdown button.
- Optional per-generation private-note inclusion.
- Product analytics events.
- Missing-config and generation-failure states.
- `.env.example` and deployment docs updated for DeepSeek env vars without secrets.
- Vercel configuration and deployment by Lead Engineer.
- Deployed flow testing by Lead Engineer.

### Out-of-scope items

- Chat UI.
- Multiple saved-brief history UI.
- Brief editing.
- Brief deletion UI.
- Email/share/export beyond clipboard copy.
- Admin controls.
- Automated scheduling.
- Model selection by user.
- AI-generated agenda item insertion from prep brief sections.

### Future-phase considerations

- Background generation before scheduled meetings.
- History view for all prior briefs.
- “Create agenda items from this brief.”
- Relationship-level intelligence dashboard.
- Difficult conversation simulation.

## 9. Functional requirements

### FR1 — Meeting workspace placement

| Field | Requirement |
| --- | --- |
| Feature name | AI Prep Brief panel |
| User roles | Authenticated meeting owner; Free and Pro users see different states. |
| Entry point | Meeting detail page: `app/app/relationships/[relationshipId]/meetings/[meetingId]/page.tsx`. |
| Inputs | Relationship ID, meeting ID, current authenticated user, entitlement snapshot, latest saved prep brief. |
| System behavior | Render an `AI Prep Brief` panel near existing AI assist surfaces, preferably between agenda ideas and notes so it supports pre-meeting preparation. |
| Outputs | Visible panel with title, explanation, gating/generation state, private-note checkbox where relevant, latest brief, copy action where relevant. |
| Acceptance criteria | Panel is visible on meeting workspace for authenticated users who own the meeting. |

Required panel copy:

- Title: `AI Prep Brief`
- Explanation: `Generate a relationship-aware prep brief before this 1:1.`
- Free teaser copy: `AI Prep Brief is a Pro feature. Upgrade to turn your relationship history, notes, and open actions into a focused 1:1 prep plan.`

### FR2 — Free user gate

| Field | Requirement |
| --- | --- |
| Feature name | Free user premium gate |
| User roles | Free users and users without active Pro entitlement. |
| Trigger | User opens meeting workspace. |
| Inputs | Billing usage/entitlement snapshot. |
| System behavior | Show premium teaser. Disable or replace generate button with `Upgrade to Pro` CTA linking to `/app/billing`. Do not call DeepSeek. Do not count usage. |
| Outputs | Upgrade CTA. Existing historical brief remains visible if one exists. Copy remains available for existing historical brief. |
| Edge cases | Downgraded user with saved brief can read/copy previous brief but cannot generate/regenerate. |
| Acceptance criteria | Free user cannot trigger any server path that calls DeepSeek; UI communicates Pro requirement. |

### FR3 — Pro usage-limit gate

| Field | Requirement |
| --- | --- |
| Feature name | AI generation allowance gate |
| User roles | Pro users. |
| Trigger | User submits generation form. |
| Inputs | Billing usage, monthly AI generation count, Pro plan status. |
| System behavior | Allow generation only when `usage.plan === "pro"` and `usage.canGenerateAi === true`. If allowance is exhausted, return the existing AI limit message pattern from `getUpgradeMessage("ai")`. |
| Outputs | Generated brief on success, limit error on exhausted allowance. |
| Validation rules | Failed, blocked, or config-error attempts must not count as successful usage. |
| Acceptance criteria | A Pro user at usage limit cannot trigger a DeepSeek call and sees the limit message. |

Product decision: AI Prep Brief is stricter than existing lightweight AI agenda ideas. For this premium feature, Free users must not generate even if the existing generic `canGenerateAi` allowance would otherwise allow Free AI usage.

### FR4 — DeepSeek configuration and server-only client

| Field | Requirement |
| --- | --- |
| Feature name | DeepSeek integration |
| User roles | Server-side only; no browser exposure. |
| Trigger | Successful entitlement and usage gate. |
| Inputs | `DEEPSEEK_API_KEY`, `DEEPSEEK_BASE_URL`, `DEEPSEEK_MODEL`. |
| System behavior | Call DeepSeek from a server-only module. Secrets must never be committed, rendered, logged, or posted to issue comments. |
| Outputs | Markdown brief content. |
| Validation rules | If required config is missing, return configured error state and do not count usage. Preserve the exact configured model name. |
| Acceptance criteria | DeepSeek env vars are documented in `.env.example`; runtime code never exposes secrets client-side. |

Environment variable requirements:

- `DEEPSEEK_API_KEY`: read from secure deployment env, sourced from `/home/deploy/11s/credentials.md` during deployment by the implementation owner.
- `DEEPSEEK_BASE_URL`: default expected value is `https://api.deepseek.com` unless deployment config provides another exact approved value.
- `DEEPSEEK_MODEL`: must be supplied by secure config and sent exactly as configured. Do not lowercase, trim into another semantic value, map aliases, infer defaults, or otherwise normalize model names.

Credential note for Lead Engineer: `/home/deploy/11s/credentials.md` was inspected for product handoff only. Do not paste its secret values into source, docs, tests, logs, PRs, or Paperclip comments. If the exact DeepSeek model name is not present in that credential/config source at implementation time, the unblock owner is CEO/ops to provide the exact `DEEPSEEK_MODEL` value before production DeepSeek deployment.

### FR5 — Context assembly

| Field | Requirement |
| --- | --- |
| Feature name | Prep brief input context |
| User roles | Authenticated meeting owner. |
| Trigger | Generate prep brief submission. |
| Inputs | Relationship, meeting, current agenda items, prior shareable notes, prior decisions, open action items across relationship, optional private notes. |
| System behavior | Build a bounded input snapshot from first-party 11s data. Include private notes only if the user explicitly opts in for that generation. |
| Outputs | Input snapshot used for prompt and persisted as non-secret `input_snapshot` JSON. |
| Validation rules | Only load data belonging to the authenticated user and matching relationship/meeting. |
| Acceptance criteria | Tests prove private notes are excluded by default and present in prompt/input snapshot only when opted in. |

Context rules:

- Relationship context should include person name, relationship type label, person context, relationship goal, and status where available.
- Meeting context should include purpose, scheduled time, and status.
- Current meeting agenda items should be included.
- Prior shareable notes and decisions should be included. Prefer relationship-level history, not only the current meeting, where repository support allows it.
- Open action items should include title, owner, due date, status, and relationship/meeting linkage when available.
- Private notes must be excluded unless `includePrivateNotes === true` for that exact request.
- The generated brief should not quote private notes verbatim even when private notes are used as context.

### FR6 — Prompt and output behavior

| Field | Requirement |
| --- | --- |
| Feature name | Prep brief prompt |
| User roles | Pro user. |
| Trigger | Server-side generation after gates pass. |
| Inputs | Context snapshot and model config. |
| System behavior | Request a concise markdown brief with required sections and safety constraints. |
| Outputs | Markdown string with all required sections. |
| Edge cases | Thin context should still produce a lightweight brief and identify what to add next time. |
| Acceptance criteria | Unit tests validate prompt construction and required section expectations using a mocked DeepSeek response. |

Required markdown sections:

1. `## Situation snapshot`
   - 2–4 bullets summarizing relationship and upcoming meeting context.
2. `## Open loops`
   - Open action items, unresolved decisions, or topics that need follow-up.
3. `## Suggested agenda`
   - 3–6 concrete discussion prompts.
4. `## Smart questions`
   - 3–5 tailored questions.
5. `## Tone and risk notes`
   - Practical tone/sensitivity/friction guidance.
6. `## Recommended next step`
   - One immediate action before or during the meeting.

Prompt constraints:

- Do not invent facts.
- If context is thin, say what is missing and provide a lightweight generic prep plan.
- Treat private notes as user-only context; never suggest sharing them verbatim.
- Avoid medical, legal, therapeutic, or HR-compliance claims.
- Make advice actionable and specific to supplied context.
- Avoid pretending certainty about emotions, intent, performance, or legal/HR obligations.

### FR7 — Persistence

| Field | Requirement |
| --- | --- |
| Feature name | Saved prep briefs |
| User roles | Authenticated owner; readable after downgrade. |
| Trigger | Successful generation only. |
| Inputs | User ID, relationship ID, meeting ID, markdown content, private-note flag, exact model name, input snapshot. |
| System behavior | Insert a row into `public.ai_prep_briefs`. Render latest brief for the meeting on page load. |
| Outputs | Saved generated brief. |
| Validation rules | RLS must restrict users to their own briefs. Failed/gated attempts do not create prep brief rows. |
| Acceptance criteria | Refresh after generation shows latest brief. Downgraded/Free user can still read/copy existing brief. |

Recommended table:

```sql
create table public.ai_prep_briefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  relationship_id uuid not null references public.relationships(id) on delete cascade,
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  content_markdown text not null,
  included_private_notes boolean not null default false,
  model text,
  input_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index ai_prep_briefs_user_meeting_created_idx
  on public.ai_prep_briefs (user_id, meeting_id, created_at desc);
```

RLS requirements:

- Authenticated users can select their own rows.
- Authenticated users can insert rows only for themselves and their own relationship/meeting.
- Delete support is optional for MVP UI, but if granted, users can delete only their own rows.
- Service role can manage rows if needed by future operations.

### FR8 — Usage event recording

| Field | Requirement |
| --- | --- |
| Feature name | AI usage accounting |
| User roles | Pro users. |
| Trigger | Successful DeepSeek generation and successful brief persistence. |
| Inputs | User ID, relationship ID, meeting ID, generation metadata. |
| System behavior | Insert a successful `ai_generations` row so monthly allowance includes prep brief generations. |
| Outputs | Usage count increments by one. |
| Validation rules | Do not count gated, missing-config, failed DeepSeek, failed persistence, or invalid ownership attempts. |
| Acceptance criteria | Usage limit test proves generation is blocked after allowance is exhausted. |

Recommended `ai_generations` values:

- `generation_type`: `prep_brief`
- `status`: `succeeded`
- `input_context_summary`: concise counts/summary only, no secrets.
- `output_text`: generated markdown or a short persisted-output reference; align with existing table constraints.

### FR9 — Copy behavior

| Field | Requirement |
| --- | --- |
| Feature name | Copy markdown brief |
| User roles | Any authenticated user who can read the saved brief, including downgraded users. |
| Trigger | User clicks copy button. |
| Inputs | Latest visible brief markdown. |
| System behavior | Copy raw markdown content to clipboard. Track copy event if authenticated. |
| Outputs | Clipboard contains markdown; UI shows copied/failure status. |
| Edge cases | Browser clipboard failure shows manual-copy fallback message. |
| Acceptance criteria | Copy button copies markdown, not stripped preview text. |

### FR10 — Analytics

Track these product events:

| Event | Trigger | Metadata |
| --- | --- | --- |
| `ai_prep_brief_generated` | Successful generation and persistence | `{ includedPrivateNotes: boolean, model: string }` |
| `ai_prep_brief_copied` | Successful copy event action | `{ relationshipId: string }` |
| `ai_prep_brief_upgrade_clicked` | Free user clicks upgrade CTA if practical to instrument | `{ relationshipId: string }` |

Event entity:

- `entityType`: `meeting`
- `entityId`: meeting ID

### FR11 — Error states

| Scenario | Required user message | Usage counted? | Existing brief preserved? |
| --- | --- | --- | --- |
| Free user gate | `AI Prep Brief is a Pro feature. Upgrade to turn your relationship history, notes, and open actions into a focused 1:1 prep plan.` | No | Yes |
| Pro usage exhausted | Existing `getUpgradeMessage("ai")` pattern | No | Yes |
| Missing DeepSeek config | `AI Prep Brief is not configured yet. Please try again later.` | No | Yes |
| DeepSeek error/timeout | `We couldn't generate the prep brief right now. Your meeting data is saved, so try again in a moment.` | No | Yes |
| Meeting not found/unauthorized | Return to relationship or show existing not-found behavior | No | N/A |
| Thin context | Generate brief and include `What to add next time` guidance | Yes if generation succeeds | Yes |

## 10. Business rules

1. AI Prep Brief generation is Pro-only.
2. A user must have active Pro entitlement and available monthly AI allowance before generation.
3. Successful generation counts as one AI generation event.
4. Failed, gated, or configuration-error attempts do not count as usage.
5. Existing generated briefs remain readable and copyable after downgrade.
6. Private notes are excluded by default.
7. Private notes are included only when the user explicitly opts in for that generation.
8. Private-note opt-in is not sticky; it must reset to unchecked on each page load/generation form state unless the user checks it again.
9. Secrets are configured only through environment variables and Vercel/Supabase secure settings.
10. The DeepSeek model name must be taken exactly from secure config and must not be normalized or altered.
11. DeepSeek must be called only from server-side code.
12. The existing meeting workspace must remain usable if AI Prep Brief fails.

## 11. User flow notes

### Flow A — Free user sees gate

1. User opens meeting workspace.
2. System loads latest saved prep brief, if any.
3. System evaluates billing usage.
4. Panel shows Pro teaser and `Upgrade to Pro` CTA.
5. Generate/regenerate is unavailable.
6. If saved brief exists, user can read/copy it.
7. No DeepSeek call occurs.

### Flow B — Pro user generates brief without private notes

1. User opens meeting workspace.
2. Panel shows generation form with private-note checkbox unchecked.
3. User clicks generate.
4. Server verifies user, meeting ownership, Pro plan, and usage allowance.
5. Server assembles context excluding private notes.
6. Server calls DeepSeek.
7. Server persists prep brief with `included_private_notes = false`.
8. Server records successful AI usage and product event.
9. UI displays generated brief.
10. Refresh shows latest saved brief.

### Flow C — Pro user opts into private notes for one generation

1. User checks `Include my private notes for this generation`.
2. User clicks generate.
3. Server verifies gates.
4. Server includes private notes in context snapshot for this request only.
5. Prompt instructs model not to quote private notes verbatim.
6. Saved row has `included_private_notes = true`.
7. Subsequent generation form defaults unchecked again.

### Flow D — Usage limit

1. Pro user reaches monthly AI allowance.
2. User clicks generate.
3. Server blocks before DeepSeek call.
4. UI shows AI allowance message.
5. Existing brief remains visible.
6. No usage increment occurs.

### Flow E — DeepSeek failure

1. Pro user clicks generate under allowance.
2. Server calls DeepSeek.
3. DeepSeek is unavailable, times out, or returns error.
4. UI shows graceful error.
5. Existing brief remains visible.
6. No prep brief row and no successful AI usage row are created.

## 12. Data considerations

### Critical data entities

| Entity | Purpose | Required fields / notes |
| --- | --- | --- |
| Relationship | Personal context for prep | person name, relationship type, context, goal, owner user ID. |
| Meeting | Current workspace and trigger | purpose, scheduled time, status, relationship ID, owner user ID. |
| Agenda item | Current meeting topics | title, description, category, position/status as available. |
| Meeting note | Shareable/private/decision context | shareable notes and decisions included by default; private notes only by opt-in. |
| Action item | Open loops | title, owner, due date, status, relationship and meeting references. |
| AI prep brief | Persisted generated output | content markdown, model, included-private flag, input snapshot, created date. |
| AI generation | Usage accounting | generation type `prep_brief`, succeeded status, user/relationship/meeting IDs. |
| Product event | Analytics | generated, copied, upgrade clicked. |

### Data creation and update expectations

- Creating a prep brief never updates meeting notes, agenda items, decisions, or action items.
- Regenerating creates a new prep brief row; the UI may show only the latest row.
- Existing rows should not be overwritten unless engineering has a clear reason; history is acceptable even if not exposed in MVP.
- Input snapshot should contain enough non-secret context to audit what was used, including whether private notes were included.

### Reporting and audit needs

- Count `ai_generations.status = succeeded` for monthly allowance.
- Product events should support future funnel analysis: seen gate, upgraded/clicked, generated, copied.
- Persist `model` exactly as configured for operational traceability.

## 13. Dependencies and constraints

### Product dependencies

- Existing auth and meeting ownership enforcement.
- Existing billing/entitlement snapshot.
- Existing AI usage table/counting.
- Existing product event tracking.
- Existing Vercel and Supabase deployment setup.

### Engineering dependencies

- Server-only DeepSeek client.
- Supabase migration and RLS policies.
- Repository functions for latest prep brief and context assembly.
- Safe environment variable handling.
- Mockable DeepSeek client for tests.

### Operational constraints

- Do not expose secrets in source/docs/issues/logs.
- Use `/home/deploy/11s/credentials.md` only as a secure source for runtime/deployment values.
- Do not normalize or alter the configured DeepSeek model name.
- If model config is absent, do not invent a default model name for production.

## 14. Recommended engineering touch points

Likely files to create:

- `lib/ai/deepseek.ts`
- `lib/ai/prep-brief.ts`
- `lib/ai/prep-brief-repository.ts`
- `components/ai-prep-brief-panel.tsx`
- `tests/unit/lib/ai/deepseek.test.ts`
- `tests/unit/lib/ai/prep-brief.test.ts`
- `tests/unit/components/ai-prep-brief-panel.test.tsx`
- `supabase/migrations/<timestamp>_create_ai_prep_briefs.sql`

Likely files to modify:

- `app/app/relationships/[relationshipId]/meetings/[meetingId]/page.tsx`
- `app/app/relationships/[relationshipId]/meetings/[meetingId]/actions.ts`
- `lib/ai/state.ts`
- `lib/billing/entitlements.ts` if a Pro-only AI helper is useful.
- `lib/billing/repository.ts` if usage counting or plan helpers need extension.
- `lib/env.ts`
- `.env.example`
- `docs/deployment.md`

Implementation guidance without prescribing architecture:

- Keep DeepSeek HTTP code isolated and mockable.
- Keep prompt assembly separate from React components and server actions.
- Keep persistence in a repository module.
- Use server actions consistent with the existing agenda/follow-up panels.
- Avoid client-side exposure of env vars or prompt context.

## 15. Acceptance criteria

### Product acceptance criteria

1. A Pro user can open a meeting workspace and see the AI Prep Brief panel.
2. A Pro user can generate a DeepSeek-powered prep brief from relationship and meeting context.
3. The generated brief includes all required markdown sections.
4. The generated brief is saved to Supabase.
5. Refreshing the meeting page shows the latest generated brief.
6. A Pro user can copy the markdown brief.
7. A Free user sees the premium teaser and cannot trigger a DeepSeek call.
8. A downgraded user can still read/copy existing generated briefs.
9. Monthly AI usage limits block generation before DeepSeek is called.
10. Private notes are excluded by default.
11. Private notes are included only with explicit per-generation opt-in.
12. Missing DeepSeek configuration shows graceful error and does not count usage.
13. DeepSeek failures show graceful error, preserve existing content, and do not count usage.
14. `.env.example` documents DeepSeek env vars without secrets.
15. Vercel environment is configured using secure credentials without exposing secrets.
16. The app is deployed to Vercel after implementation.
17. Deployed user flows are tested for Free gate, Pro generation, private-note opt-in, copy, refresh persistence, usage limit, and DeepSeek failure/config fallback where safely testable.

### Minimum automated test expectations

- Prompt/context builder excludes private notes by default.
- Prompt/context builder includes private notes when opted in.
- Missing DeepSeek config returns a typed/config error path without API call.
- DeepSeek client preserves exact model string.
- Server action blocks Free user before DeepSeek call.
- Server action blocks Pro user at AI limit before DeepSeek call.
- Server action persists successful brief and records usage.
- Component renders Free gate.
- Component renders existing brief for a gated/downgraded user.
- Component copies markdown and shows copy status.

### Minimum deployed-flow test expectations

Lead Engineer should test on the deployed Vercel app:

1. Free gate: Free user can see the panel and CTA but cannot generate.
2. Pro generation: Pro user can generate a brief using DeepSeek.
3. Private-note default: private notes are not included when box is unchecked.
4. Private-note opt-in: private notes are included only when box is checked for that generation.
5. Copy: copy button copies markdown.
6. Refresh persistence: generated brief remains visible after reload.
7. Usage limit: exhausted allowance blocks generation.
8. Failure/config fallback: safely simulate missing/bad DeepSeek config or mocked failure in a non-production-safe way and verify graceful state.

## 16. Risks and assumptions

### Product assumptions

- Users value pre-meeting prep enough to recognize it as a Pro feature.
- Existing 11s data is sufficient to produce useful prep after a few meetings.
- Structured markdown is more useful than chat for this increment.
- Persisting latest/generated briefs increases trust and perceived value.

### User behavior assumptions

- Users will understand private-note opt-in if the checkbox is explicit and non-sticky.
- Users will copy prep briefs into their preferred workflow when useful.
- Free users seeing a contextual gate inside meeting prep are more likely to understand Pro value than from a generic pricing page alone.

### Market assumptions

- Generic AI is not enough differentiation; first-party relationship context is the wedge.
- Meeting prep is a stronger first premium AI moment than post-meeting summary alone.

### Dependencies

- DeepSeek credentials and exact model config are available to the implementation/deployment owner.
- Vercel and Supabase access are available for deployment and migration.
- Existing billing state can identify active Pro users reliably.

### Key risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Generic output feels low-value | Ground prompt in relationship history, agenda, notes, decisions, and action items; require structured sections. |
| Private notes leak into shareable language | Exclude by default, require opt-in, instruct model not to quote them verbatim, test context assembly. |
| AI outage hurts meeting workflow | Keep feature additive, preserve existing brief, show graceful error. |
| Thin context produces weak output | Include `What to add next time` guidance and lightweight prep plan. |
| Secret exposure | Server-only modules, env vars, no secrets in docs/issues/logs. |
| Model mismatch | Use exact `DEEPSEEK_MODEL` string from secure config; do not infer default. |

## 17. Open questions

These do not block engineering from starting implementation except where noted.

1. Blocking before production DeepSeek deploy if absent from config: what is the exact `DEEPSEEK_MODEL` value to set in Vercel? Preserve exactly as provided.
2. Should prior notes include all prior meetings in the relationship for MVP, or only the current meeting plus relationship-level open actions? Product preference: include relationship-level prior shareable notes/decisions if repository support is straightforward; otherwise start with current meeting and open relationship actions but keep function boundaries ready to expand.
3. Should the Free teaser click be instrumented through a server action or simple link tracking? Product preference: instrument if low-effort; do not delay core generation.
4. Should the UI expose `included_private_notes` metadata next to the saved brief? Product preference: show a small note such as `Private notes included in this generation` when true if simple.

## 18. Lead Engineer implementation plan

### Phase 1 — Data and config foundation

1. Add Supabase migration for `ai_prep_briefs` with indexes, grants, and RLS.
2. Add repository functions to insert and fetch the latest prep brief by user/relationship/meeting.
3. Add server-only DeepSeek config helpers for required env vars.
4. Update `.env.example` and `docs/deployment.md` with DeepSeek env var names only.

### Phase 2 — Prompt and generation service

1. Build context assembly for relationship, meeting, agenda, notes, decisions, and open actions.
2. Implement private-note opt-in behavior.
3. Implement prompt builder with required sections and constraints.
4. Implement DeepSeek client call with timeout/error handling.
5. Return typed success/config-error/provider-error results.

### Phase 3 — Server action and usage accounting

1. Add `generatePrepBriefAction` to the meeting actions file.
2. Verify user and meeting ownership.
3. Enforce Pro-only gate.
4. Enforce monthly AI allowance gate.
5. Call generation service.
6. Persist prep brief.
7. Record `ai_generations` success row and product event only after success.
8. Add `prepBriefCopiedAction` and optional upgrade-click tracking.

### Phase 4 — UI

1. Create `components/ai-prep-brief-panel.tsx` following existing client panel patterns.
2. Render Free gate, Pro generate form, private-note checkbox, errors, latest brief, and copy button.
3. Add panel to meeting detail page and pass usage/latest-brief props.
4. Ensure downgraded users can read/copy existing brief.

### Phase 5 — Tests and deployment

1. Add unit tests for prompt/context/private-note behavior.
2. Add unit tests for DeepSeek config/model preservation.
3. Add action tests for Free gate, Pro generation, usage limit, missing config, and failure states.
4. Add component tests for gate, existing brief, opt-in checkbox, and copy controls.
5. Run targeted unit tests.
6. Apply Supabase migration to the target project.
7. Configure Vercel env vars securely from credentials/config.
8. Deploy to Vercel production.
9. Execute deployed smoke tests listed in section 15.
10. Report deployment URL, test evidence, and any residual risks back to HOR-15 or the implementation child issue.

## 19. Handoff summary for Lead Engineer

Build the Pro-only AI Prep Brief exactly as specified above. The core implementation rules are:

- Pro-only generation.
- Monthly AI usage-limit gate.
- Server-only DeepSeek call.
- Exact configured model name preserved.
- No secret exposure.
- Persist successful briefs.
- Historical briefs readable after downgrade.
- Private notes excluded by default and included only through explicit per-generation opt-in.
- Graceful error states with no data loss and no failed-usage counting.
- Deploy to Vercel and verify deployed flows.
