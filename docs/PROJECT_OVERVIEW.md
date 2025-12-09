# PROJECT_OVERVIEW.md — Session Starter / Continuation Brief

**Project Name:** NDIS Insight
**Last Updated:** [Current Date] by Gemini
**Status:** Phase 7 (Prototype Complete / Production Ready Architecture)

## 1. Current Vision / Purpose
NDIS Insight is a model-agnostic, compliance-focused AI assistant for the National Disability Insurance Scheme (NDIS). It prioritizes user safety, mental health awareness, and verifiable data provenance.
**Core Philosophy:** "NDIS-First" (Official docs override AI creativity) + "User Sovereignty" (User chooses the AI model).

## 2. Key Features / Modules
- **Model Router:** Abstracted layer to switch between Gemini, OpenAI, or Local LLMs.
- **Orchestrator:** "Manager" layer handling prompt engineering, safety injection, and RAG context assembly.
- **Weekly Updater:** Simulation of a scraper that ingests official NDIS Pricing and Guidelines.
- **Document Generator:** Tools to draft Support Logs, Provider Letters, and Reviews.
- **Knowledge Base:** Dashboard for viewing document versions and update status.
- **Authentication:** Simulated Google OAuth flow with session management.

## 3. Current Status
- **Architecture:** Fully defined (Phase 1).
- **Backend:** Simulated services (Router, Updater, Auth) implemented with mock DBs (Phase 2-4).
- **Frontend:** Production-ready React/Tailwind UI (Phase 3, 6).
- **Integration:** All subsystems connected via the Orchestrator (Phase 5, 7).
- **Documentation:** Full transparency logs (Developer Notes) and Deployment guides.

## 4. Active Branches / Environments
- **main:** Stable production-ready prototype.
- **deployment:** Configured for Vercel + Supabase (see DEPLOY.md).

## 5. Most Recent Work
- Completed Phase 7 Integration.
- Finalized top-level safety documentation in all services (`services/`).
- Implemented Multi-Agent Continuity Documentation System (`docs/`).
- Integrated Google Sign-In simulation.

## 6. Known Issues / Risks
- **Simulation Limits:** The "Weekly Updater" and "Auth Service" are currently mocks; they need to be swapped for real infrastructure (Cron/Firebase) in a live deployment.
- **Data Persistence:** Uses in-memory storage for the prototype; data resets on refresh. Needs SQL integration.
- **Hallucination Risk:** Even with RAG, AI models can hallucinate. Strict disclaimer UI is required.

## 7. Next Intended Actions
- **High Priority:** Connect `services/authService.ts` to real Firebase/NextAuth.
- **High Priority:** Connect `services/ragService.ts` to a real pgvector database.
- **Medium Priority:** Move `services/documentUpdater.ts` logic to an external worker.

## 8. User Feedback Highlights
- Users requested "Quick Question" buttons (Implemented).
- Users requested Dark Mode (Implemented).
- Users need transparency on where data comes from (Implemented in Knowledge Base).
