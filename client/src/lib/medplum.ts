import { MedplumClient } from '@medplum/core';

export const medplum = new MedplumClient({
  baseUrl: process.env.VITE_MEDPLUM_URL || 'https://api.medplum.com/',
  clientId: process.env.VITE_MEDPLUM_CLIENT_ID,
  onUnauthenticated: () => {
    console.error('Medplum authentication failed');
  },
});

export async function initializeMedplum() {
  try {
    await medplum.startClientLogin(
      process.env.VITE_MEDPLUM_CLIENT_ID as string,
      process.env.VITE_MEDPLUM_CLIENT_SECRET as string
    );
    return true;
  } catch (error) {
    console.error('Failed to initialize Medplum:', error);
    return false;
  }
}
