
import { upsertDocument, upsertChunk, getDocuments } from './ragService';
import { IngestionJob, NDISDocument, DocumentChunk } from '../types';

/**
 * PHASE 4: DOCUMENT INGESTION SIMULATOR
 * Simulates a server-side Cron job that scrapes NDIS.gov.au
 */

export class DocumentUpdater {
  private static instance: DocumentUpdater;
  
  // State for the UI to poll
  private currentJob: IngestionJob | null = null;

  private constructor() {}

  public static getInstance(): DocumentUpdater {
    if (!DocumentUpdater.instance) {
      DocumentUpdater.instance = new DocumentUpdater();
    }
    return DocumentUpdater.instance;
  }

  public getJobStatus(): IngestionJob | null {
    return this.currentJob;
  }

  public async startWeeklyUpdate(): Promise<void> {
    if (this.currentJob?.status === 'running') return;

    const jobId = `job_${Date.now()}`;
    this.currentJob = {
      id: jobId,
      status: 'running',
      progress: 0,
      currentStep: 'Initializing...',
      logs: ['Starting weekly NDIS document scan...']
    };

    try {
      // Step 1: Scrape (Simulated delay)
      await this.simulateStep(10, 'Connecting to ndis.gov.au...', 'Connected securely.');
      await this.simulateStep(30, 'Scanning for new PDFs...', 'Found 1 new document: "NDIS_Bereavement_Addendum_2025.pdf"');

      // Step 2: Parse & Diff
      await this.simulateStep(50, 'Parsing PDF content...', 'Extracted 2,400 words.');
      await this.simulateStep(60, 'Comparing against Knowledge Base...', 'Detected changes in section: "Claiming for Funeral Costs".');

      // Step 3: Chunk & Embed
      await this.simulateStep(80, 'Generating Vector Embeddings...', 'Created 5 new vector chunks.');

      // Step 4: Write to DB
      const newDoc: NDISDocument = {
        id: `doc_new_${Date.now()}`,
        title: 'NDIS Bereavement Addendum 2025',
        category: 'guidelines',
        version: 'v1.0-2025',
        lastUpdated: new Date().toISOString().split('T')[0],
        sourceUrl: 'https://ndis.gov.au/bereavement',
        status: 'active'
      };

      upsertDocument(newDoc);
      
      const newChunk: DocumentChunk = {
        id: `chunk_new_${Date.now()}`,
        documentId: newDoc.id,
        pageNumber: 1,
        sectionHeader: 'Key Changes',
        content: 'The NDIS has updated the claiming rules for bereavement support. Providers can now claim for cancellation charges if notice is less than 2 days in this specific circumstance.',
        embedding: []
      };
      
      upsertChunk(newChunk);

      await this.simulateStep(100, 'Finalizing Index...', 'Update Complete.');

      this.currentJob = {
        ...this.currentJob!,
        status: 'success',
        progress: 100,
        currentStep: 'Done',
      };

    } catch (error) {
       this.currentJob = {
        ...this.currentJob!,
        status: 'failed',
        logs: [...this.currentJob!.logs, 'Error: Connection timeout.']
      };
    }
  }

  private async simulateStep(progress: number, stepName: string, logMsg: string) {
    if (!this.currentJob) return;
    
    // Artificial delay for realism
    await new Promise(r => setTimeout(r, 800));

    this.currentJob = {
      ...this.currentJob,
      progress,
      currentStep: stepName,
      logs: [...this.currentJob.logs, `[${new Date().toLocaleTimeString()}] ${logMsg}`]
    };
  }
}
