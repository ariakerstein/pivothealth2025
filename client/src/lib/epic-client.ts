import { MedplumClient } from '@medplum/core';

// EPIC FHIR Sandbox API endpoints
const EPIC_FHIR_BASE_URL = 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4';
const EPIC_AUTH_BASE_URL = 'https://fhir.epic.com/interconnect-fhir-oauth/oauth2';

// Initialize Medplum client for EPIC sandbox
export const epicClient = new MedplumClient({
  baseUrl: EPIC_FHIR_BASE_URL,
  tokenUrl: `${EPIC_AUTH_BASE_URL}/token`,
  onUnauthenticated: () => {
    // Redirect to EPIC sandbox login
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: 'sandbox-client', // Using sandbox client ID
      redirect_uri: `${window.location.origin}/epic-callback`,
      scope: 'launch/patient patient/*.read',
      state: crypto.randomUUID(),
      aud: EPIC_FHIR_BASE_URL
    });

    window.location.href = `${EPIC_AUTH_BASE_URL}/authorize?${params}`;
  }
});

// Function to fetch patient documents from EPIC sandbox
export async function fetchEpicDocuments() {
  try {
    // For sandbox testing, use a test patient ID
    const testPatientId = 'Tbt3KuCY0B5PSrJvCu2j-PlK.aiHsu2xUjUM8bWpetXoB'; 

    // Search for DocumentReference resources
    const documents = await epicClient.search('DocumentReference', {
      patient: testPatientId
    });

    return documents.entry?.map(entry => ({
      id: entry.resource.id,
      type: 'epic',
      filename: entry.resource.description || 'Unknown Document',
      contentType: entry.resource.content?.[0]?.attachment?.contentType,
      uploadedAt: entry.resource.date,
      source: 'EPIC Sandbox',
      status: entry.resource.status,
      category: entry.resource.category?.[0]?.coding?.[0]?.display || 'Other'
    })) || [];
  } catch (error) {
    console.error('Error fetching EPIC documents:', error);
    return [];
  }
}

// Function to download a document from EPIC sandbox
export async function downloadEpicDocument(documentId: string): Promise<Blob | null> {
  try {
    const document = await epicClient.readResource('DocumentReference', documentId);
    const attachment = document.content?.[0]?.attachment;

    if (attachment?.url) {
      const response = await epicClient.download(attachment.url);
      return response;
    }
    return null;
  } catch (error) {
    console.error('Error downloading EPIC document:', error);
    return null;
  }
}