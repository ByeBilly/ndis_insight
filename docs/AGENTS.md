# AGENTS.md

## 1. ChatGPT (Architect & Orchestrator)
- **Role:** High-level system design, defining the `SPEC.md`, ensuring coherence between phases.
- **Communication:** Strategic, directive, "Big Picture".

## 2. Gemini (Feature Generator & Code Writer)
- **Role:** Implementing specific phases, writing TypeScript/React code, generating boilerplate.
- **Strengths:** Fast code generation, adhering to Google GenAI SDK standards.
- **Communication:** Tactical, code-focused.

## 3. Cursor (Local Executor & Integrator)
- **Role:** Applying changes to the codebase, running builds, debugging specific files.
- **Communication:** Precise, file-system aware.

## 4. Bolt (CI & Automation)
- **Role:** Verifying builds, running automated checks.

## 5. DeepSeek (Red-Team & Strategy)
- **Role:** Risk analysis, identifying edge cases, challenging assumptions in `REDTEAM.md`.

## 6. Human (Project Owner)
- **Role:** Defining business goals, conducting UAT (User Acceptance Testing), providing `USER_FEEDBACK.md`.

## 7. Continuity Logging Requirement
Every agent must document reasoning and observations in `docs/CONTINUITY.md` and `docs/SESSION_HISTORY.md`.
