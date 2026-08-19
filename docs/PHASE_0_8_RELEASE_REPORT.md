# Arogya Sahayak — Phase 0–8 release report

Date: 19 August 2026  
Branch: `codex/near-perfect-rebuild`

## Executive outcome

The project now has a stable Next.js foundation, a cohesive premium visual system,
an evidence-aware AI boundary, safer medical behavior, authenticated data access,
resource-conscious multilingual voice input/output, and a tested production build.

This release is a strong product and engineering foundation. It is not a certified
medical device and must not be described as one. Clinical validation, a production
database, observability, real provider credentials, and a formal privacy/security
review remain deployment gates.

## Phase scorecard

| Phase | Scope | Status | Evidence |
| --- | --- | --- | --- |
| 0 | Baseline and risk inventory | Complete | `REBUILD_BASELINE.md`, dependency and route review |
| 1 | Foundation and security | Complete | Next.js/Auth upgrades, headers, middleware, validation, ownership checks |
| 2 | Brand and design system | Complete | New identity, ivory/forest/saffron system, typography, responsive shell |
| 3 | Public and authentication UX | Complete | Landing, sign-in, sign-up, responsive navigation, policy surfaces |
| 4 | Onboarding and motion | Complete | Guided onboarding, direction cues, reduced-motion support, animated logo loader |
| 5 | Core product experiences | Complete | Chat, dashboard, student workspace, emergency, dictionary and profile improvements |
| 6 | AI, RAG and voice foundation | Complete | Provider adapter, bounded retrieval, source metadata, Indian-language browser voice |
| 7 | Medical safety and privacy | Complete | Emergency interception, 112 escalation, honest limits, safer upload and health analysis |
| 8 | Verification and release hardening | Complete | Build, typecheck, lint gate, tests, audit, desktop/mobile browser QA |

## Release evidence

- Production build: passed; 52 routes generated.
- TypeScript: passed.
- Automated tests: 6 passed, 0 failed.
- Dependency audit: 0 known vulnerabilities at the configured audit level.
- Repository whitespace/error check: passed.
- Browser QA: desktop and 390 x 844 mobile layouts inspected; navigation,
  authentication redirects, mobile menu, and route loader verified.
- Peak Node heap for the build was capped at 3 GB to remain suitable for the
  available 8 GB development machine.

## Resource profile

The architecture deliberately avoids local model training, local vector databases,
container orchestration, and background polling. Retrieval uses a small curated
in-process registry. Voice uses browser/OS speech capabilities. AI inference is
remote by default or can target an explicitly configured lightweight local
OpenAI-compatible server; the application does not download or launch a model.

## Deployment gates

1. Configure environment variables from `.env.example`; never commit secrets.
2. Apply the Prisma migrations to a backed-up staging database.
3. Exercise authenticated end-to-end flows against that database.
4. Select and contract an AI provider, then run cost, latency, refusal, and red-team evals.
5. Replace in-memory rate limiting with a shared production store when horizontally scaling.
6. Add encryption/key management, retention/deletion workflows, audit logs, and incident response.
7. Have qualified Indian clinicians validate health content, emergency wording, and escalation paths.
8. Complete legal review for the DPDP Act, consent language, and any regulated-device claims.

## Known limitations

- Browser speech support and language quality vary by browser, operating system,
  installed voices, and vendor services. “No application speech API key” does not
  mean speech is guaranteed to run fully offline.
- The RAG corpus is intentionally small and curated. It should be expanded through
  a reviewed ingestion and provenance pipeline, not unrestricted web scraping.
- The current automated suite covers the highest-risk medical safety and retrieval
  primitives; it is not yet a full integration, accessibility, or clinical-evaluation suite.
- The lint gate has no errors but still reports legacy warnings in secondary screens.
- Generated answers remain probabilistic and must be presented as educational
  support, never diagnosis, prescription, or emergency triage.

## Next recommended release

Run a staging pilot with synthetic data, add Playwright authenticated journeys and
axe accessibility checks, instrument privacy-safe observability, and build an offline
evaluation set reviewed by clinicians before allowing real patient information.

## Follow-up hardening — theme, database and knowledge routing

- Reconciled the live Neon database with the Prisma schema and recorded both
  migrations as applied; `User.onboardingCompleted` and `MedicalFavorite` now exist.
- Added persistent, pre-hydration light/dark theming with contrast-safe product
  tokens and compatibility styling for remaining legacy Tailwind screens.
- Replaced the landing-page bar placeholder with an accessible SVG line trend,
  staged path/point animation, a scan cursor and reduced-motion behavior.
- Expanded retrieval routing across Indian clinical specialty guideline indexes,
  the NMC education framework and WHO health topics. Index sources are explicitly
  prevented from being treated as evidence for patient-specific treatment.
- Strengthened the medical answer protocol for missing context, red flags,
  pregnancy, paediatrics, older adults, kidney/liver disease and medication risk.

## Follow-up coherence — typography, chat and OpenRouter

- Replaced the mixed serif/sans presentation with one variable Inter family and
  a consistent weight, spacing and heading scale across old and new surfaces.
- Normalised interaction timing around shared fast/base/slow motion tokens and
  removed opacity fades from text-bearing page transitions.
- Rebuilt the primary chat presentation with the Arogya mark, Health/Study modes,
  readable structured answers, safe tables/lists, copy and read-aloud actions,
  evidence cards and clearer conversation history.
- Added explicit creator identity: Arogya Sahayak credits Adarsh while refusing to
  invent qualifications, affiliations, endorsements or regulatory authority.
- Corrected OpenRouter configuration compatibility and pinned the live-verified
  `google/gemini-3-flash-preview` model with bounded, hidden reasoning.
