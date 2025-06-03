'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearUserAuth } from '@/app/utils/auth';

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear all authentication data
    clearUserAuth();
    
    // Show a message (optional)
    console.log('Successfully signed out');
    
    // Redirect to home page after a slight delay
    const redirectTimeout = setTimeout(() => {
      router.push('/');
    }, 500);
    
    return () => clearTimeout(redirectTimeout);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10 text-teal-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Signing Out</h1>
        <p className="text-gray-600 mb-8">Please wait while we sign you out...</p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      </div>
    </div>
  );
}