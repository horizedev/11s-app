# 11s Deployment Runbook

This app is designed for Vercel hosting with Supabase providing auth and Postgres.

## 0. Operator preflight

Before attempting a live deployment, confirm provider access from the shell:

```bash
npx vercel whoami
npx supabase projects list
```

- If `vercel whoami` starts a device login flow, complete that flow first.
- If `supabase projects list` fails with `Access token not provided`, run `npx supabase login` or provide `SUPABASE_ACCESS_TOKEN`.

## 1. Create and configure Supabase

1. Create a Supabase project.
2. Capture the project URL and publishable key for app runtime configuration.
3. Link the local project to the Supabase project and apply the migrations in `supabase/migrations/`:

   ```bash
   npx supabase link --project-ref <project-ref>
   npx supabase db push
   ```

4. In Supabase Auth URL settings, set:
   - Site URL: your production app URL.
   - Additional redirect URLs: local development and any Vercel preview URLs you want to support.

## 2. Configure Vercel

Set these environment variables in Vercel for Production, Preview, and Development as appropriate:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `DEEPSEEK_API_KEY`
- `DEEPSEEK_BASE_URL`
- `DEEPSEEK_MODEL`

`NEXT_PUBLIC_SITE_URL` should point at the canonical production domain. If you later add a custom domain, update this value and the matching Supabase Auth Site URL together.

DeepSeek notes:

- `DEEPSEEK_API_KEY` must be set only in secure environment management, never in source control.
- `DEEPSEEK_BASE_URL` should remain `https://api.deepseek.com` unless ops has approved another exact value.
- `DEEPSEEK_MODEL` must match the exact production model identifier from secure credentials/config. Do not normalize or alias it in code.

## 3. Deploy

1. Import the repository into Vercel.
2. Confirm the project uses the default Next.js build settings.
3. Add the environment variables above.
4. Trigger a production deployment:

   ```bash
   npx vercel --prod
   ```

## 4. Post-deploy smoke test

After the deployment finishes, verify:

- The marketing page loads.
- `/app` redirects signed-out users to `/auth/login`.
- Sign-up and sign-in complete successfully.
- A new user can reach the empty dashboard state.
- Supabase confirmation and password-reset links return to the deployed app.
