'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserAuth } from '../../../utils/auth';

export default function EditCandidatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const auth = await getUserAuth();
        if (!auth.isAuthenticated) {
          router.push('/login');
          return;
        }
        if (auth.user?.role !== 'candidate') {
          router.push('/');
          return;
        }
        setUser(auth.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirecting
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Candidate Profile</h1>
      
      <div className="max-w-2xl">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input 
                type="text" 
                defaultValue={user.name || ''} 
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                defaultValue={user.email || ''} 
                className="w-full border rounded-lg px-3 py-2"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea 
                rows={4}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Tell us about yourself..."
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Save Changes
              </button>
              <button 
                onClick={() => router.back()}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}