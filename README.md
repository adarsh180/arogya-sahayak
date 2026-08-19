# Arogya Sahayak

Arogya Sahayak is an evidence-aware health information, organisation and medical-learning application designed for India. It combines authenticated health records, deterministic measurement context, provider-backed conversations, lightweight retrieval, medication and appointment tools, and active-learning workflows.

It is not a diagnostic system, clinician or emergency service. In India, call 112 for an emergency.

## Current architecture

- Next.js 15.5 / React 18 / TypeScript
- NextAuth v4 with credentials and optional Google OAuth
- PostgreSQL through Prisma
- Provider adapter for Groq, Google, OpenRouter or a local OpenAI-compatible server
- Small in-process lexical retrieval layer with explicit source metadata
- Browser speech recognition and synthesis where supported; no application speech API key
- Tailwind plus a code-native product design system

## Resource-conscious development

The project is configured for a modest development laptop. It does not require Docker, a vector database, model training or a local model download. Run checks sequentially:

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

Do not run the development server and production build at the same time on an 8 GB machine.

## Setup

1. Copy `.env.example` to `.env.local` and fill only the providers you use.
2. Check migration state with `npm run db:status`, then apply committed migrations with `npm run db:migrate`.
3. Start with `npm run dev` and open `http://localhost:3000`.

For a legacy database that predates Prisma migration history, first take a backup
and establish a reviewed baseline. The current Neon database has been synchronized
and both Phase 0–8 migrations are recorded as applied. Do not use `db:push` as the
normal production deployment path.

## AI modes

Set `AI_PROVIDER` to one of:

- `local`: an OpenAI-compatible server at `LOCAL_LLM_BASE_URL`. The application never downloads or launches a model.
- `groq`: uses `GROQ_API_KEY`.
- `google`: uses `GOOGLE_AI_API_KEY` and `GOOGLE_AI_MODEL`.
- `openrouter`: uses `OPENROUTER_API_KEY` and defaults to the verified
  `google/gemini-3-flash-preview` slug. The legacy `OPEN_ROUTER` name is accepted,
  but new deployments should use the canonical variable.

If `AI_PROVIDER` is unset, only providers with configured credentials/endpoints are tried. Requests have bounded history, input size, output length, provider timeout and rate limits.

## Privacy and medical safety

- Chat sessions are always queried with the authenticated user ID.
- Potential emergency language is screened before calling an AI provider.
- Uploaded text may be sent to the configured provider when included in a question; users are told to remove unnecessary identifiers.
- The application does not currently claim HIPAA, ABDM, DPDP or any institutional certification. Compliance requires governance, contracts, security controls, audits and deployment-specific validation beyond source code.
- Generated medical-learning material is labelled as practice and should be verified against current primary sources and official curricula.

See [Netlify deployment](docs/NETLIFY_DEPLOYMENT.md), [AI architecture](docs/AI_ARCHITECTURE.md), [privacy and safety](docs/PRIVACY_AND_SAFETY.md), and the [rebuild baseline](docs/REBUILD_BASELINE.md).
