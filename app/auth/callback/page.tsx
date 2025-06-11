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
        console.log('All cookies:', document.cookie);        // Check for Laravel encrypted authentication cookies
        const hasAuthCookies = document.cookie.includes('isAuthenticated=');
        const hasUserRole = document.cookie.includes('userRole=');
        const hasUserName = document.cookie.includes('userName=');
        
        // Check for our new unencrypted authentication cookies
        const hasAuthStatus = document.cookie.includes('auth_status=authenticated');
        const authUserRoleMatch = document.cookie.match(/auth_user_role=([^;]+)/);
        const authUserNameMatch = document.cookie.match(/auth_user_name=([^;]+)/);
        const authUserEmailMatch = document.cookie.match(/auth_user_email=([^;]+)/);
        
        console.log('Cookie check results:', { 
          hasAuthCookies, hasUserRole, hasUserName,
          hasAuthStatus, 
          authUserRoleMatch: !!authUserRoleMatch,
          authUserNameMatch: !!authUserNameMatch 
        });
        
        if (hasAuthStatus && authUserRoleMatch) {
          console.log('Found unencrypted OAuth authentication cookies');
          
          // Extract user data from unencrypted cookies
          const role = authUserRoleMatch[1];
          const name = authUserNameMatch ? decodeURIComponent(authUserNameMatch[1]) : 'User';
          const email = authUserEmailMatch ? authUserEmailMatch[1] : '';
          
          // Store authentication state using our auth utilities
          storeUserAuth({
            id: email || 'oauth_user',
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
        
        if (hasAuthCookies && hasUserRole) {
          console.log('Found encrypted OAuth authentication cookies, will use API fallback');
          // Since Laravel cookies are encrypted, we can't read them directly
          // Fall through to the API approach
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
        setTimeout(() => {
          router.push('/login?error=oauth_failed');
        }, 2000);
        
      } catch (error) {
        console.error('OAuth callback error:', error);
        setTimeout(() => {
          router.push('/login?error=oauth_error');
        }, 2000);
      }
    };
    
    // Add a delay to ensure cookies are set before checking
    const timeoutId = setTimeout(handleAuthCallback, 1000);
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