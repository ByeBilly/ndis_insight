import React, { useState, useEffect } from 'react';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { PrototypeChat } from './components/PrototypeChat';
import { SettingsPane } from './components/SettingsPane';
import { DeveloperNotes } from './components/DeveloperNotes';
import { KnowledgeBase } from './components/KnowledgeBase';
import { DocumentGenerator } from './components/DocumentGenerator';

const MOCK_USER_ID = 'u_123';

export default function App() {
  const [activeTab, setActiveTab] = useState<'arch' | 'chat' | 'tools' | 'knowledge' | 'settings' | 'dev'>('chat');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // We use a refresh key to force re-render components when settings change in the backend simulation
  const [configRefreshKey, setConfigRefreshKey] = useState(0);

  const triggerConfigRefresh = () => setConfigRefreshKey(prev => prev + 1);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Navigation Bar */}
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg shadow-blue-500/20 shadow-lg">N</div>
              <span className="font-bold text-xl tracking-tight hidden md:inline text-slate-100">NDIS Insight</span>
              <span className="font-bold text-xl tracking-tight md:hidden text-slate-100">NDIS</span>
              <span className="text-xs bg-green-600 px-2 py-0.5 rounded text-white ml-2 font-mono shadow-sm">v1.0</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex space-x-1 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
                <NavButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} label="Assistant" />
                <NavButton active={activeTab === 'tools'} onClick={() => setActiveTab('tools')} label="Tools" />
                <NavButton active={activeTab === 'knowledge'} onClick={() => setActiveTab('knowledge')} label="Knowledge" />
                <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} label="Engine" />
                <NavButton active={activeTab === 'dev'} onClick={() => setActiveTab('dev')} label="Dev" />
              </div>

              {/* Dark Mode Toggle */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-yellow-400 transition-colors"
                title="Toggle Dark Mode"
              >
                {isDarkMode ? (
                  /* Sun Icon */
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  /* Moon Icon */
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          {activeTab === 'arch' && (
            <div className="animate-fade-in">
              <ArchitectureDiagram />
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
              <div className="lg:col-span-1 space-y-4">
                 <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">System Status</h3>
                    <div className="text-xs space-y-2">
                       <div className="flex justify-between">
                         <span className="text-slate-500 dark:text-slate-400">Orchestrator:</span>
                         <span className="text-green-600 dark:text-green-400 font-bold">ONLINE</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-slate-500 dark:text-slate-400">Knowledge Base:</span>
                         <span className="text-green-600 dark:text-green-400 font-bold">SYNCED</span>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="lg:col-span-3">
                <PrototypeChat key={configRefreshKey} userId={MOCK_USER_ID} />
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Compliance Tools</h1>
                <p className="text-slate-600 dark:text-slate-400">Draft formal documents grounded in NDIS legislation.</p>
              </div>
              <DocumentGenerator userId={MOCK_USER_ID} />
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Knowledge Base</h1>
                <p className="text-slate-600 dark:text-slate-400">Manage ingestion, versioning, and document sources.</p>
              </div>
              <KnowledgeBase />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <SettingsPane userId={MOCK_USER_ID} onConfigChange={triggerConfigRefresh} />
            </div>
          )}

          {activeTab === 'dev' && (
             <div className="animate-fade-in">
                <DeveloperNotes />
             </div>
          )}

        </div>
      </main>
    </div>
  );
}

const NavButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${
      active ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {label}
  </button>
);