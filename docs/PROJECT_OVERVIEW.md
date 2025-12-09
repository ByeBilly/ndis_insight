# PROJECT_OVERVIEW.md — Session Starter / Continuation Brief

This document is the high-level, always-up-to-date summary of the project.

The human will copy/paste this file at the beginning of new sessions with
ChatGPT, Gemini, Cursor, Bolt, or DeepSeek to provide immediate context.

All agents must keep this file accurate and current.

## 1. Project Name
NDIS Insight

## 2. Current Vision / Purpose
A model-agnostic, compliance-focused AI assistant for the National Disability Insurance Scheme (NDIS). It prioritizes user safety, mental health awareness, and verifiable data provenance by routing requests through a central orchestrator and grounding answers in official NDIS documentation via a Weekly Updater.

## 3. Key Features / Modules
- **Model Router:** Abstracted layer to switch between Gemini, OpenAI, or Local LLMs.
- **Orchestrator:** "Manager" layer handling prompt engineering, safety injection, and RAG.
- **Weekly Updater:** Simulation of a scraper that ingests official NDIS Pricing and Guidelines.
- **Document Generator:** Tools to draft Support Logs, Provider Letters, and Reviews.
- **Knowledge Base:** Dashboard for viewing document versions and update status.

## 4. Current Status
Phase 1-7 Complete. The application is a fully functional architecture prototype. Core services (Router, Orchestrator, Updater, Auth) are implemented with simulated backends (mock DBs) suitable for demonstration. UI is production-ready React/Tailwind.

## 5. Active Branches / Environments
- **main:** Stable production-ready prototype.
- **dev:** (None currently active)
- **deployment notes:** Configured for Vercel deployment with Supabase/PostgreSQL hooks defined in DEPLOY.md.

## 6. Most Recent Work
Completed Phase 7 Integration:
- Finalized top-level safety documentation in all services.
- Generated production `README.md` and `DEPLOY.md`.
- Expanded `DeveloperNotes.tsx` to cover all 7 phases with transparency logs.
- Integrated Google Sign-In simulation.

## 7. Known Issues / Risks
- **Simulation Limits:** The "Weekly Updater" and "Auth Service" are currently mocks; they need to be swapped for real infrastructure (Cron/Firebase) in a live deployment.
- **Data Persistence:** Uses in-memory storage for the prototype; data resets on refresh. Needs SQL integration.

## 8. Next Intended Actions
- Connect `services/authService.ts` to real Firebase/NextAuth.
- Connect `services/ragService.ts` to a real pgvector database.
- Move `services/documentUpdater.ts` logic to an external worker.

## 9. User Feedback Highlights
(Awaiting User Feedback - See `docs/USER_FEEDBACK.md`)

## 10. Last Updated
- Date: [Current Date]
- By: Gemini (Phase 7 Finalisation)
- Summary of change: Implementation of Multi-Agent Continuity Documentation.
