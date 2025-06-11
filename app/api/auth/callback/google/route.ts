import { NextRequest, NextResponse } from 'next/server';

// Mark this route as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

interface OAuthState {
  role?: string;
  redirect?: string;
  nonce?: string;
}

/**
 * Google OAuth callback handler
 * This endpoint receives the authorization code from Google after user authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Get the authorization code and state from the URL query parameters
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');
    
    // Debug log the parameters
    console.log('Google OAuth callback received:', {
      code: code ? `${code.substring(0, 10)}...` : null,
      error,
      state,
      url: request.url
    });
    
    // Handle authentication errors
    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(new URL('/login?error=google_auth_failed', request.url));
    }
    
    if (!code) {
      console.error('No authorization code received from Google');
      return NextResponse.redirect(new URL('/login?error=no_code', request.url));
    }
      // Parse state parameter
    let role = 'candidate';
    let redirect = '/'; // Always redirect to home page
    let encodedState = state;
    
    if (state) {
      try {
        const stateData = JSON.parse(atob(state)) as OAuthState;
        console.log('Decoded state data:', stateData);
        
        if (stateData.role) {
          role = stateData.role;
        }
        // Always redirect to home page regardless of stored redirect
        redirect = '/';
        
        // Ensure we pass the role properly in the state
        encodedState = btoa(JSON.stringify({ role, redirect }));
      } catch (e) {
        console.error('Error parsing state:', e);
        // If we can't parse the state, create a new one with default role
        encodedState = btoa(JSON.stringify({ role, redirect }));
      }
    } else {
      // If no state is provided, create one with default role
      encodedState = btoa(JSON.stringify({ role, redirect }));
    }
    
    // Forward the authorization code to your Laravel backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const baseUrl = backendUrl.replace('/api', '');
    
    // Create the redirect URL with code and state
    const redirectUrl = `${baseUrl}/auth/google/callback?code=${code}&state=${encodedState}`;
    console.log('Redirecting to Laravel backend:', redirectUrl);
    
    // Redirect to the Laravel callback endpoint with the code
    // Laravel will handle exchanging the code for tokens and user info
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error('Error in Google callback handler:', error);
    return NextResponse.redirect(new URL('/login?error=callback_error', request.url));
  }
}
