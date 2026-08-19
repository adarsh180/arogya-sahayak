# Privacy and safety boundary

## Product claim

Arogya Sahayak provides health education, organisation and medical-learning support. It does not diagnose, prescribe, replace professional care or provide emergency response.

## Data handling implemented in code

- Authenticated ownership checks for personal records and chat sessions.
- Password hashing with bcrypt.
- Bounded JSON and upload sizes.
- Server-side AI keys only.
- Security headers and restrictive framing policy.
- Minimal upload types and no fabricated image analysis.
- Emergency phrase interception before provider inference.
- Explicit evidence metadata returned separately from generated text.

## Deployment responsibilities

Source code alone cannot establish regulatory compliance. A production operator must document lawful purpose, consent/notice, retention and deletion, subprocessors, incident response, access controls, backups, encryption and key management, vulnerability management, clinical governance and accessibility testing.

Do not display institutional approval, HIPAA compliance, end-to-end encryption or security-audit claims unless current written evidence supports the exact deployed system and wording.

## Known limits

- The emergency classifier is a conservative phrase screen, not a clinical triage model.
- The in-memory rate limiter is process-local.
- The curated retrieval registry is deliberately small.
- Browser voice support varies and may use vendor services.
- Deterministic measurement context uses general adult reference boundaries and cannot account for pregnancy, paediatrics, athletic conditioning, comorbidities or individual treatment plans.
