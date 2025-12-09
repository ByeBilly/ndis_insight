# USER_FEEDBACK.md

Direct log of human input and decisions.

## Recent Feedback
- **Request:** "Can we have a dark mode switch?" -> **Action:** Implemented in Phase 7.
- **Request:** "One click questions for general questions." -> **Action:** Added Quick Buttons to PrototypeChat.
- **Request:** "Have you actually found the NDIS data?" -> **Action:** Clarified data sources in KnowledgeBase and DeveloperNotes.
- **Request:** "Do we have oauth?" -> **Action:** Implemented Google Sign-In simulation.

## Pain Points
- No real persistence (simulated DB resets on reload).
- Need to copy-paste documents manualy in simulation mode.

## Decisions
- The app must remain model-agnostic to support user sovereignty.
- We will prioritize "Explainer Mode" over "Legal Mode" for accessibility.
