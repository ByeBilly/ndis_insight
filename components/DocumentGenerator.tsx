import React, { useState } from 'react';
import { GenerationTool, InsightMode } from '../types';
import { InsightOrchestrator } from '../services/orchestrator';

const TOOLS: GenerationTool[] = [
  {
    id: 'support_log',
    name: 'Support Log Entry',
    description: 'Document a support session to evidence funding usage.',
    mode: 'doc_log',
    fields: [
      { key: 'activity', label: 'Activity/Support Provided', type: 'text', placeholder: 'e.g. Community Access, Cooking' },
      { key: 'outcome', label: 'Outcome/Goal Progress', type: 'textarea', placeholder: 'How did this help the participant?' },
      { key: 'incident', label: 'Incidents (if any)', type: 'text', placeholder: 'Leave blank if none' }
    ]
  },
  {
    id: 'provider_letter',
    name: 'Provider Letter Draft',
    description: 'Draft a formal letter to a Plan Manager or Coordinator.',
    mode: 'doc_letter',
    fields: [
      { key: 'recipient', label: 'Recipient Name/Role', type: 'text', placeholder: 'e.g. Local Area Coordinator' },
      { key: 'topic', label: 'Subject/Request', type: 'text', placeholder: 'e.g. Request for Assistive Tech Quote' },
      { key: 'details', label: 'Key Details to Include', type: 'textarea', placeholder: 'List specific items and costs...' }
    ]
  }
];

export const DocumentGenerator: React.FC<{ userId: string }> = ({ userId }) => {
  const [selectedTool, setSelectedTool] = useState<GenerationTool | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedTool) return;
    setIsGenerating(true);
    setGeneratedOutput('');

    // Convert form data to a natural language prompt for the Orchestrator
    const promptInputs = selectedTool.fields.map(f => `${f.label}: ${formData[f.key] || 'N/A'}`).join('\n');
    const fullPrompt = `Please generate a ${selectedTool.name} with the following details:\n${promptInputs}`;

    try {
      const response = await InsightOrchestrator.getInstance().processRequest(
        userId,
        selectedTool.mode,
        fullPrompt
      );
      setGeneratedOutput(response.content);
    } catch (e) {
      setGeneratedOutput("Error generating document. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sidebar: Tool Selector */}
      <div className="md:col-span-1 space-y-4">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 uppercase text-xs tracking-wider">Available Tools</h3>
        <div className="space-y-2">
          {TOOLS.map(tool => (
            <button
              key={tool.id}
              onClick={() => { setSelectedTool(tool); setFormData({}); setGeneratedOutput(''); }}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedTool?.id === tool.id 
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 shadow-sm' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-500'
              }`}
            >
              <div className="font-semibold text-slate-800 dark:text-slate-100">{tool.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{tool.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main: Input & Output */}
      <div className="md:col-span-2 space-y-6">
        {selectedTool ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 animate-fade-in transition-colors">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 border-b dark:border-slate-700 pb-4">{selectedTool.name}</h2>
            
            {/* Form Fields */}
            <div className="space-y-4 mb-6">
              {selectedTool.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea 
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none h-24 transition-colors"
                      placeholder={field.placeholder}
                      value={formData[field.key] || ''}
                      onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                    />
                  ) : (
                    <input 
                      type="text" 
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                      placeholder={field.placeholder}
                      value={formData[field.key] || ''}
                      onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Action */}
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-70 flex justify-center items-center gap-2 transition-colors"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Drafting Document...
                </>
              ) : 'Generate Draft'}
            </button>

            {/* Output */}
            {generatedOutput && (
              <div className="mt-8 border-t dark:border-slate-700 pt-6 animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                   <h4 className="font-bold text-slate-700 dark:text-slate-300">Generated Draft</h4>
                   <button 
                    onClick={() => navigator.clipboard.writeText(generatedOutput)}
                    className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
                   >
                     Copy to Clipboard
                   </button>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-sm whitespace-pre-wrap text-slate-800 dark:text-slate-200 transition-colors">
                  {generatedOutput}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 p-8 transition-colors">
            <span className="text-4xl mb-4">📄</span>
            <p>Select a tool from the left to start generating documents.</p>
          </div>
        )}
      </div>
    </div>
  );
};