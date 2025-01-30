import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { epicClient } from '@/lib/epic-client';
import { Loader2 } from 'lucide-react';

export default function EpicCallback() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Exchange the code for tokens
        const response = await fetch(`${epicClient.getBaseUrl()}/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: `${window.location.origin}/epic-callback`,
            client_id: 'sandbox-client',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to exchange authorization code');
        }

        // Redirect back to documents page
        setLocation('/documents');
      } catch (err) {
        console.error('EPIC auth error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    handleCallback();
  }, [setLocation]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-xl font-semibold text-red-500 mb-4">
          Error Connecting to EPIC
        </h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => setLocation('/documents')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Documents
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <p className="mt-4 text-gray-600">Connecting to EPIC...</p>
    </div>
  );
}