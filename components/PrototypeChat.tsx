import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, InsightMode } from '../types';
import { ModelRouter } from '../services/modelRouter';
import { InsightOrchestrator } from '../services/orchestrator';

interface PrototypeChatProps {
  userId: string;
}

const QUICK_QUESTIONS = [
  "What are the NDIS eligibility requirements?",
  "Explain 'Reasonable and Necessary' criteria",
  "How do I claim transport costs?",
  "Difference between Plan & Self-Managed?"
];

export const PrototypeChat: React.FC<PrototypeChatProps> = ({ userId }) => {
  const router = ModelRouter.getInstance();
  const orchestrator = InsightOrchestrator.getInstance();
  const [prefs, setPrefs] = useState(router.getUserPreferences(userId));
  
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<InsightMode>('chat_explainer');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPrefs(router.getUserPreferences(userId));
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textOverride?: string) => {
    // If textOverride is provided (from button click), use it. Otherwise use input state.
    const textToSend = typeof textOverride === 'string' ? textOverride : input;
    
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    
    // Only clear the input box if the user typed the message
    if (!textOverride) setInput('');
    
    setIsTyping(true);

    try {
      // PHASE 5: Call Orchestrator instead of raw ModelRouter
      const response = await orchestrator.processRequest(
        userId,
        mode,
        textToSend,
        messages
      );

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        metadata: {
          usedModelId: response.metadata.modelConfig.name,
          provider: response.metadata.modelConfig.provider,
          fallbackTriggered: response.metadata.usedFallback,
          processingTimeMs: response.metadata.latency,
          orchestratorMode: mode
        }
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: "Error: Unable to generate response. Please check your model settings.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border dark:border-slate-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-800 transition-colors">
      {/* Header with Mode Selector */}
      <div className="bg-gray-50 dark:bg-slate-900 p-4 border-b dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
        <div>
            <h3 className="font-semibold text-gray-800 dark:text-slate-100">Compliance Assistant</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">
                Engine: <span className="font-mono text-blue-600 dark:text-blue-400">{prefs.selectedModelId}</span>
            </p>
        </div>
        <select 
            value={mode}
            onChange={(e) => setMode(e.target.value as InsightMode)}
            className="text-xs border border-gray-300 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
        >
            <option value="chat_explainer">Explainer Mode (Simple English)</option>
            <option value="doc_compliance">Compliance Check Mode</option>
        </select>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-slate-900/50">
        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full space-y-8 p-4">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100">How can I help you today?</h3>
                    <p className="text-gray-500 dark:text-slate-400 max-w-sm mx-auto text-sm">
                        Ask questions about your NDIS plan, specific line items, or verify operational guidelines.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                    {QUICK_QUESTIONS.map((q, i) => (
                        <button 
                            key={i}
                            onClick={() => handleSend(q)}
                            className="text-left text-sm p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md hover:bg-blue-50 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-200 font-medium group"
                        >
                            <span className="group-hover:text-blue-700 dark:group-hover:text-blue-400">{q}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : msg.role === 'system'
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                  : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-100 shadow-sm'
            }`}>
              <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
              
              {/* Metadata Footer */}
              {msg.metadata?.usedModelId && (
                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-slate-700 flex flex-wrap gap-2 text-[10px] font-mono">
                      <span className="text-gray-500 dark:text-slate-400">Model: {msg.metadata.usedModelId}</span>
                      <span className="text-purple-500 dark:text-purple-400">Mode: {msg.metadata.orchestratorMode}</span>
                      {msg.metadata.fallbackTriggered && (
                        <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-900/30 px-1 rounded">⚠️ Fallback Used</span>
                      )}
                  </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
            <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 p-3 rounded-lg text-xs text-gray-500 dark:text-slate-400 animate-pulse flex items-center gap-2 shadow-sm">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                    Orchestrator: Assembling Context & Safety Rules...
                </div>
            </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-800 border-t dark:border-slate-700 transition-colors">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            placeholder="Type your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={() => handleSend()}
            disabled={isTyping || (!input.trim())}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};