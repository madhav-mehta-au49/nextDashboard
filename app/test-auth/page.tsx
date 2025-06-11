'use client';

import { useState, useEffect } from 'react';
import { getUserAuth } from '../utils/auth';

export default function TestAuthPage() {
  const [authData, setAuthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const auth = await getUserAuth();
        setAuthData(auth);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test Auth Status</h1>
      
      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Authentication Data</h2>
          {error ? (
            <div className="text-red-600 p-3 bg-red-50 rounded">
              Error: {error}
            </div>
          ) : (
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {JSON.stringify(authData, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}