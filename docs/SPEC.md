# SPEC.md — NDIS Insight Product Specification

## 1. Core Features
- **Assistant Chat:** Context-aware Q&A about NDIS pricing and guidelines.
- **Document Tools:** Generators for Support Logs, Provider Letters, and Plan Reviews.
- **Knowledge Base:** Visualization of the RAG index and update status.
- **Engine Room:** Configuration of AI models (System default vs Custom).

## 2. Architecture
- **Frontend:** React SPA (Next.js compatible structure) with Tailwind CSS.
- **State:** Local React State + Simulated Backend Services.
- **Services:**
    - `authService`: User session.
    - `modelRouter`: AI provider abstraction.
    - `orchestrator`: Prompt engineering & safety.
    - `ragService`: Vector retrieval.
    - `documentUpdater`: Data ingestion.

## 3. Data Models (See `types.ts`)
- **User:** `id, name, role`.
- **ModelConfig:** `provider, endpoint, apiKey, contextWindow`.
- **NDISDocument:** `id, title, version, sourceUrl, status`.
- **ChatMessage:** `role, content, metadata`.

## 4. User Flows
- **Onboarding:** Login -> Dashboard -> Chat.
- **Configuration:** Settings -> Select "Custom Model" -> Enter Keys -> Test -> Save.
- **Compliance Task:** Tools -> Select "Support Log" -> Fill Form -> Generate -> Copy.
- **Verification:** Knowledge Base -> Check "Last Update" date -> Chat.

## 5. Acceptance Criteria
- [x] Users can switch between Gemini and OpenAI-compatible endpoints.
- [x] Chat responses cite sources when in "Explainer Mode".
- [x] System refuses to promise funding outcomes.
- [x] Weekly updater simulation runs and updates the mock DB.
