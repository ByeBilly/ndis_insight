import React, { useState, useEffect } from 'react';
import { ModelConfig, AIProvider, UserModelPreferences } from '../types';
import { ModelRouter } from '../services/modelRouter';

interface SettingsPaneProps {
  userId: string;
  onConfigChange: () => void;
}

export const SettingsPane: React.FC<SettingsPaneProps> = ({ userId, onConfigChange }) => {
  const router = ModelRouter.getInstance();
  const [prefs, setPrefs] = useState<UserModelPreferences>(router.getUserPreferences(userId));
  const [availableModels, setAvailableModels] = useState<ModelConfig[]>(router.getAvailableModels(userId));
  
  // UI State
  const [mode, setMode] = useState<'default' | 'custom'>('default');
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [validationMsg, setValidationMsg] = useState('');

  // Custom Model Form State
  const [customConfig, setCustomConfig] = useState<Partial<ModelConfig>>({
    provider: 'openai_compatible',
    contextWindow: 4096,
    modelId: '',
    name: '',
    endpoint: '',
    defaultTemperature: 0.7,
    maxOutputTokens: 2048,
    apiKey: ''
  });

  useEffect(() => {
    const currentPrefs = router.getUserPreferences(userId);
    const models = router.getAvailableModels(userId);
    setPrefs(currentPrefs);
    setAvailableModels(models);

    // Determine initial mode based on current selection
    const currentModel = models.find(m => m.id === currentPrefs.selectedModelId);
    if (currentModel && !currentModel.isSystemDefault) {
      setMode('custom');
      // Pre-fill form if editing (simplified: just pre-fill with the first custom model found if any)
      setCustomConfig(currentModel);
    } else {
      setMode('default');
    }
  }, [userId]);

  const handleModeChange = (newMode: 'default' | 'custom') => {
    setMode(newMode);
    setTestResult(null);
    if (newMode === 'default') {
      handleRestoreDefault();
    }
  };

  const handleRestoreDefault = () => {
    router.restoreDefaultModel(userId);
    setPrefs(router.getUserPreferences(userId));
    onConfigChange();
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    if (mode === 'custom') {
      if (!customConfig.modelId || (!customConfig.endpoint && customConfig.provider === 'openai_compatible')) {
        setValidationMsg('Please fill in Model ID and Endpoint.');
        return;
      }
    }
    
    setIsTesting(true);
    setValidationMsg('');
    setTestResult(null);

    // Construct a temporary config for testing (don't save yet)
    const configToTest: ModelConfig = mode === 'custom' ? {
      ...customConfig,
      id: 'temp_test',
      isSystemDefault: false,
      isOfficial: false
    } as ModelConfig : availableModels.find(m => m.isSystemDefault)!;

    const result = await router.testModelConnection(configToTest);
    setTestResult(result);
    setIsTesting(false);
  };

  const handleSaveAndSelect = () => {
    if (mode === 'custom') {
      if (!customConfig.name || !customConfig.modelId) {
        setValidationMsg('Name and Model ID are required.');
        return;
      }

      // Save the custom model
      const newModel: ModelConfig = {
        ...customConfig,
        id: customConfig.id || `custom_${Date.now()}`, // Preserve ID if editing
        isSystemDefault: false,
        isOfficial: false,
      } as ModelConfig;

      router.saveUserCustomModel(userId, newModel);
      router.updateUserPreferences(userId, { selectedModelId: newModel.id });
    } else {
      router.restoreDefaultModel(userId);
    }

    onConfigChange();
    setPrefs(router.getUserPreferences(userId));
    setAvailableModels(router.getAvailableModels(userId));
    alert("Model Configuration Saved & Activated");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* 1. Main Selector Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">AI Engine Selection</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Choose which Artificial Intelligence processes your NDIS data.</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleModeChange('default')}
            className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all text-left ${
              mode === 'default' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center ${
              mode === 'default' ? 'border-blue-600' : 'border-slate-400 dark:border-slate-500'
            }`}>
              {mode === 'default' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
            </div>
            <div>
              <span className="block font-bold text-slate-800 dark:text-slate-100">NDIS Insight Default</span>
              <span className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official, verified setup using Gemini 2.5 Flash. Optimized for compliance and reasoning.
              </span>
            </div>
          </button>

          <button
             onClick={() => handleModeChange('custom')}
             className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all text-left ${
              mode === 'custom' 
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center ${
              mode === 'custom' ? 'border-purple-600' : 'border-slate-400 dark:border-slate-500'
            }`}>
              {mode === 'custom' && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
            </div>
             <div>
              <span className="block font-bold text-slate-800 dark:text-slate-100">Bring Your Own Model</span>
              <span className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Connect to a local LLM (Ollama), private endpoint, or a specific API key for full control.
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Configuration Form (Only for Custom) */}
      {mode === 'custom' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 animate-fade-in transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Custom Model Configuration</h3>
            <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500 dark:text-slate-300">PROVIDER CONFIG</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Left Col: Basics */}
             <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Model Label</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="e.g. My Local Llama 3"
                    value={customConfig.name}
                    onChange={e => setCustomConfig({...customConfig, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Provider Type</label>
                  <select 
                    className="w-full border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    value={customConfig.provider}
                    onChange={e => setCustomConfig({...customConfig, provider: e.target.value as any})}
                  >
                    <option value="openai_compatible">OpenAI Compatible / Local (Ollama/vLLM)</option>
                    <option value="gemini">Google Gemini (Private Key)</option>
                  </select>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Model ID</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-sm font-mono bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="e.g. llama3, gpt-4-turbo"
                    value={customConfig.modelId}
                    onChange={e => setCustomConfig({...customConfig, modelId: e.target.value})}
                  />
                </div>
             </div>

             {/* Right Col: Technical */}
             <div className="space-y-4">
                {customConfig.provider === 'openai_compatible' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Endpoint URL</label>
                    <input 
                      type="text" 
                      className="w-full border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-sm font-mono bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="http://localhost:11434/v1"
                      value={customConfig.endpoint}
                      onChange={e => setCustomConfig({...customConfig, endpoint: e.target.value})}
                    />
                  </div>
                )}
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">API Key</label>
                    <input 
                      type="password" 
                      className="w-full border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-sm font-mono bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="sk-..."
                      value={customConfig.apiKey}
                      onChange={e => setCustomConfig({...customConfig, apiKey: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Temperature</label>
                      <input 
                        type="number" step="0.1" min="0" max="2"
                        className="w-full border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        value={customConfig.defaultTemperature}
                        onChange={e => setCustomConfig({...customConfig, defaultTemperature: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Tokens</label>
                      <input 
                        type="number" step="128"
                        className="w-full border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        value={customConfig.maxOutputTokens}
                        onChange={e => setCustomConfig({...customConfig, maxOutputTokens: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
             </div>
          </div>
        </div>
      )}

      {/* 3. Actions Bar */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
        
        {/* Validation Message */}
        <div className="flex-1">
          {validationMsg && <p className="text-red-600 dark:text-red-400 text-sm font-medium">{validationMsg}</p>}
          {testResult && (
            <div className={`text-sm font-medium px-3 py-2 rounded border inline-flex items-center gap-2 ${
              testResult.success 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
            }`}>
              <span>{testResult.success ? '✓' : '✗'}</span>
              {testResult.success ? 'Connection Successful' : 'Connection Failed'}
              <span className="text-xs opacity-75 font-normal ml-1">({testResult.message.substring(0, 50)}...)</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            {isTesting ? 'Testing...' : 'Test Connection'}
          </button>
          
          {mode === 'custom' && (
             <button 
              onClick={handleRestoreDefault}
              className="px-4 py-2 text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200 text-sm transition-colors"
            >
              Cancel & Restore Default
            </button>
          )}

          <button 
            onClick={handleSaveAndSelect}
            className={`px-6 py-2 text-white font-bold rounded-lg shadow-sm transition-colors ${
              mode === 'default' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {mode === 'default' ? 'Confirm Default Model' : 'Save & Select Model'}
          </button>
        </div>
      </div>
    </div>
  );
};