
import { NDISDocument, DocumentChunk } from '../types';

/**
 * PHASE 1 & 4: RAG Service (Simulation)
 * Now supports Upserts for the Weekly Updater simulation.
 */

// Mutable in-memory store for Phase 4 simulation
let MOCK_DOCS: NDISDocument[] = [
    {
        id: 'doc_001',
        title: 'NDIS Pricing Arrangements and Price Limits 2024-25',
        category: 'pricing',
        version: 'v1.2',
        lastUpdated: '2024-07-01',
        sourceUrl: 'https://ndis.gov.au/pricing',
        status: 'active'
    },
    {
        id: 'doc_002',
        title: 'Operational Guideline: Access to the NDIS',
        category: 'operational_guideline',
        version: 'v4.0',
        lastUpdated: '2023-11-15',
        sourceUrl: 'https://ndis.gov.au/og/access',
        status: 'active'
    }
];

let MOCK_CHUNKS: DocumentChunk[] = [
    {
        id: 'chunk_1',
        documentId: 'doc_001',
        pageNumber: 15,
        sectionHeader: 'Core Supports',
        content: 'Assistance with Daily Life: These supports provide assistance with everyday needs, including household cleaning and yard maintenance. Price Limit: $65.47/hr for standard intensity.',
        embedding: [] 
    },
    {
        id: 'chunk_2',
        documentId: 'doc_001',
        pageNumber: 18,
        sectionHeader: 'Transport',
        content: 'Participants can use their funding to pay a provider to transport them to an activity. This is not for family transport.',
        embedding: []
    },
    {
        id: 'chunk_3',
        documentId: 'doc_002',
        pageNumber: 4,
        sectionHeader: 'Age Requirements',
        content: 'To access the NDIS, you must be under 65 years of age when you make your access request.',
        embedding: []
    }
];

export const retrieveContext = async (query: string): Promise<string> => {
    // 1. In real app: Generate embedding for query
    // 2. In real app: Vector search DB
    
    // 3. Phase 1 Simulation: Keyword matching
    const lowercaseQuery = query.toLowerCase();
    const relevantChunks = MOCK_CHUNKS.filter(chunk => 
        chunk.content.toLowerCase().includes(lowercaseQuery) ||
        chunk.sectionHeader.toLowerCase().includes(lowercaseQuery) ||
        (lowercaseQuery.includes('price') && chunk.documentId === 'doc_001') // heuristic
    );

    if (relevantChunks.length === 0) {
        return "No specific NDIS documents found for this query. Advise the user to check the portal.";
    }

    // Format for LLM Context Window
    return relevantChunks.map(c => 
        `[Source: ${MOCK_DOCS.find(d => d.id === c.documentId)?.title || 'Unknown'}, Page ${c.pageNumber}]\n${c.content}`
    ).join('\n\n');
};

export const getDocuments = () => MOCK_DOCS;

/**
 * PHASE 4 ADDITION: Write capability for the Updater
 */
export const upsertDocument = (doc: NDISDocument) => {
    const existingIndex = MOCK_DOCS.findIndex(d => d.id === doc.id);
    if (existingIndex >= 0) {
        MOCK_DOCS[existingIndex] = doc;
    } else {
        MOCK_DOCS.push(doc);
    }
};

export const upsertChunk = (chunk: DocumentChunk) => {
    MOCK_CHUNKS.push(chunk);
};

export const getStats = () => ({
    docCount: MOCK_DOCS.length,
    chunkCount: MOCK_CHUNKS.length,
    lastIngest: new Date().toISOString()
});
