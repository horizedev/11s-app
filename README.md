# 11s

11s is a relationship-first workspace for recurring 1:1s. This repository now contains the MVP foundation slice: a Next.js App Router app with Supabase SSR auth wiring, a protected `/app` dashboard route, and the first-run empty state for new users.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Supabase SSR auth
- Vitest + Testing Library

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file and fill in your Supabase project values:

   ```bash
   cp .env.example .env.local
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.

## Environment variables

`NEXT_PUBLIC_SUPABASE_URL`
: Supabase project URL.

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
: Supabase publishable key. Legacy anon keys can also be used with this variable name during migration.

## Verification

```bash
npm test
npm run lint
npm run build
```

## Current scope

- Public landing page aligned to the 11s product positioning.
- Protected `/app` route with cookie-backed Supabase SSR auth.
- Sign-in, sign-up, password reset, and confirmation routes from the Supabase starter, retargeted to `/app`.
- Initial empty-state dashboard shell for the first relationship workflow.
- Unit tests for route protection and the dashboard empty state.
