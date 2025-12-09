# NOTES_CHATGPT.md

**Architectural Intent & Long-Term Guidance**

## 1. Design Philosophy
- **Model Agnostic:** The system must NEVER rely on a single AI provider's propriety features if they cannot be abstracted. We must support BYO (Bring Your Own) models via standard APIs.
- **NDIS First:** Official government documentation is the source of truth. If the RAG retrieval conflicts with the model's training data, RAG wins.
- **Mental Health Safety:** The UI and AI persona must be calm, supportive, and non-judgmental. We design for users who may be stressed or experiencing psychosocial disabilities.

## 2. Critical Invariants
- **Orchestrator Pattern:** No UI component calls `ModelRouter` directly. All requests pass through `services/orchestrator.ts` to ensure safety prompts are injected.
- **Data Provenance:** Every AI response must cite its source (Phase 1/4 requirement).
- **User Control:** The user can always restore the default model and settings.

## 3. Tech Stack Rationale
- **Next.js/React:** Standard, performant, component-based.
- **Tailwind CSS:** rapid UI development, easy Dark Mode.
- **pgvector:** PostgreSQL extension chosen for vector storage to keep stack simple (relational + vector in one DB).

## 4. Continuity Notes for Future Sessions
- When moving to production, ensure the `DocumentUpdater` is decoupled from the main web server loop to prevent timeouts.
- The `metadata.json` file is critical for the build environment; keep it minimal.
