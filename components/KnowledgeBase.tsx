import React, { useState, useEffect } from 'react';
import { getDocuments, getStats } from '../services/ragService';
import { DocumentUpdater } from '../services/documentUpdater';

const OFFICIAL_SOURCES = [
    {
        name: 'NDIS Pricing Arrangements (PB)',
        url: 'https://www.ndis.gov.au/providers/pricing-arrangements',
        description: 'The master price guide for all support items.',
        frequency: 'Monthly'
    },
    {
        name: 'Operational Guidelines (OG)',
        url: 'https://www.ndis.gov.au/about-us/operational-guidelines',
        description: 'Rules on how the NDIA makes decisions (Eligibility, Plans).',
        frequency: 'Ad-hoc'
    },
    {
        name: 'NDIS Legislation (The Act)',
        url: 'https://www.ndis.gov.au/about-us/legislation-rules-and-policies',
        description: 'The underlying laws governing the scheme.',
        frequency: 'Rarely'
    }
];

export const KnowledgeBase: React.FC = () => {
    const updater = DocumentUpdater.getInstance();
    const [docs, setDocs] = useState(getDocuments());
    const [stats, setStats] = useState(getStats());
    const [jobStatus, setJobStatus] = useState(updater.getJobStatus());

    // Polling for the prototype to show progress
    useEffect(() => {
        const interval = setInterval(() => {
            setJobStatus(updater.getJobStatus());
            setDocs([...getDocuments()]); // Force refresh
            setStats(getStats());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleRunUpdate = () => {
        updater.startWeeklyUpdate();
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                    <div className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Active Documents</div>
                    <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stats.docCount}</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                    <div className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Vector Chunks</div>
                    <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stats.chunkCount}</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                    <div className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Last Update Scan</div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-2">{new Date().toLocaleDateString()}</div>
                </div>
            </div>

            {/* Updater Panel */}
            <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-xl overflow-hidden shadow-lg transition-colors">
                <div className="p-6 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="font-bold text-lg">Weekly Ingestion Engine</h3>
                        <p className="text-slate-400 text-sm">Automated pipeline to sync NDIS.gov.au changes.</p>
                    </div>
                    <button 
                        onClick={handleRunUpdate}
                        disabled={jobStatus?.status === 'running'}
                        className={`px-4 py-2 rounded font-bold transition-all w-full sm:w-auto ${
                            jobStatus?.status === 'running' 
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-500 text-white'
                        }`}
                    >
                        {jobStatus?.status === 'running' ? 'Pipeline Running...' : 'Trigger Weekly Update'}
                    </button>
                </div>
                
                {jobStatus && (
                    <div className="p-6 bg-slate-800 dark:bg-slate-900 font-mono text-sm space-y-4 transition-colors">
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-700 dark:bg-slate-700 rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${jobStatus.progress}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>Step: {jobStatus.currentStep}</span>
                            <span>{jobStatus.progress}%</span>
                        </div>
                        
                        {/* Logs */}
                        <div className="h-32 overflow-y-auto bg-slate-900 dark:bg-slate-950 p-4 rounded border border-slate-700 space-y-1 transition-colors">
                            {jobStatus.logs.map((log, i) => (
                                <div key={i} className="text-slate-300">
                                    <span className="text-slate-600 mr-2">{'>'}</span>{log}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Target Data Sources */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                 <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Target Data Sources</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">The scraper is configured to monitor these official domains.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x dark:divide-slate-700">
                    {OFFICIAL_SOURCES.map((source, i) => (
                        <div key={i} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group">
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-2">
                                {source.name}
                                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{source.description}</p>
                            <a 
                                href={source.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline break-all"
                            >
                                {source.url}
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Document Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Knowledge Base Index</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-3 font-medium">Document Title</th>
                                <th className="px-6 py-3 font-medium">Category</th>
                                <th className="px-6 py-3 font-medium">Version</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {docs.map(doc => (
                                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{doc.title}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 capitalize">{doc.category.replace('_', ' ')}</td>
                                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-400">{doc.version}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                            doc.status === 'active' 
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400'
                                        }`}>
                                            {doc.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};