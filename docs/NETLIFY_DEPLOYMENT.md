# Netlify production deployment

This project uses Next.js App Router route handlers, Prisma, NextAuth and a remote AI provider. It must be deployed as a hybrid Next.js application, not as a static export.

## Build configuration

The committed `netlify.toml` uses:

- build command: `npm run build`
- publish directory: `.next`
- Node.js 20.19.5
- Netlify's automatically updated OpenNext adapter

Do not add `@netlify/plugin-nextjs` to `package.json` or `netlify.toml`. That pins the legacy adapter and opts the project out of current OpenNext updates.

## Required Netlify variables

In **Site configuration → Environment variables**, add these values for the production deploy context. Mark secrets as secret values. If the account offers scopes, include **Functions**; using **All scopes** is the least error-prone setup for this app.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Pooled PostgreSQL/Neon connection string used by Prisma |
| `NEXTAUTH_SECRET` | Yes | Stable, high-entropy secret used to sign sessions |
| `NEXTAUTH_URL` | Recommended | Exact public origin, for example `https://your-site.netlify.app`, with no trailing slash |
| `AI_PROVIDER` | Yes | Use `openrouter` for the current production configuration |
| `OPENROUTER_API_KEY` | Yes for OpenRouter | Server-side OpenRouter key; prefer this canonical name over `OPEN_ROUTER` |
| `OPENROUTER_MODEL` | Recommended | `google/gemini-3-flash-preview` |
| `GOOGLE_CLIENT_ID` | Optional | Enables the Google sign-in button |
| `GOOGLE_CLIENT_SECRET` | Optional | Enables the Google sign-in button |

`NEXTAUTH_URL` falls back to Netlify's runtime `URL` variable, but setting it explicitly is recommended for a custom domain. Local `.env` and `.env.local` files are ignored by Git and are never uploaded to Netlify. Variables changed in Netlify take effect only after a new deploy.

Do not configure `AI_PROVIDER=local` on Netlify. A deployed function cannot connect to an AI server running on a laptop at `127.0.0.1`.

## Database deployment

Apply reviewed migrations once from a trusted environment before deploying the new application build:

```bash
npm run db:status
npm run db:migrate
```

Do not run `prisma db push` as the normal production deployment path. The app expects a pooled serverless database URL and reuses the Prisma client within warm Netlify function isolates.

## Verify after deployment

1. Open `https://YOUR_DOMAIN/api/health`.
2. Confirm the response says `status: "ready"`, `database: "ok"`, authentication values are `true`, and AI is configured.
3. Sign in and ask a short question in `/chat`.
4. If a request fails, copy the reference ID shown in the toast and search for it in Netlify function logs.

The health route never returns credentials. A `503` response means at least one required runtime dependency is unavailable. Common results:

- `ai.configured: false`: provider/key naming or Netlify Functions scope is wrong.
- `database: "unavailable"`: `DATABASE_URL`, network access, pool limits or migration state is wrong.
- `secretConfigured: false`: `NEXTAUTH_SECRET` is missing from the function runtime.
- `urlConfigured: false`: neither `NEXTAUTH_URL` nor Netlify's runtime `URL` is available.

## Google OAuth callback

When Google sign-in is enabled, add this authorized redirect URI in Google Cloud:

```text
https://YOUR_DOMAIN/api/auth/callback/google
```

The sign-in page automatically hides Google when both OAuth credentials are not configured, while email/password sign-in remains available.
