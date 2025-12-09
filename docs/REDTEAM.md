# REDTEAM.md

Risk analysis and adversarial thinking for NDIS Insight.

## 1. Technical Risks
- **Hallucination:** Models may invent NDIS line items. **Mitigation:** Strict RAG grounding + "Compliance Mode" system prompts.
- **Scraper Blocking:** NDIS.gov.au may block the Weekly Updater. **Mitigation:** Use legitimate APIs where available, or respect `robots.txt` / rate limits.
- **Latency:** RAG + multiple model hops might be slow. **Mitigation:** Streaming responses (Phase 8 feature).

## 2. Business / Compliance Risks
- **Funding Promises:** AI promising funding ("You will get this approved") is a critical failure. **Mitigation:** System prompt explicitly forbids this ("Do not promise funding approval").
- **Legal Liability:** Users acting on AI advice that turns out wrong. **Mitigation:** Robust Terms of Service + prominent Disclaimers.

## 3. Security Considerations
- **API Key Leakage:** Users entering custom API keys. **Mitigation:** Keys must be encrypted at rest (Postgres pgcrypto) and never returned to the client in plain text.
- **Prompt Injection:** Malicious inputs trying to bypass safety. **Mitigation:** Orchestrator sanitization layers.

## 4. Mental Health Safety
- **Tone Policing:** AI becoming argumentative. **Mitigation:** "Emotional Safety Level" preference in user settings.
