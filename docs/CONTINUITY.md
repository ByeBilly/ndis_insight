# CONTINUITY.md — Mandatory Multi-Agent Continuity Standard

This document defines the **Universal Continuity Requirement** for NDIS Insight.
It is a **priority document** that MUST be read and respected by **all agents**.

## 1. Universal Continuity Requirement
All agents must help maintain long-term continuity across all repositories. Agents MUST record information that future agents will need, including:
- Context lost between builds/sessions.
- Architectural decisions and constraints.
- Knowledge required for safe continuation.

## 2. Start-of-Session Ritual
Before performing work, every agent must:
1. Read `docs/PROJECT_OVERVIEW.md` to get the latest status.
2. Read `docs/PENDING_ITEMS.md` to identify priorities.
3. Read `docs/CONTINUITY.md` (this file) to refresh rules.
4. Read `docs/REDTEAM.md` to understand risks.

## 3. End-of-Session Handover
Before ending a session, every agent must:
1. Update `docs/PROJECT_OVERVIEW.md` with the latest work and status.
2. Update `docs/SESSION_HISTORY.md` with a summary of changes.
3. Update `docs/PENDING_ITEMS.md` (add new tasks, remove completed ones).
4. Log any architectural warnings in `docs/NOTES_CHATGPT.md`.

## 4. Cross-Agent Communication Rules
- **Explicit Handoffs:** Use `SESSION_HISTORY.md` to tell the next agent exactly what was left unfinished.
- **No Assumptions:** Do not assume the next agent knows about hidden dependencies. Document them in `docs/SPEC.md`.
- **Tone:** Maintain the mental-health-aware tone (calm, supportive, clear) in all user-facing code and documentation.

## 5. Priority Levels
- **🔴 Critical:** System breakage, safety violation (e.g., AI promising funding), data leak.
- **🟡 High:** Missing core features, unverified NDIS data, auth issues.
- **🟢 Medium:** UI polish, new tools, performance optimization.
- **🔵 Low:** Refactoring, documentation updates (non-critical).

## 6. Emergency Recovery Procedure
If the continuity chain is broken (e.g., files missing, state inconsistent):
1. Re-read `docs/SPEC.md` and `docs/NOTES_CHATGPT.md` to ground truth.
2. Check `docs/SESSION_HISTORY.md` for the last known good state.
3. If NDIS data is corrupted, trigger a manual run of the `DocumentUpdater` (simulated or real).

## 7. Verification & Audit
- Agents must verify that `metadata.json` matches the actual app capabilities.
- Agents must ensure `services/orchestrator.ts` strictly enforces safety prompts.
