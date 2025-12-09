
import { ModelRouter } from './modelRouter';
import { retrieveContext } from './ragService';
import { ChatMessage, InsightMode, ModelResponse } from '../types';

/**
 * PHASE 5 & 6: ORCHESTRATOR
 * This is the "Manager" layer. 
 * Responsibilities:
 * 1. Prompt Engineering (System Instructions)
 * 2. RAG Injection (Context Assembly)
 * 3. Mode Selection (Explainer vs Drafter)
 * 4. Safety Enforcement
 */

export class InsightOrchestrator {
  private static instance: InsightOrchestrator;
  private router = ModelRouter.getInstance();

  private constructor() {}

  public static getInstance(): InsightOrchestrator {
    if (!InsightOrchestrator.instance) {
      InsightOrchestrator.instance = new InsightOrchestrator();
    }
    return InsightOrchestrator.instance;
  }

  /**
   * Main entry point for the frontend
   */
  public async processRequest(
    userId: string,
    mode: InsightMode,
    input: string,
    history: ChatMessage[] = []
  ): Promise<ModelResponse> {
    
    // 1. Retrieve Grounding Context
    const context = await retrieveContext(input);

    // 2. Construct System Prompt based on Mode
    const systemPrompt = this.buildSystemPrompt(mode, context);

    // 3. Construct Message Payload
    const messages: ChatMessage[] = [
        ...history,
        { id: 'curr', role: 'user', content: input, timestamp: new Date().toISOString() }
    ];

    // 4. Call Model Router (The "Worker")
    const response = await this.router.callModel(
        userId,
        mode,
        messages,
        systemPrompt
    );

    // 5. Post-process (if needed, e.g., strict JSON parsing)
    // For now, we return raw text.

    return response;
  }

  private buildSystemPrompt(mode: InsightMode, context: string): string {
    const BASE_PROMPT = `
      You are NDIS Insight, a supportive and compliant assistant for the National Disability Insurance Scheme (Australia).
      
      CORE RULES:
      1. MODEL AGNOSTIC: Do not refer to yourself as Gemini, GPT, or any specific model. You are "NDIS Insight".
      2. COMPLIANCE: Only answer based on the provided NDIS context. If the context is missing, state that you cannot verify the information.
      3. SAFETY: Do not promise funding approval. Do not give legal or medical advice.
      4. TONE: Supportive, clear, professional, and calm. Suitable for users with psychosocial disabilities.
    `;

    const CONTEXT_BLOCK = `
      === OFFICIAL NDIS DOCUMENTATION EXCERPTS ===
      ${context}
      ===========================================
    `;

    switch (mode) {
      case 'chat_explainer':
        return `
          ${BASE_PROMPT}
          
          TASK: Explain the concept clearly to a participant or family member.
          - Use plain English.
          - Avoid jargon where possible.
          - Cite the source documents provided in the context.
          
          ${CONTEXT_BLOCK}
        `;

      case 'doc_letter':
        return `
          ${BASE_PROMPT}
          
          TASK: Draft a professional Provider Letter or Request for Service.
          - Format: Formal Business Letter.
          - Focus on 'Reasonable and Necessary' criteria.
          - Link the request to the participant's goals.
          
          ${CONTEXT_BLOCK}
        `;

      case 'doc_log':
        return `
          ${BASE_PROMPT}
          
          TASK: Create a Support Log Entry.
          - Format: Date, Time, Activity, Outcome.
          - Focus on evidence for future plan reviews.
          - Keep it factual and objective.
          
          ${CONTEXT_BLOCK}
        `;

      default:
        return `${BASE_PROMPT} ${CONTEXT_BLOCK}`;
    }
  }
}
