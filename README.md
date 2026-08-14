# 11s

11s is a focused workspace for better recurring 1:1s with managers, peers,
direct reports, mentors, and friends.

It includes:

- A relationship dashboard and upcoming-conversation queue
- Private notes for each person’s next 1:1
- Searchable discussion history with topics and follow-ups
- AI-assisted preparation grounded in saved notes and recent discussions
- Email/password and Google authentication with secure cross-device persistence
- Free and Pro plans with subscription billing
- English and Traditional Chinese interfaces

## Getting Started

Create `.env.local` from the template and fill in the values:

```bash
cp .env.example .env.local
npm install
npx vercel link
npx vercel env pull .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Google sign-in

The login page includes **Continue with Google**. To make it work:

1. Create a Google Cloud **Web** OAuth client at
   [Google Auth Platform → Clients](https://console.cloud.google.com/auth/clients).
2. Add authorized JavaScript origins:
   - `http://localhost:3000`
   - `https://www.11s.io` (and `https://11s.io` if used)
3. Add the authorized redirect URI from your Supabase project:
   `https://vqxzxrpzjfvrkvsgshtd.supabase.co/auth/v1/callback`
   (local: `http://127.0.0.1:54321/auth/v1/callback`)
4. In the [Supabase Google provider settings](https://supabase.com/dashboard/project/vqxzxrpzjfvrkvsgshtd/auth/providers?provider=Google):
   - Enable Google
   - Paste the Client ID and Client Secret
5. Under [URL configuration](https://supabase.com/dashboard/project/vqxzxrpzjfvrkvsgshtd/auth/url-configuration),
   set **Site URL** to `https://www.11s.io` and allow redirects:
   - `https://www.11s.io/auth/callback`
   - `https://www.11s.io/auth/callback**`
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/callback**`

   If `auth/callback` is missing from the allow list, Google returns users to
   `https://www.11s.io/?code=…` and they never get a session. The app now
   forwards those codes to `/auth/callback`, but the allow-list entry is still
   required for a clean redirect.

For local Supabase (`supabase start`), also set in `.env.local` /
the shell environment:

- `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID`
- `SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET`

## Database

The tracked migrations in `supabase/migrations` create isolated
`11s_*` tables for people, discussions, preparation ideas, preparation
usage, and user preferences (including plan and billing state). Every table
has row-level security, so authenticated users can only access their own
rows.

Apply migrations to the linked project with:

```bash
supabase db push
```

## AI preparation

Set `DEEPSEEK_API_KEY` in `.env.local` (or the hosting provider's env config).
Without a key, the app falls back to deterministic starter ideas from the
same context. The model name is an implementation detail and is not exposed
in the UI.

## Billing (Stripe sandbox)

Plans:

- **Free** — up to 20 people and 10 AI preparations per 30 days.
- **Pro** — unlimited people and unlimited AI preparation.

Server-side env vars (see `.env.example`):

- `STRIPE_SECRET_KEY` — secret key from the Stripe sandbox.
- `STRIPE_WEBHOOK_SECRET` — signing secret for the webhook endpoint.
- `STRIPE_PRO_MONTHLY_PRICE_ID` / `STRIPE_PRO_YEARLY_PRICE_ID` — the Pro
  recurring prices.
- `SUPABASE_SECRET_KEY` — service-role key used only by the webhook route to
  update plan state (never exposed to the browser).
- `NEXT_PUBLIC_APP_URL` — public base URL used for checkout redirect URLs
  (defaults to the request origin if unset).

Webhook endpoint to register in Stripe:

- URL: `https://<your-domain>/api/stripe/webhook`
- Events: `checkout.session.completed`,
  `customer.subscription.created`, `customer.subscription.updated`,
  `customer.subscription.deleted`, `invoice.payment_failed`

For local development, forward events with the CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
