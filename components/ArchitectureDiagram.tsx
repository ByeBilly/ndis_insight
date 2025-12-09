import React from 'react';

const Block = ({ title, items, color }: { title: string, items: string[], color: string }) => (
  <div className={`p-4 rounded-lg border-l-4 ${color} bg-white dark:bg-slate-800 shadow-sm mb-4 transition-colors`}>
    <h3 className="font-bold text-gray-800 dark:text-slate-100 mb-2">{title}</h3>
    <ul className="text-sm text-gray-600 dark:text-slate-400 space-y-1">
      {items.map((item, i) => <li key={i}>• {item}</li>)}
    </ul>
  </div>
);

const Arrow = () => (
  <div className="flex justify-center my-2">
    <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  </div>
);

export const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-slate-100 border-b dark:border-slate-700 pb-2">Phase 1: System Architecture Specification</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Frontend Layer */}
        <div className="col-span-1">
          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">Frontend Layer (Client)</h3>
          <Block 
            title="React SPA" 
            color="border-blue-500"
            items={['Mental Health Friendly UX', 'Settings (Model Config)', 'Chat Interface']} 
          />
          <Block 
            title="Local State" 
            color="border-blue-400"
            items={['User Preferences', 'Session History', 'API Keys (Encrypted in LocalStorage for Phase 1)']} 
          />
        </div>

        {/* Orchestrator Layer */}
        <div className="col-span-1">
          <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-4">Orchestrator Layer (API)</h3>
          <Block 
            title="Model Router (Abstraction)" 
            color="border-purple-500"
            items={['enforce(NDIS Rules)', 'switch(Provider)', 'Log Compliance']} 
          />
           <Arrow />
           <Block 
            title="RAG Controller" 
            color="border-purple-400"
            items={['Query Analysis', 'Context Retrieval', 'Prompt Engineering']} 
          />
        </div>

        {/* Data & Model Layer */}
        <div className="col-span-1">
          <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4">Data & Infrastructure</h3>
          <Block 
            title="Weekly Updater Service" 
            color="border-green-500"
            items={['Scrape NDIS.gov.au', 'Parse PDF/DOCX', 'Chunking Strategy', 'Update Vector Index']} 
          />
          <Block 
            title="Database" 
            color="border-green-600"
            items={['Users & Logs (PostgreSQL)', 'Vector Store (pgvector)', 'Document Metadata']} 
          />
           <Block 
            title="External AI Providers" 
            color="border-gray-500"
            items={['Gemini (Default)', 'OpenAI (Optional)', 'Local LLM (BYO)']} 
          />
        </div>
      </div>

      <div className="bg-slate-800 dark:bg-slate-950 text-slate-200 p-6 rounded-lg font-mono text-sm shadow-inner">
        <h4 className="text-yellow-400 font-bold mb-2">Weekly Updater Workflow (Pseudocode):</h4>
        <pre>{`
cron.schedule('0 0 * * SUN', async () => {
  const docs = await NDISScraper.fetchLatest();
  
  for (const doc of docs) {
    if (doc.version > storedDoc.version) {
      const text = await PDFParser.extract(doc.url);
      const chunks = chunkText(text, 512); // 512 token chunks
      
      await VectorDB.delete({ docId: doc.id });
      await VectorDB.upsert(chunks.map(c => embed(c)));
      
      await ComplianceLog.logSystemUpdate(doc.title);
    }
  }
});
        `}</pre>
      </div>
    </div>
  );
};