# HOR-12 Subscription and Payment Design Spec

Owner: CEO
Date: 2026-07-05
Status: CEO-approved for Head of Products execution
Source issue: HOR-12 — Implement subscription and payment features

## Wake acknowledgement

This heartbeat was triggered by a successful-run handoff that found useful output but no concrete action evidence. There are no new user comments to answer. The next action is therefore to turn HOR-12 into a durable product/payment design and hand it to Head of Products with implementation scope, rather than doing another generic repo pass.

## Brainstorming

The requested outcome is not just "add Stripe". The product also needs premium features that make a subscription worth paying for. Based on the existing 11s MVP, the strongest paid value should come from repeated 1:1 continuity, AI-assisted preparation, and export/sharing workflows.

### Approach A — Free cap plus paid Pro plan

Summary: Keep 11s useful for one important relationship, then require Pro for multiple relationships, richer AI usage, exports, and billing management.

Pros:
- Simple to understand and implement.
- Lets new users experience the core workflow before paying.
- Maps cleanly to current app entities: relationships, meetings, AI generations.
- Good self-serve SaaS motion for individual users.

Cons:
- Requires entitlement checks in several server actions.
- Free users who already created data may hit caps and need clear upgrade messaging.

### Approach B — Time-limited full trial

Summary: Give all users full access for 14 days, then require a subscription.

Pros:
- Easiest product story: try everything.
- Avoids many feature-level caps initially.

Cons:
- Requires trial state and expiration handling.
- Worse for long-cycle 1:1 use because users may not have enough meetings within the trial window.
- Harder to keep free organic adoption.

### Approach C — Team/manager paid packaging first

Summary: Make paid value about manager/team workflows: team seats, shared templates, shared action visibility.

Pros:
- Higher willingness to pay if sold to teams.
- Strong expansion potential.

Cons:
- Current MVP explicitly deferred team admin and collaboration.
- Adds scope risk before the individual workflow and billing foundation are complete.

## Approved approach

Use Approach A for HOR-12: a free individual tier with clear limits and a $9/month Pro subscription managed through Stripe Checkout and the Stripe customer portal.

This is the smallest subscription model that feels commercially real while staying aligned with the current MVP architecture.

## Product packaging

### Free tier

Purpose: Let a user prove that 11s helps with one recurring relationship.

Limits:
- Up to 1 active relationship.
- Up to 3 meetings total.
- Up to 5 AI generations per calendar month.
- Basic agenda, notes, decisions, and action item tracking remain available within those limits.
- No export/copy-focused premium utilities beyond existing on-page copy actions.

### Pro tier

Purpose: Make 11s valuable as a serious personal 1:1 operating system.

Price:
- $9/month, recurring, Stripe test-mode product/price for this implementation.

Included premium features:
1. Unlimited active relationships.
2. Unlimited meetings.
3. Higher AI generation allowance: 100 AI generations per calendar month.
4. Premium meeting prep: relationship pages should show a Pro-facing continuity/prep card that positions prior context, open actions, and AI agenda generation as the paid workflow.
5. Export-ready follow-up workflow: Pro users can generate and copy follow-up summaries without free-tier AI caps blocking normal use.
6. Billing self-management: dashboard billing card, subscribe button, and manage subscription button through Stripe customer portal.

## Entitlement model

Define a central entitlement module so feature gates are consistent and testable.

Suggested files:
- `lib/billing/plans.ts`
- `lib/billing/entitlements.ts`
- `lib/billing/repository.ts`
- `lib/billing/stripe.ts`

Plan identifiers:
- `free`
- `pro`

User billing state should be stored in Supabase in a new table, for example `public.user_subscriptions`:
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade unique`
- `stripe_customer_id text unique`
- `stripe_subscription_id text unique`
- `stripe_price_id text`
- `plan text not null default 'free'`
- `status text not null default 'inactive'`
- `current_period_end timestamptz`
- timestamps

Recommended active statuses:
- `trialing`
- `active`

Treat `past_due`, `canceled`, `incomplete`, `incomplete_expired`, `unpaid`, and missing subscription as free.

## Stripe flow

### Checkout

Route/action:
- Create server action or route for starting checkout from `/app/billing` or dashboard billing card.
- Require authenticated Supabase user.
- Look up or create a Stripe customer using user id/email metadata.
- Create a Stripe Checkout Session with mode `subscription`, Pro price id, success URL `/app/billing?checkout=success`, cancel URL `/app/billing?checkout=cancelled`.
- Redirect to `session.url`.

### Customer portal

Route/action:
- Require authenticated user.
- Require existing Stripe customer id.
- Create Stripe billing portal session with return URL `/app/billing`.
- Redirect to `session.url`.

### Webhook

Route:
- `app/api/stripe/webhook/route.ts`

Events to handle:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Webhook behavior:
- Verify signature using `STRIPE_WEBHOOK_SECRET`.
- Upsert `user_subscriptions` by `stripe_customer_id` or metadata user id.
- Store plan/status/current period end/Stripe ids.
- Make handling idempotent.

## App UX

### Public landing page

Add pricing section with Free and Pro cards.

Free card:
- 1 relationship
- 3 meetings
- 5 AI generations/month
- Basic agenda/notes/actions

Pro card:
- Unlimited relationships and meetings
- 100 AI generations/month
- Premium relationship continuity/prep
- Follow-up summaries and export-friendly workflow
- $9/month

### App dashboard

Add billing/status card near the top:
- Current plan: Free or Pro
- Usage snapshot: active relationships, meetings, AI generations this month
- Free users: `Upgrade to Pro`
- Pro users: `Manage billing`

### Billing page

Create `/app/billing`:
- Plan comparison
- Current subscription status
- Usage counters
- Subscribe/manage buttons
- Success/cancel feedback from query string

### Gating behavior

Relationship creation:
- Free users with 1 active relationship should be blocked from creating another relationship and shown upgrade CTA.

Meeting creation:
- Free users with 3 meetings should be blocked from creating another meeting and shown upgrade CTA.

AI generation actions:
- Free users with 5 AI generations in current calendar month should be blocked with upgrade CTA.
- Pro users should be blocked only after 100 monthly generations.

Avoid destructive behavior. Existing data remains readable even if a user downgrades; gates should only block creation/generation beyond limits.

## Environment variables

Add to `.env.example`:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=`
- `STRIPE_SECRET_KEY=`
- `STRIPE_WEBHOOK_SECRET=`
- `STRIPE_PRO_PRICE_ID=`

Credentials are available in `/home/deploy/11s/credentials.md`; do not paste secret values into source, comments, or issue text.

## Testing requirements

Unit tests:
- Entitlement resolution for free/pro/inactive subscriptions.
- Usage-limit decisions for relationships, meetings, and AI generation counts.
- Stripe webhook subscription state mapping.
- Checkout/portal action guards for unauthenticated users and missing config.

Integration/manual tests:
- Free user can create first relationship and first meetings.
- Free user is blocked at relationship cap.
- Free user is blocked at meeting cap.
- Free user is blocked at AI generation cap.
- Checkout redirects to Stripe test checkout.
- Stripe test subscription updates Supabase via webhook.
- Pro user sees Pro status and can create additional relationships/meetings.
- Manage billing opens Stripe customer portal.
- Downgraded/canceled user remains able to read existing data but cannot create beyond free caps.

Deployment requirements:
- Configure Stripe and Supabase/Vercel environment variables in Vercel.
- Deploy to Vercel after implementation.
- Test the deployed app user flows with Stripe test cards.

## Implementation slices for Head of Products

1. Finalize exact Pro price/product in Stripe sandbox and record only the non-secret price id in Vercel/project env.
2. Add database migration and billing repository.
3. Add entitlement/usage logic with unit tests.
4. Add Stripe client, checkout, portal, and webhook with unit tests where possible.
5. Add dashboard/billing/pricing UI.
6. Add feature gates to relationship creation, meeting creation, and AI generation actions.
7. Run focused unit tests and build/lint checks.
8. Deploy to Vercel.
9. Manually verify free, checkout, Pro, portal, and downgrade/cancel flows on deployed app.

## Approval

CEO approval: approved for execution using Approach A. Head of Products should execute with Lead Engineer/Release Engineer support as needed and keep HOR-12 updated with deployed-app verification evidence.
