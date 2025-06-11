'use client';

import { useState, useEffect } from 'react';

export default function DebugCookiesPage() {
  const [cookies, setCookies] = useState<string>('');
  const [localStorage, setLocalStorage] = useState<any>({});

  useEffect(() => {
    // Get cookies
    setCookies(document.cookie);
    
    // Get localStorage
    const localStorageData: any = {};
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) {
        localStorageData[key] = window.localStorage.getItem(key);
      }
    }
    setLocalStorage(localStorageData);
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Debug: Cookies & Storage</h1>
      
      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Cookies</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
            {cookies || 'No cookies found'}
          </pre>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Local Storage</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
            {JSON.stringify(localStorage, null, 2) || 'No localStorage data'}
          </pre>
        </div>
      </div>
    </div>
  );
}