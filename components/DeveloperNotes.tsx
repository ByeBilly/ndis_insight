import React, { useState } from 'react';

const NotePage: React.FC<{ title: string, content: React.ReactNode, active: boolean, onClick: () => void }> = ({ title, content, active, onClick }) => (
    <div className={`border-b border-slate-200 dark:border-slate-700 last:border-0`}>
        <button 
            onClick={onClick}
            className={`w-full text-left p-4 flex justify-between items-center transition-colors ${
                active 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
        >
            <span className="font-semibold text-lg">{title}</span>
            <span>{active ? '−' : '+'}</span>
        </button>
        {active && (
            <div className="p-6 bg-white dark:bg-slate-800 animate-fade-in text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed transition-colors">
                {content}
            </div>
        )}
    </div>
);

export const DeveloperNotes: React.FC = () => {
    const [openPhase, setOpenPhase] = useState<number | null>(7);

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                <div className="p-6 bg-slate-900 dark:bg-slate-950 text-white border-b border-slate-800 dark:border-slate-900">
                    <h1 className="text-2xl font-bold mb-2">Developer Notes & Transparency Log</h1>
                    <p className="text-slate-300">
                        A behind-the-scenes look at how NDIS Insight is built. 
                        Designed for transparency, trust, and user control.
                    </p>
                </div>

                <NotePage 
                    title="Phase 1: Architecture & Foundation" 
                    active={openPhase === 1}
                    onClick={() => setOpenPhase(openPhase === 1 ? null : 1)}
                    content={<>We established the blueprint. Key decision: The app must be "Model Agnostic" (can use any AI engine) and "NDIS-First" (official docs override AI creativity).</>}
                />

                <NotePage 
                    title="Phase 2: The Model Engine Room" 
                    active={openPhase === 2}
                    onClick={() => setOpenPhase(openPhase === 2 ? null : 2)}
                    content={<>We built the backend "Model Router". It handles traffic control, securely managing your API keys and automatically switching to a backup model if your custom one fails.</>}
                />

                <NotePage 
                    title="Phase 3: The Dashboard" 
                    active={openPhase === 3}
                    onClick={() => setOpenPhase(openPhase === 3 ? null : 3)}
                    content={<>We built the Settings UI. You can now verify connections with a "Test" button. Transparency feature: We show you exactly where your data is going.</>}
                />

                <NotePage 
                    title="Phase 4: The Ingestion Engine & Data Sources" 
                    active={openPhase === 4}
                    onClick={() => setOpenPhase(openPhase === 4 ? null : 4)}
                    content={
                        <>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Where does the data come from?</h3>
                            <p>
                                The <strong>Weekly Updater</strong> is designed to scrape official Australian Government websites. We do not use third-party summaries. We go to the source.
                            </p>
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li><strong>Pricing:</strong> ndis.gov.au/providers/pricing-arrangements</li>
                                <li><strong>Guidelines:</strong> ndis.gov.au/about-us/operational-guidelines</li>
                            </ul>
                            <p className="mt-2">
                                Because NDIS rules change frequently, static AI models (like ChatGPT) are often outdated. Our system solves this by injecting fresh data every week.
                            </p>
                            <div className="bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-3 rounded mt-2 text-sm border border-green-200 dark:border-green-800">
                                <strong>Safety Note:</strong> You can view the "Knowledge Base" tab to see exactly which version of the documents the AI is reading.
                            </div>
                        </>
                    }
                />

                <NotePage 
                    title="Phase 5: The Orchestrator" 
                    active={openPhase === 5}
                    onClick={() => setOpenPhase(openPhase === 5 ? null : 5)}
                    content={
                        <>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">What we built</h3>
                            <p>
                                The <strong>Orchestrator</strong> is the "Manager" of the AI. Before your question reaches the AI model, the Orchestrator:
                                <ul className="list-disc ml-6 mt-1">
                                    <li>Retrieves relevant NDIS documents (RAG).</li>
                                    <li>Attaches safety instructions ("Do not promise funding").</li>
                                    <li>Selects the best "Mode" (e.g., Explainer vs Letter Writer).</li>
                                </ul>
                            </p>
                        </>
                    }
                />

                <NotePage 
                    title="Phase 6: User Tools" 
                    active={openPhase === 6}
                    onClick={() => setOpenPhase(openPhase === 6 ? null : 6)}
                    content={
                        <>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">What we built</h3>
                            <p>
                                We added the <strong>Document Generator</strong>. Instead of just chatting, you can now fill out structured forms to generate specific compliance documents like Support Logs and Provider Letters.
                            </p>
                        </>
                    }
                />

                <NotePage 
                    title="Phase 7: Production Integration" 
                    active={openPhase === 7}
                    onClick={() => setOpenPhase(openPhase === 7 ? null : 7)}
                    content={
                        <>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Mission Complete</h3>
                            <p>
                                We have integrated all subsystems into a single, cohesive application. 
                                The system is now <strong>Model Agnostic</strong>, <strong>Self-Updating</strong>, and <strong>Safety-First</strong>.
                            </p>
                            <h4 className="font-bold mt-4">System Health Check:</h4>
                            <ul className="list-disc ml-6 space-y-1 text-sm font-mono bg-slate-100 dark:bg-slate-900 p-3 rounded">
                                <li className="text-green-600 dark:text-green-400">✓ Model Router: Active</li>
                                <li className="text-green-600 dark:text-green-400">✓ Orchestrator: Active</li>
                                <li className="text-green-600 dark:text-green-400">✓ Weekly Updater: Standby</li>
                                <li className="text-green-600 dark:text-green-400">✓ Safety Fallback: Armed</li>
                            </ul>
                        </>
                    }
                />
            </div>
        </div>
    );
};