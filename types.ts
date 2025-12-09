
/**
 * NDIS INSIGHT - TYPE DEFINITIONS
 * Integrated System Types (Phases 1-7)
 */

// --- 1. User & Identity ---
export interface User {
  id: string;
  name: string;
  role: 'participant' | 'coordinator' | 'admin';
  createdAt: string;
}

// --- 2. Model System (Backend Storage Schemas) ---

export type AIProvider = 'gemini' | 'openai_compatible' | 'anthropic';

export interface ModelConfig {
  id: string; // UUID
  name: string; // Display name (e.g., "My Private Local Llama")
  provider: AIProvider;
  modelId: string; // The technical model ID (e.g., "gemini-2.5-flash", "gpt-4")
  
  // Connection Details
  endpoint?: string; // Optional for official cloud providers, required for local
  apiKey?: string; // Stored encrypted in real DB
  headers?: Record<string, string>; // Custom headers for enterprise proxies
  
  // Model Parameters
  contextWindow: number;
  maxOutputTokens?: number;
  defaultTemperature?: number; // Added in Phase 3
  
  // System Flags
  isSystemDefault?: boolean; // If true, cannot be deleted
  isOfficial?: boolean; // Verified by NDIS Insight
}

export interface UserModelPreferences {
  userId: string;
  selectedModelId: string; // The ID of the ModelConfig they want to use
  fallbackEnabled: boolean; // If true, reverts to System Default on error
  emotionalSafetyLevel: 'standard' | 'sensitive' | 'high-support';
}

// --- 3. RAG & Documents ---
export interface NDISDocument {
  id: string;
  title: string;
  category: string;
  version: string;
  lastUpdated: string;
  sourceUrl: string;
  status: 'active' | 'archived' | 'draft';
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  pageNumber: number;
  sectionHeader: string;
  content: string;
  embedding: number[];
}

export interface WeeklyVersion {
  id: string; // e.g. "2025-W50"
  date: string;
  changelog: string[];
  docsUpdated: number;
}

export interface IngestionJob {
  id: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  progress: number; // 0-100
  currentStep: string;
  logs: string[];
}

// --- 4. Runtime & Logs ---
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    usedModelId?: string;
    provider?: string;
    processingTimeMs?: number;
    fallbackTriggered?: boolean;
    orchestratorMode?: InsightMode;
  };
}

export interface ModelResponse {
  content: string;
  metadata: {
    modelConfig: ModelConfig;
    latency: number;
    usedFallback: boolean;
  };
}

// --- 5. Orchestrator & Tools ---
export type InsightMode = 'chat_explainer' | 'doc_compliance' | 'doc_letter' | 'doc_log';

export interface GenerationTool {
  id: string;
  name: string;
  description: string;
  mode: InsightMode;
  fields: {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'date';
    placeholder?: string;
  }[];
}

// --- 6. Developer Experience ---
export interface DevNoteEntry {
  phase: number;
  title: string;
  date: string;
  content: string; // Markdown supported
}
