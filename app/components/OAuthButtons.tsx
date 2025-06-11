'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin } from 'react-icons/fa';

interface OAuthButtonsProps {
  role?: string;
  layout?: 'horizontal' | 'vertical';
  onBeforeRedirect?: () => void;
}

export default function OAuthButtons({
  role = 'candidate',
  layout = 'horizontal',
  onBeforeRedirect
}: OAuthButtonsProps) {
  const router = useRouter();

  // Check for OAuth callback errors on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get('error');
    if (error) {
      console.error('OAuth error:', error);
      // You could show an error message here
    }
  }, []);
  const handleSocialAuth = (provider: 'google' | 'linkedin') => {
    if (onBeforeRedirect) {
      onBeforeRedirect();
    }
    
    // Construct the OAuth URL with role parameter
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const baseUrl = apiUrl.replace('/api', '');
    
    // Always redirect to home page after OAuth login
    const state = btoa(JSON.stringify({ 
      role: role || 'candidate',
      redirect: '/' // Always redirect to home page
    }));
    
    // Pass the role and state in query parameters
    const redirectUrl = `${baseUrl}/auth/${provider}?state=${encodeURIComponent(state)}`;
    
    console.log(`Redirecting to ${provider} OAuth:`, { 
      url: redirectUrl,
      role,
      redirect: '/'
    });
    
    window.location.href = redirectUrl;
  };

  const buttonClasses = "flex items-center justify-center border p-3 rounded-lg hover:bg-gray-50 transition";
  const containerClasses = layout === 'vertical' ? 'flex flex-col gap-3' : 'flex gap-3';

  return (
    <div className={containerClasses}>
      <button 
        type="button" 
        onClick={() => handleSocialAuth('google')} 
        className={buttonClasses}
        aria-label="Sign in with Google"
      >
        <FcGoogle className="text-xl" />
        <span className="ml-2">Continue with Google</span>
      </button>
      <button 
        type="button" 
        onClick={() => handleSocialAuth('linkedin')} 
        className={buttonClasses}
        aria-label="Sign in with LinkedIn"
      >
        <FaLinkedin className="text-xl text-[#0077B5]" />
        <span className="ml-2">Continue with LinkedIn</span>
      </button>
    </div>
  );
}