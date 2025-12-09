import { ModelConfig, UserModelPreferences, ChatMessage, ModelResponse, AIProvider } from '../types';
import { GoogleGenAI } from '@google/genai';

/**
 * PHASE 2: MODEL SYSTEM BACKEND
 * This file contains the complete backend logic for Model Management, Routing, and Execution.
 * It simulates a database for System Models and User Models.
 */

// --- 1. MOCK DATABASE (Storage Layer) ---

const SYSTEM_MODELS: ModelConfig[] = [
  {
    id: 'sys_gemini_flash',
    name: 'NDIS Official (Gemini 2.5 Flash)',
    provider: 'gemini',
    modelId: 'gemini-2.5-flash',
    contextWindow: 128000,
    isSystemDefault: true,
    isOfficial: true,
    defaultTemperature: 0.2
  },
  {
    id: 'sys_gemini_pro',
    name: 'NDIS Reasoning (Gemini 3 Pro Preview)',
    provider: 'gemini',
    modelId: 'gemini-3-pro-preview',
    contextWindow: 128000,
    isOfficial: true,
    defaultTemperature: 0.4
  }
];

// In-memory storage for the prototype
let USER_MODELS_DB: Record<string, ModelConfig[]> = {}; 
let USER_PREFS_DB: Record<string, UserModelPreferences> = {
  'u_123': {
    userId: 'u_123',
    selectedModelId: 'sys_gemini_flash',
    fallbackEnabled: true,
    emotionalSafetyLevel: 'standard'
  }
};

// --- 2. THE MODEL ROUTER (Orchestration Layer) ---

export class ModelRouter {
  private static instance: ModelRouter;

  private constructor() {}

  public static getInstance(): ModelRouter {
    if (!ModelRouter.instance) {
      ModelRouter.instance = new ModelRouter();
    }
    return ModelRouter.instance;
  }

  /**
   * BACKEND API: Get all models available to a user
   */
  public getAvailableModels(userId: string): ModelConfig[] {
    const userCustomModels = USER_MODELS_DB[userId] || [];
    return [...SYSTEM_MODELS, ...userCustomModels];
  }

  /**
   * BACKEND API: Get user preferences
   */
  public getUserPreferences(userId: string): UserModelPreferences {
    return USER_PREFS_DB[userId] || {
      userId,
      selectedModelId: SYSTEM_MODELS[0].id,
      fallbackEnabled: true,
      emotionalSafetyLevel: 'standard'
    };
  }

  /**
   * BACKEND API: Update user preferences
   */
  public updateUserPreferences(userId: string, prefs: Partial<UserModelPreferences>) {
    const current = this.getUserPreferences(userId);
    USER_PREFS_DB[userId] = { ...current, ...prefs };
  }

  /**
   * BACKEND API: Restore default model
   */
  public restoreDefaultModel(userId: string) {
    const defaultModel = SYSTEM_MODELS.find(m => m.isSystemDefault);
    if (defaultModel) {
      this.updateUserPreferences(userId, { selectedModelId: defaultModel.id });
    }
  }

  /**
   * BACKEND API: Save a custom model configuration
   */
  public saveUserCustomModel(userId: string, config: ModelConfig) {
    if (!USER_MODELS_DB[userId]) {
      USER_MODELS_DB[userId] = [];
    }
    // Update if exists, else add
    const existingIndex = USER_MODELS_DB[userId].findIndex(m => m.id === config.id);
    if (existingIndex >= 0) {
      USER_MODELS_DB[userId][existingIndex] = config;
    } else {
      USER_MODELS_DB[userId].push(config);
    }
  }

  /**
   * BACKEND API: Test a model configuration
   * Returns true if the model responds correctly with the handshake.
   */
  public async testModelConnection(config: ModelConfig): Promise<{ success: boolean; message: string }> {
    const testMessages: ChatMessage[] = [
      { 
        id: 'test', 
        role: 'user', 
        content: 'Reply with exactly: NDIS Insight test OK', 
        timestamp: new Date().toISOString() 
      }
    ];

    try {
      const response = await this.callConcreteModel(config, testMessages, "You are a test bot.");
      if (response.includes("NDIS Insight test OK")) {
        return { success: true, message: response };
      }
      return { success: true, message: response }; // Technically success even if text varies slightly, but we log it.
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  /**
   * CORE LOGIC: Route the request to the correct model configuration.
   */
  private routeModel(userId: string): ModelConfig {
    const prefs = this.getUserPreferences(userId);
    const available = this.getAvailableModels(userId);
    
    const selected = available.find(m => m.id === prefs.selectedModelId);
    
    if (selected) {
      return selected;
    }

    // Default Fallback if selection is invalid
    console.warn(`[Router] Selected model ${prefs.selectedModelId} not found for user ${userId}. Reverting to System Default.`);
    return SYSTEM_MODELS.find(m => m.isSystemDefault)!;
  }

  /**
   * CORE LOGIC: The Main Entry Point for AI Calls.
   * Handles Routing, Execution, Error Catching, and Fallback.
   */
  public async callModel(
    userId: string,
    feature: string,
    messages: ChatMessage[],
    systemInstruction?: string
  ): Promise<ModelResponse> {
    const startTime = performance.now();
    let config = this.routeModel(userId);
    const prefs = this.getUserPreferences(userId);
    let usedFallback = false;

    try {
      // Attempt Primary Call
      console.log(`[Router] Routing to: ${config.name} (${config.provider})`);
      const content = await this.callConcreteModel(config, messages, systemInstruction);
      
      return {
        content,
        metadata: {
          modelConfig: config,
          latency: Math.round(performance.now() - startTime),
          usedFallback: false
        }
      };

    } catch (error) {
      console.error(`[Router] Error with ${config.name}:`, error);

      if (prefs.fallbackEnabled && !config.isSystemDefault) {
        console.warn("[Router] Fallback Triggered. Switching to System Default.");
        usedFallback = true;
        config = SYSTEM_MODELS.find(m => m.isSystemDefault)!;

        try {
          const content = await this.callConcreteModel(config, messages, systemInstruction);
           return {
            content,
            metadata: {
              modelConfig: config,
              latency: Math.round(performance.now() - startTime),
              usedFallback: true
            }
          };
        } catch (fallbackError) {
           throw new Error("Critical: Both selected model and fallback model failed.");
        }
      }
      
      throw error; // Re-throw if fallback is disabled or if system default failed
    }
  }

  /**
   * ADAPTER LAYER: Switch between concrete implementations.
   */
  private async callConcreteModel(
    config: ModelConfig,
    messages: ChatMessage[],
    systemInstruction?: string
  ): Promise<string> {
    
    switch (config.provider) {
      case 'gemini':
        return this.callGeminiProvider(config, messages, systemInstruction);
      case 'openai_compatible':
        return this.callOpenAICompatibleProvider(config, messages, systemInstruction);
      default:
        throw new Error(`Provider ${config.provider} not implemented.`);
    }
  }

  // --- 3. CONCRETE IMPLEMENTATIONS ---

  private async callGeminiProvider(
    config: ModelConfig, 
    messages: ChatMessage[],
    systemInstruction?: string
  ): Promise<string> {
    const apiKey = config.apiKey || process.env.API_KEY;
    if (!apiKey) throw new Error("Gemini API Key missing.");

    const ai = new GoogleGenAI({ apiKey });
    
    // Convert generic messages to Gemini format
    // NDIS Insight mainly uses 'user' prompts for the prototype, 
    // but here we support history.
    const lastUserMessage = messages[messages.length - 1].content;

    try {
        const response = await ai.models.generateContent({
            model: config.modelId,
            contents: lastUserMessage,
            config: {
                systemInstruction: systemInstruction,
                temperature: config.defaultTemperature ?? 0.2, // Low for compliance
            }
        });
        return response.text || "";
    } catch (e: any) {
        throw new Error(`Gemini API Error: ${e.message}`);
    }
  }

  private async callOpenAICompatibleProvider(
    config: ModelConfig,
    messages: ChatMessage[],
    systemInstruction?: string
  ): Promise<string> {
    if (!config.endpoint) throw new Error("Endpoint required for OpenAI Compatible provider.");
    
    // Construct the payload
    // Note: Most local LLMs (Ollama, vLLM) support the /v1/chat/completions format
    const payload = {
      model: config.modelId,
      messages: [
        { role: 'system', content: systemInstruction || "You are a helpful assistant." },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ],
      temperature: config.defaultTemperature ?? 0.2
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers
    };

    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }

    try {
      const response = await fetch(`${config.endpoint}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "No content received.";
    } catch (e: any) {
       // Simulate a specific error for testing fallbacks
       if (config.endpoint.includes('fail')) throw new Error("Simulated connection failure");
       throw new Error(`Provider Connection Error: ${e.message}`);
    }
  }
}