# 11s MVP Product Brief, Research Summary, Functional Specification, and Engineering Handoff

Project name: 11s
Document owner: Head of Products
Date: 2026-07-04
Version: 1.0
Status: Ready for engineering handoff
Stakeholders: CEO, Head of Products, Lead Engineer, future paying users
Source issue: HOR-4 — Kick start building the MVP of "11s"

---

## 1. Research summary

### Market context

11s sits at the intersection of three SaaS categories:

1. 1:1 and employee enablement tools: Fellow, Leapsome, Lattice-style performance suites, Hypercontext-style meeting workspaces.
2. AI meeting assistants: Fellow.ai, Granola, Fireflies, Otter.
3. Lightweight personal productivity and relationship-management workflows: notes, reminders, recurring agendas, action-item tracking.

The important market pattern is that most established tools assume one of two contexts:

- A company/team context, usually HR, managers, or business teams running scheduled work meetings.
- A meeting-recording context, where value starts from transcription and summarization.

The 11s opportunity is narrower and more user-centered: help an individual prepare for, run, remember, and follow up on important 1:1 conversations across both career and personal life. The MVP should not try to become a full AI meeting-recorder or HR performance suite. It should win on clarity, low setup, and better recurring relationship context.

### Competitor and substitute patterns

| Product / category | Observed positioning | Relevant pattern | Product implication for 11s |
|---|---|---|---|
| Fellow.ai | Secure AI meeting assistant; notes, summaries, action items, integrations; team pricing starts around $7/user/month annually according to public pricing page checked 2026-07-04 | Strong AI notes and team meeting workflow | Do not lead with transcription in MVP. Use agenda prep, relationship memory, and follow-through as wedge. |
| Leapsome 1:1s & Team Meetings | HR/talent suite with free meeting notes, templates, performance context | Designed for company talent processes | 11s should avoid HR suite complexity and serve individuals and small teams first. |
| Lattice / performance suites | Employee performance, goals, feedback, engagement, reviews | Manager/HR buyer; broader performance management | 11s should not require org-wide adoption to be useful. |
| Hypercontext-style tools | Meeting agendas, shared notes, goals, accountability | Structured meeting workspace | MVP should include reusable templates and action tracking, but stay lightweight. |
| Granola | AI notepad for back-to-back meetings; private notes, enhanced summaries, searchable memory | Individual-first AI notes without bot | Useful inspiration for private-by-default meeting memory. 11s should add 1:1-specific prep and relationship continuity. |
| Fireflies / Otter | Transcription, searchable meeting knowledge, summaries, integrations | Recording-first meeting intelligence | Recording/transcription is a future phase; MVP can produce value without audio capture complexity. |
| Current manual process | Calendar, notes app, docs, chat history, memory | Fragmented, forgotten, inconsistent | 11s can win by turning recurring conversation history into actionable prep and follow-up. |

Research confidence: medium. Public landing and pricing pages were checked on 2026-07-04. Competitive positioning is clear enough for MVP scoping; exact pricing and feature details should be rechecked before launch packaging.

### User problem insights

Likely early users:

- Individual contributors who have recurring 1:1s with managers, mentors, peers, reports, clients, or collaborators.
- Managers or founders running frequent 1:1s without strong process.
- Career-focused professionals who want better follow-through and relationship memory.
- Small team leaders who want lightweight 1:1 structure without adopting an HR suite.

Common pains:

- People arrive at 1:1s unprepared and forget important topics.
- Action items disappear between meetings.
- Recurring conversations lack continuity; users forget prior commitments, context, and emotional tone.
- Existing meeting tools focus on generic meetings, not the special recurring nature of 1:1 relationships.
- HR suites feel too heavy for personal or small-team use.
- AI notetakers summarize meetings but do not necessarily help users prepare better for the next one.

### Key product implications

11s should be built around the recurring relationship workflow, not around one-off meeting notes.

MVP should prioritize:

- Fast creation of a 1:1 relationship and recurring meeting space.
- Agenda preparation before the meeting.
- Notes and decisions during/after the meeting.
- Action item tracking across meetings.
- AI conversation prompts based on relationship context and meeting goal.
- Lightweight reminders and follow-up.

MVP should defer:

- Audio recording/transcription.
- Deep calendar integrations.
- Full team administration.
- HR performance reviews.
- Mobile-native app.
- Complex billing automation.

### Recommended wedge

Position 11s as:

"A lightweight AI workspace that helps you prepare for, remember, and follow through on every important 1:1."

The wedge is personal and relationship-specific. A user should get value even if nobody else on their team adopts 11s.

---

## 2. Product brief

### Problem statement

Important 1:1 conversations are frequent, high-leverage, and easy to mishandle. People often enter them without a clear agenda, forget what was discussed previously, lose track of follow-ups, and miss opportunities to strengthen relationships or advance goals.

Existing tools either treat 1:1s as generic meetings, require team-wide HR/process adoption, or focus on transcription instead of preparation and continuity. There is room for a simple SaaS product that helps individuals and small teams run better recurring 1:1s from preparation to follow-up.

### Target users

Primary users:

- Career-focused individual contributor managing recurring 1:1s with manager, mentor, peers, or collaborators.
- Manager/founder running regular 1:1s with reports or cofounders.
- Consultant, coach, or agency operator managing recurring client 1:1s.

Secondary users:

- The other participant in a 1:1 if the primary user shares agenda, notes, or action items.
- Small team admin in a later phase.

### Value proposition

11s helps users get more value from recurring 1:1s by making every conversation easier to prepare, more focused in the moment, and easier to follow through afterward.

For users:

- Know what to discuss before the meeting.
- Keep continuity from prior meetings.
- Track commitments and follow-ups.
- Get AI-generated conversation ideas when stuck.
- Build stronger professional and personal relationships over time.

For the business:

- Clear self-serve SaaS wedge with individual utility.
- Natural expansion path from personal use to team and manager workflows.
- AI value is practical and repeated, creating retention opportunities.

### MVP product concept

11s is a web SaaS app where a user creates 1:1 relationships, schedules or logs recurring conversations, prepares agendas, captures notes and action items, and uses AI to generate conversation ideas and follow-up summaries based on prior context.

### MVP recommendation

Build one complete workflow:

1. User signs up.
2. User creates a 1:1 relationship.
3. User creates or opens the next 1:1 meeting.
4. User generates or drafts an agenda.
5. User captures notes, decisions, and action items.
6. User marks action items complete or carries them forward.
7. User receives AI-generated follow-up summary and next-meeting suggestions.
8. User returns to the relationship page to see history and prepare for the next 1:1.

---

# Functional Specification

## 1. Executive overview

11s MVP is a web-based SaaS application for managing recurring 1:1 conversations. It helps users prepare better agendas, remember prior context, capture notes and action items, and generate thoughtful conversation prompts.

The target outcome is a working MVP that demonstrates repeated personal utility: a user can manage at least one important recurring relationship over multiple meetings and see clear continuity from meeting to meeting.

## 2. Problem and opportunity

### Problem statement

People have many important recurring 1:1 conversations, but they lack a simple system for preparation, continuity, and follow-through.

### Customer pain points

- "I forget what I wanted to bring up."
- "I do not remember what we agreed last time."
- "My notes are scattered across docs, calendar events, Slack, and memory."
- "I need good questions for sensitive career or personal topics."
- "I lose track of commitments after the conversation."
- "Existing meeting tools feel built for team meetings, not relationship continuity."

### Current alternatives

- Calendar notes: convenient but weak history and action tracking.
- Notion/Google Docs: flexible but manual and unstructured.
- Generic AI chat: useful for brainstorming but not persistent or relationship-aware.
- AI notetakers: good after meetings, weaker for pre-meeting prep and personal context.
- HR/performance platforms: too heavy for personal, cross-context, or small-team use.

### Opportunity hypothesis

If 11s can make recurring 1:1 preparation and follow-up meaningfully easier within five minutes of onboarding, users will return before their next 1:1 and build enough history to create retention.

## 3. Goals and non-goals

### Business goals

- Launch a usable SaaS MVP quickly.
- Validate demand for a personal and professional 1:1 workflow product.
- Create a foundation for paid individual and small-team plans.
- Demonstrate practical AI utility beyond generic chat.

### User goals

- Prepare for a 1:1 quickly.
- Keep prior context organized by relationship.
- Capture decisions and commitments.
- Receive useful conversation ideas and follow-up summaries.
- Build better relationship continuity over time.

### Product goals

- Time-to-first-useful-agenda under 5 minutes from signup.
- First-time user can create a relationship and meeting without setup help.
- AI prompt suggestions are context-aware and editable.
- Action items can be carried across meetings.
- MVP is simple enough to ship quickly and improve from real usage.

### Explicit non-goals for MVP

- Audio/video recording.
- Automatic transcription.
- Deep Google/Microsoft calendar sync.
- HR performance review workflows.
- Organization-wide admin controls.
- Real-time multi-user collaboration.
- Native mobile apps.
- CRM-style pipeline management.
- Complex billing automation.
- Public sharing pages with granular permissions.

## 4. Target users

### Persona A: Career-focused professional

Context:

- Has recurring 1:1s with a manager, mentor, peer, or collaborator.
- Wants to advocate for goals, unblock work, and build trust.
- Often prepares last-minute.

Needs:

- Suggested agenda topics.
- Memory of prior discussions.
- Private notes.
- Follow-up reminders.

### Persona B: Manager/founder

Context:

- Runs many recurring 1:1s.
- Needs to remember what each person cares about and what was promised.
- Wants better conversations without heavy HR software.

Needs:

- Relationship-level history.
- Action item tracking.
- Prompts for feedback, blockers, growth, and morale.
- Fast meeting prep.

### Persona C: Consultant/coach/client-service operator

Context:

- Has recurring client or coaching 1:1s.
- Needs continuity and professional follow-through.

Needs:

- Client context.
- Agenda templates.
- Clear next steps.
- Follow-up summary to send externally.

## 5. Use cases

### Core use cases

1. Create a new 1:1 relationship.
2. Prepare an agenda for the next 1:1.
3. Generate AI conversation ideas based on relationship type and prior notes.
4. Capture notes, decisions, and action items during/after a 1:1.
5. Carry incomplete action items into the next meeting.
6. Review relationship history before a future 1:1.
7. Generate a follow-up summary after the meeting.

### High-frequency workflows

- Open dashboard before a meeting.
- Add agenda item.
- Ask AI for topic ideas.
- Mark action item complete.
- Create next meeting from prior relationship.
- Review previous notes.

### Edge scenarios worth planning for

- User creates a relationship with minimal details.
- User wants private notes separate from shareable summary.
- AI generation fails or returns weak suggestions.
- User has no prior meetings yet.
- User deletes a meeting by mistake.
- User changes meeting date or relationship type.
- User wants to archive a relationship but preserve history.

## 6. Product scope

### In-scope MVP capabilities

1. Authentication and account basics.
2. Personal dashboard showing upcoming/recent 1:1s and open action items.
3. Relationship management.
4. Meeting creation and meeting detail workspace.
5. Agenda item management.
6. Notes, decisions, and action item capture.
7. AI-generated conversation ideas.
8. AI-generated follow-up summary.
9. Carry-forward action items.
10. Basic markdown copy/export for agenda and summary.
11. Basic internal analytics events.

### Out-of-scope MVP capabilities

- Calendar import/sync.
- Email sending.
- Audio recording/transcription.
- Team invitations.
- Billing checkout.
- Granular sharing permissions.
- Mobile-native app.
- Template marketplace.
- HRIS integration.

### Future-phase considerations

- Calendar sync and reminders.
- Shared agenda with the other participant.
- Meeting transcription and automatic action extraction.
- Team and manager dashboards.
- Goal tracking per relationship.
- Slack/email follow-up integrations.
- Paid plans and usage limits.
- Mobile app or PWA optimizations.

## 7. Functional requirements

### FR-1: User authentication

Description: Users can sign up, sign in, sign out, and access only their own data.

Roles: unauthenticated visitor, authenticated user.

Inputs:

- Email/password or third-party auth fields, depending on implementation.

System behavior:

- Unauthenticated users attempting to access app routes are redirected to sign-in.
- New users receive a personal workspace/account context.
- User data is scoped to the authenticated user.

Acceptance criteria:

- Given an unauthenticated visitor opens `/app`, then sign-in is required.
- Given a new user signs up, then they land on an empty dashboard with a prompt to create their first 1:1.
- Given user A requests user B's relationship or meeting, then access is denied.

### FR-2: Dashboard

Description: Authenticated users see the state of their 1:1 workflow.

Entry point: `/app`.

Inputs: none required after authentication.

System behavior:

- Show primary CTA: "Create 1:1" when no relationships exist.
- Show upcoming or recent meetings if available.
- Show open action items grouped by relationship.
- Show relationships list.

Outputs:

- Dashboard view with CTAs and status summaries.

Acceptance criteria:

- Empty-state dashboard guides the user to create a relationship.
- Dashboard shows open action items with due date if available.
- Dashboard links to relationship detail and meeting detail pages.

### FR-3: Relationship creation and management

Description: User creates and manages a recurring 1:1 relationship.

Entry points:

- Dashboard CTA.
- Relationships list.

Required inputs:

- Person name.
- Relationship type: manager, direct report, peer, mentor, client, friend/family, other.

Optional inputs:

- Person role/context.
- Meeting cadence.
- User's goal for the relationship.
- Notes about the relationship.

System behavior:

- Save relationship in active state.
- Create relationship detail page.
- Allow edit and archive.

Validation rules:

- Person name is required.
- Relationship type is required.
- Cadence must be one of predefined options or blank.

Edge cases:

- Archived relationships do not appear in active dashboard by default.
- Relationship cannot be permanently deleted without explicit confirmation.

Acceptance criteria:

- User can create a relationship with only name and type.
- User can edit relationship context later.
- User can archive a relationship and still access historical meetings from archived view.

### FR-4: Meeting creation

Description: User creates a meeting instance under a relationship.

Entry points:

- Relationship page CTA: "Prepare next 1:1".
- Dashboard CTA.

Inputs:

- Relationship.
- Meeting date/time, optional.
- Meeting purpose, optional.

System behavior:

- Create meeting in draft/prep state.
- Pull forward incomplete action items from prior meetings for optional inclusion.
- Show empty agenda state with AI suggestion CTA.

Meeting lifecycle states:

- draft: created but not completed.
- completed: notes/follow-up finalized.
- archived: hidden from default views.

Acceptance criteria:

- User can create a meeting from a relationship.
- New meeting can show carried-forward action items from prior incomplete actions.
- Meeting appears on dashboard as upcoming/recent based on date.

### FR-5: Agenda management

Description: User can create, edit, reorder, complete, and delete agenda items for a meeting.

Inputs:

- Agenda item title.
- Optional description.
- Optional category: update, blocker, decision, feedback, growth, personal, other.

System behavior:

- Agenda items are associated with one meeting.
- User can reorder items.
- User can mark agenda item as discussed.

Validation rules:

- Agenda item title is required.
- Empty agenda items are not saved.

Acceptance criteria:

- User can manually add agenda items.
- User can reorder agenda items.
- User can remove an agenda item before or after meeting completion.

### FR-6: AI conversation ideas

Description: User can generate suggested agenda topics or questions for a meeting.

Entry points:

- Meeting prep page: "Generate ideas".
- Empty agenda state.

Inputs used by system:

- Relationship type.
- Relationship context.
- User's stated relationship goal.
- Prior meeting notes, decisions, and open action items if available.
- Optional user prompt such as "I want to discuss promotion" or "Help me reconnect after a gap".

System behavior:

- Generate 5-8 suggested conversation topics/questions.
- Label suggestions by category.
- Explain briefly why each suggestion may be useful.
- User can add one, several, or all suggestions to the agenda.
- Suggestions are not saved as agenda items until user adds them.

Fallback behavior:

- If no prior context exists, use relationship type and optional goal only.
- If AI generation fails, show a clear retry message and allow manual agenda entry.

Acceptance criteria:

- Given a relationship with no history, AI still returns useful first-meeting suggestions.
- Given prior open action items exist, at least one suggestion should consider follow-up.
- User can add an AI suggestion to the agenda with one click.
- Failed AI generation does not block manual agenda creation.

### FR-7: Meeting notes, decisions, and private notes

Description: User captures meeting information in structured sections.

Inputs:

- Public/shareable notes.
- Decisions.
- Private notes.

System behavior:

- Notes autosave or save explicitly with clear state. Engineering may choose autosave if feasible; explicit save is acceptable for MVP if reliable.
- Private notes are clearly marked and excluded from shareable summaries by default.
- Decisions are stored as structured entries.

Acceptance criteria:

- User can save notes for a meeting.
- User can add multiple decisions.
- Private notes are visually distinct from shareable notes.
- Follow-up summary excludes private notes unless user explicitly chooses to include them.

### FR-8: Action item management

Description: User captures commitments and follows up across meetings.

Inputs:

- Action item title.
- Owner: me, other person, shared, unspecified.
- Optional due date.
- Optional notes.

System behavior:

- Action item belongs to a meeting and relationship.
- Action item has status: open, completed, cancelled.
- Open items appear on dashboard and relationship page.
- New meetings can display prior open items for carry-forward.

Validation rules:

- Title is required.
- Due date, if present, must be valid date.

Acceptance criteria:

- User can add action item from meeting page.
- User can mark action item complete from meeting, relationship, or dashboard view.
- Open prior action items are visible when preparing the next meeting.

### FR-9: AI follow-up summary

Description: User generates a concise post-meeting summary.

Entry point: Meeting page after notes/action items exist.

Inputs used by system:

- Agenda items.
- Shareable notes.
- Decisions.
- Action items.
- Optional tone preference: concise, warm, professional.

System behavior:

- Generate summary with sections: recap, decisions, action items, suggested follow-up message.
- Exclude private notes by default.
- User can copy summary as markdown/plain text.
- Generated summary can be regenerated.

Acceptance criteria:

- Summary includes action items with owners when present.
- Summary excludes private notes by default.
- User can copy summary.
- If insufficient notes exist, system prompts user to add more context or produces a lightweight summary from available information.

### FR-10: Relationship history

Description: User can review past meetings and relationship context.

Entry point: Relationship detail page.

System behavior:

- Show relationship profile/context.
- Show meeting history in reverse chronological order.
- Show open and completed action items.
- Link to each meeting detail.

Acceptance criteria:

- User can see at least meeting date, title/purpose, completion state, and action summary.
- User can open a past meeting.
- Archived meetings are hidden unless user enables archived view.

### FR-11: Copy/export

Description: User can copy agenda or follow-up summary for external use.

System behavior:

- Agenda can be copied as markdown/plain text.
- Follow-up summary can be copied as markdown/plain text.

Acceptance criteria:

- Copy action provides success/failure feedback.
- Copied agenda includes agenda items in current order.
- Copied summary excludes private notes by default.

### FR-12: Basic analytics events

Description: System records minimal product events for MVP learning.

Events to track:

- user_signed_up
- relationship_created
- meeting_created
- ai_ideas_generated
- ai_suggestion_added_to_agenda
- meeting_completed
- action_item_created
- action_item_completed
- followup_summary_generated
- summary_copied

Acceptance criteria:

- Events include user id, timestamp, and relevant entity ids where safe.
- Event tracking failure must not block user workflow.

## 8. Business rules

### Permissions

- MVP is single-user by default.
- Users can only access their own relationships, meetings, notes, and action items.
- There are no team roles in MVP.

### Lifecycle states

Relationship:

- active
- archived

Meeting:

- draft
- completed
- archived

Action item:

- open
- completed
- cancelled

### AI usage rules

- AI generation requires authenticated user.
- Private notes are excluded from AI follow-up output by default.
- If private notes are used as context for suggestion generation, the UI must make clear that private context may inform private suggestions. Do not include private notes in shareable outputs without explicit user action.
- Log AI errors internally, but do not expose raw provider errors to users.

### Billing / entitlement assumptions

- MVP can launch without billing checkout.
- Product should track AI usage per user from day one to support future limits.
- Future simple packaging likely: free trial/free limited plan, paid individual plan, small-team plan.

## 9. User flow notes

### First-run flow

1. Visitor lands on marketing or app route.
2. User signs up/signs in.
3. Empty dashboard shows CTA: "Create your first 1:1".
4. User enters person name, relationship type, and optional goal.
5. Relationship page opens with CTA: "Prepare next 1:1".
6. User creates meeting.
7. User clicks "Generate ideas" or manually adds agenda items.
8. User saves agenda and can copy it.
9. After meeting, user adds notes/action items and generates follow-up summary.
10. Dashboard now shows open action items and recent relationship.

### Returning user flow

1. User opens dashboard.
2. User sees upcoming/recent 1:1 and open action items.
3. User opens relationship.
4. User reviews prior notes/action items.
5. User creates next meeting and generates context-aware agenda ideas.

## 10. Data considerations

This is product-level data guidance, not final schema design.

### Core entities

User:

- id
- email
- created_at
- updated_at

Relationship:

- id
- user_id
- person_name
- relationship_type
- person_context
- relationship_goal
- cadence
- status
- created_at
- updated_at

Meeting:

- id
- user_id
- relationship_id
- title or purpose
- scheduled_at
- status
- created_at
- updated_at
- completed_at

AgendaItem:

- id
- meeting_id
- title
- description
- category
- sort_order
- discussed_at or is_discussed
- created_at
- updated_at

MeetingNote:

- id
- meeting_id
- note_type: shareable, private, decision
- body
- created_at
- updated_at

ActionItem:

- id
- user_id
- relationship_id
- meeting_id
- title
- owner
- due_date
- status
- completed_at
- created_at
- updated_at

AIGeneration:

- id
- user_id
- meeting_id nullable
- relationship_id nullable
- generation_type: agenda_ideas, followup_summary
- input_context_summary
- output_text or structured output
- status
- error_code nullable
- created_at

ProductEvent:

- id
- user_id
- event_name
- entity_type
- entity_id
- metadata
- created_at

### Reporting/audit needs

- MVP should retain enough AI generation metadata to debug failures and understand usage volume.
- Do not store raw secrets in app data.
- Avoid logging private notes into application logs.

## 11. Success metrics

### Activation metrics

- Signup to first relationship created.
- Signup to first meeting created.
- Signup to first agenda item or AI idea generated.
- Time to first useful agenda.

### Engagement metrics

- Meetings created per active user.
- Percent of users with 2+ meetings in same relationship.
- AI ideas generated per active user.
- Action items created/completed.
- Follow-up summaries generated/copied.

### Retention proxy metrics

- User returns within 7 days after first meeting.
- User creates second meeting for same relationship.
- Open action items are completed or carried forward.

### Quality metrics

- AI generation failure rate.
- AI suggestion add-to-agenda rate.
- Summary copy rate.

## 12. Risks and assumptions

### Product assumptions

- Users will adopt a personal 1:1 workflow without requiring the other participant to join.
- Agenda prep and follow-up create enough value without transcription in MVP.
- AI suggestions improve perceived usefulness compared with static templates.

### Market assumptions

- There is a viable wedge outside HR suites and recording-first meeting assistants.
- Early adopters are willing to manually create relationships and meetings before calendar sync exists.

### Delivery assumptions

- Existing repo is currently minimal, so engineering can choose a pragmatic stack.
- Credentials needed for deployment/provider access exist outside this spec and should be handled securely.
- MVP can ship as a responsive web app before mobile-native work.

### Key risks

- Too much manual entry may hurt retention.
- AI suggestions may feel generic without enough relationship history.
- Users may expect calendar sync or transcription immediately because competitor category cues are strong.
- Personal/private note handling must be clear to avoid trust issues.

### Mitigations

- Optimize first-run setup to require only name and relationship type.
- Provide strong default suggestion templates when history is thin.
- Position MVP clearly around preparation and follow-through, not transcription.
- Make private notes visually distinct and excluded from shareable outputs by default.

## 13. Open questions

CEO/product:

- Should 11s initially position for career/professional 1:1s only, or explicitly include personal life on the landing page?
- Is the first monetization target individual users, managers, or small teams?
- Should the initial launch include billing or a free beta?

Design:

- What is the simplest visual model: relationship-first or meeting-first dashboard?
- Should private notes and shareable notes be separate tabs or sections?

Engineering:

- Preferred stack for fastest reliable SaaS launch.
- Which auth/provider should be used based on available credentials.
- Which LLM provider should power AI suggestions and summaries.
- Whether explicit save or autosave is safer for MVP timeline.

---

# Engineering handoff

## MVP implementation plan

Recommended delivery slices:

1. Project/app foundation
   - Set up web app framework, auth, database, environment handling, deployment target, and app shell.
   - Create protected app routes and empty dashboard.

2. Core data model and CRUD
   - Implement users/workspace scoping.
   - Implement relationships, meetings, agenda items, notes, decisions, and action items.
   - Add dashboard and relationship detail pages.

3. Meeting prep workflow
   - Create meeting from relationship.
   - Add/edit/reorder agenda items.
   - Carry forward open action items from prior meetings.

4. Meeting capture workflow
   - Add shareable notes, private notes, decisions, and action items.
   - Mark meeting complete.
   - Show meeting history.

5. AI agenda ideas
   - Add server-side AI generation endpoint/action.
   - Use relationship context, prior meeting summaries, and open actions.
   - Return structured suggestions that user can add to agenda.
   - Handle provider failure gracefully.

6. AI follow-up summary
   - Generate summary from agenda, shareable notes, decisions, and action items.
   - Exclude private notes by default.
   - Add copy-to-clipboard.

7. Analytics and polish
   - Track MVP events.
   - Add empty states, loading states, error states.
   - Add basic responsive layout and final QA.

## Suggested engineering child tasks

Task 1: Initialize SaaS app foundation

- Build authenticated app shell for 11s in `/home/deploy/11s/11s-app`.
- Include protected dashboard route and user data scoping.
- Verify app runs locally and can be deployed using available credentials.

Task 2: Implement relationship and meeting core workflow

- Relationship CRUD.
- Meeting CRUD.
- Dashboard, relationship detail, meeting detail.
- Agenda items and action items.

Task 3: Implement notes, decisions, meeting completion, and history

- Shareable notes, private notes, decisions.
- Meeting completion state.
- Relationship history.
- Open action carry-forward.

Task 4: Implement AI agenda ideas and follow-up summaries

- AI prompt construction.
- Structured suggestions.
- Summary generation.
- Provider failure handling.
- Copy/export.

Task 5: QA, analytics, and launch readiness

- Product event tracking.
- Empty/error/loading states.
- Data-access tests.
- Basic deployment verification.

## Acceptance criteria for engineering MVP completion

- New user can sign up/sign in and reach dashboard.
- New user can create a relationship with name and type.
- User can create a meeting under the relationship.
- User can manually add agenda items.
- User can generate AI agenda ideas and add at least one to agenda.
- User can add shareable notes, private notes, decisions, and action items.
- User can mark an action item complete.
- User can complete a meeting.
- User can generate and copy a follow-up summary that excludes private notes by default.
- User can create a second meeting for the same relationship and see prior open action items/history.
- User cannot access another user's data.
- AI failure states do not block manual use.
- Basic analytics events are emitted for the core funnel.

## Product decisions made

- MVP is relationship-first, not recording-first.
- MVP supports personal and career 1:1s in the model, but initial go-to-market should emphasize professional/career use unless CEO chooses otherwise.
- MVP does not require the other participant to sign up.
- MVP does not include calendar sync or transcription.
- Private notes are excluded from shareable outputs by default.

## Recommended first launch positioning

"11s helps you show up prepared for every 1:1, remember what matters, and follow through without losing track."

Primary CTA: "Prepare your next 1:1".
