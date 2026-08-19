# AI architecture

## Request path

1. Authenticate the user.
2. Validate and bound the request body.
3. Apply a per-user, in-process rate limit.
4. Screen health conversations for emergency language.
5. Retrieve up to three relevant entries from the reviewed source registry.
6. Send bounded history, safety instructions and retrieved evidence to one configured provider.
7. Store the answer and return source metadata separately.

The source registry in `lib/rag.ts` is intentionally small. Its purpose is to establish provenance and a safe contract, not to imply comprehensive clinical coverage.

## Provider strategy

`lib/ai.ts` exposes one server-side adapter for local, Groq, Google and OpenRouter OpenAI-compatible chat endpoints. Temperature and response length are lower for health use. Calls time out after 28 seconds and retries are capped.

The verified OpenRouter default is `google/gemini-3-flash-preview`. Gemini 3 Flash
uses medium, hidden reasoning for the core chat route; reasoning traces are not
returned to the user. `OPENROUTER_API_KEY` is the canonical environment name.
`OPEN_ROUTER` is accepted as a backwards-compatible alias and is prioritised when
present so a separate Groq key cannot silently take over the request.

The assistant identity credits the product to Adarsh but explicitly forbids
inventing a surname, qualification, institution, endorsement or government
affiliation. Personalisation uses a small, non-clinical profile projection and
treats it as incomplete until the user confirms safety-critical details.

The local mode points to an endpoint supplied by the operator. This repository does not download weights, train models or start a GPU process. On an RTX 3050 with 4 GB VRAM, model choice and quantisation are operational decisions outside the web application; cloud inference remains the safest default for laptop stability.

## Voice

Browser `SpeechRecognition` and `speechSynthesis` provide a no-application-key voice layer. Browser and OS support varies by language, and a browser vendor may process speech remotely. The UI must never describe browser speech as guaranteed offline. Microphone permission is requested only after the user activates voice.

## RAG expansion path

- Add ingestion only for licensed, versioned, clinically reviewed documents.
- Store chunk source, publication date, review date and jurisdiction.
- Add a retrieval threshold and return “insufficient evidence” below it.
- Evaluate citation entailment, emergency recall, refusal quality and language preservation before increasing coverage.
- Move rate limits and usage budgets to Redis or another shared store before multi-instance deployment.

Fine-tuning should not be the first safety tool. Retrieval, constrained outputs, evaluation and human review are easier to update and audit. Fine-tune only against a documented task and versioned, legally usable dataset.
