# Arogya Sahayak rebuild baseline

Date: 2026-08-19

## Product baseline

- Next.js 15 / React 18 application with NextAuth and PostgreSQL via Prisma.
- Patient features: AI chat, health tracking, medicine reminders, records, appointments, emergency contacts, vaccinations, dictionary and profile.
- Student features: AI tutor, mock tests, study plans and guided learning.
- Existing working-tree changes were preserved before this rebuild on branch `codex/near-perfect-rebuild`.

## Phase 0 findings

- Build blocked by outdated Next.js dynamic-route parameter contracts and TypeScript errors.
- Chat-session ownership was not checked before appending a message.
- Several AI routes had no authentication, validation, rate limit or bounded request size.
- The health tracker called a missing POST contract; dictionary favourites called a missing API.
- No test suite, non-interactive lint gate, error boundary, loading shell or formal accessibility check.
- Medical claims, generated provider content and emergency-location content were not sufficiently transparent.
- Visual design was inconsistent and overly dependent on neon gradients, glass cards and decorative motion.
- AI used direct provider calls without grounded retrieval, citations, evaluation hooks or a local-provider mode.

## Resource constraints

Development is designed for an 8 GB RAM laptop with a 4 GB RTX 3050. The rebuild therefore avoids Docker, local model training, large model downloads and persistent vector databases. Retrieval is lexical and in-process; browser speech is the zero-key default; local inference is an optional OpenAI-compatible endpoint run by the user only when resources permit.

## Non-negotiable safety boundary

Arogya Sahayak is an educational and organisational health companion, not a doctor, diagnostic system or emergency service. It must surface source provenance, uncertainty and escalation guidance, minimize health data, and never fabricate clinicians, hospitals, approvals or nearby locations.
