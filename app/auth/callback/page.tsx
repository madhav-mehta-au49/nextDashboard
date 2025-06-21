"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storeUserAuth } from '@/app/utils/auth';

export default function AuthCallbackPage() {
  const router = useRouter();  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('OAuth callback page - checking authentication...');
        
        // Log all cookies for debugging
        console.log('All cookies:', document.cookie);
        
        // Check for our unencrypted authentication cookies
        const hasAuthStatus = document.cookie.includes('auth_status=authenticated');
        const authUserRoleMatch = document.cookie.match(/auth_user_role=([^;]+)/);
        const authUserNameMatch = document.cookie.match(/auth_user_name=([^;]+)/);
        const authUserEmailMatch = document.cookie.match(/auth_user_email=([^;]+)/);
        const authUserIdMatch = document.cookie.match(/auth_user_id=([^;]+)/);
        
        console.log('Cookie check results:', { 
          hasAuthStatus, 
          authUserRoleMatch: !!authUserRoleMatch,
          authUserNameMatch: !!authUserNameMatch,
          authUserEmailMatch: !!authUserEmailMatch,
          authUserIdMatch: !!authUserIdMatch
        });
        
        if (hasAuthStatus && authUserRoleMatch) {
          console.log('Found unencrypted OAuth authentication cookies');
          
          // Extract user data from unencrypted cookies
          const role = authUserRoleMatch[1];
          const name = authUserNameMatch ? decodeURIComponent(authUserNameMatch[1]) : 'User';
          const email = authUserEmailMatch ? authUserEmailMatch[1] : '';
          const userId = authUserIdMatch ? authUserIdMatch[1] : email;
          
          // Store authentication state using our auth utilities
          storeUserAuth({
            id: userId || email || 'oauth_user',
            name: name,
            role: role
          });
          
          console.log('OAuth authentication state stored successfully from unencrypted cookies');
          
          // Redirect to home page after successful authentication
          setTimeout(() => {
            window.location.href = '/';
          }, 500);
          return;
        }
        
        // Check URL parameters as fallback
        console.log('Checking URL parameters as fallback');
        const urlParams = new URLSearchParams(window.location.search);
        const authStatus = urlParams.get('auth_status');
        const userRole = urlParams.get('auth_user_role');
        const userName = urlParams.get('auth_user_name');
        const userId = urlParams.get('auth_user_id');
        
        if (authStatus === 'authenticated' && userRole) {
          console.log('Found authentication data in URL parameters');
          
          // Store authentication state from URL parameters
          storeUserAuth({
            id: userId || 'oauth_user',
            name: userName || 'User',
            role: userRole
          });
          
          console.log('OAuth authentication state stored successfully from URL parameters');
          
          // Redirect to home page after successful authentication
          setTimeout(() => {
            window.location.href = '/';
          }, 500);
          return;
        }
        
        // Fallback: Try to get user data from Laravel API
        console.log('No auth cookies found, attempting to fetch user data from Laravel...');
        const response = await fetch('/api/auth/user', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        });
          console.log('Laravel response status:', response.status);
        
        if (response.ok) {
          const userData = await response.json() as any;
          console.log('OAuth callback - user data from API:', userData);
          
          if (userData.success && userData.user) {
            // Store authentication state using our auth utilities
            storeUserAuth({
              id: userData.user.id,
              name: userData.user.name,
              role: userData.user.role
            });
            
            console.log('OAuth authentication state stored successfully from API');
            
            // Redirect to home page after successful authentication
            setTimeout(() => {
              window.location.href = '/';
            }, 500);
            return;
          }
        } else {
          console.log('Laravel response not OK, status:', response.status);
          if (response.status !== 401) {
            const errorText = await response.text();
            console.log('Laravel response body:', errorText);
          }
        }
        
        // If authentication failed, redirect to login
        console.log('OAuth authentication failed, redirecting to login');
        console.log('Checking document URL for error params:', window.location.href);
        
        // Try to extract error from URL query parameters if any
        const searchParams = new URLSearchParams(window.location.search);
        const errorParam = searchParams.get('error');
        
        if (errorParam) {
          console.log('Error parameter found in URL:', errorParam);
          setTimeout(() => {
            router.push(`/login?error=${errorParam}`);
          }, 2000);
        } else {
          setTimeout(() => {
            router.push('/login?error=oauth_failed');
          }, 2000);
        }
        
      } catch (error) {
        console.error('OAuth callback error:', error);
        setTimeout(() => {
          router.push('/login?error=oauth_error');
        }, 2000);
      }
    };
    
    // Add a delay to ensure cookies are set before checking
    const timeoutId = setTimeout(handleAuthCallback, 2000);
    return () => clearTimeout(timeoutId);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}