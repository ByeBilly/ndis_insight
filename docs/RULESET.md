# RULESET.md

## Rule 1 — Mandatory Multi-Agent Continuity Logging
All agents must record information that future agents will need, including:
- Communications intended for future sessions.
- Context that would otherwise be lost.
- Architectural decisions and constraints.

## Rule 2 — Documentation Updates
- Never leave documentation stale. If code changes, `SPEC.md` and `PROJECT_OVERVIEW.md` must change.
- `SESSION_HISTORY.md` must be updated at the end of every turn.

## Rule 3 — Code Quality & Safety
- **Model Agnosticism:** Do not hardcode "Gemini" or "GPT" logic outside of the `modelRouter` adapter layer.
- **Type Safety:** Maintain strict TypeScript interfaces in `types.ts`.
- **Mental Health Tone:** Variable naming and UI copy should be clear, calm, and professional.

## Rule 4 — Git & Versioning
- (Simulated for this prototype) Commit messages should reference the Phase number (e.g., "Phase 7: Final Integration").

## Rule 5 — Handover
- Always assume the next agent has zero context unless it is written in `docs/PROJECT_OVERVIEW.md`.
