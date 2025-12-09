# PENDING_ITEMS.md

Priority-sorted tasks for NDIS Insight.

## 🔴 Critical
- [ ] **Infrastructure:** Replace in-memory `USER_PREFS_DB` in `services/modelRouter.ts` with real PostgreSQL calls.
- [ ] **Security:** Replace simulated `services/authService.ts` with NextAuth.js or Firebase Auth.
- [ ] **Compliance:** Implement real-time disclaimer banner on all Chat UI interactions ("AI can make mistakes").

## 🟡 High
- [ ] **Data:** Connect `services/documentUpdater.ts` to a real headless browser or scraping API.
- [ ] **Data:** Implement real pgvector storage in `services/ragService.ts`.
- [ ] **UX:** Add "Export to PDF" functionality for `DocumentGenerator`.

## 🟢 Medium
- [ ] **Dev:** Add unit tests for `InsightOrchestrator` prompt generation.
- [ ] **UI:** Enhance Dark Mode contrast in `KnowledgeBase` charts.

## 🔵 Low
- [ ] **Docs:** Add screenshots to `README.md`.
- [ ] **Refactor:** Optimize generic types in `types.ts`.
