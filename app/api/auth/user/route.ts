import { NextRequest, NextResponse } from 'next/server';

// Mark this route as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get the current user from backend
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    
    // Get all cookies from the request
    const cookieHeader = request.headers.get('cookie') || '';
    console.log('User API - Forwarding cookies to Laravel:', cookieHeader);
    
    // Forward the request to the Laravel backend
    const response = await fetch(`${API_URL}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Forward cookies for session-based auth
        'Cookie': cookieHeader,
        // Forward any authorization headers
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')!
        })
      },
      credentials: 'include'
    });    if (!response.ok) {
      console.log('Laravel user API response not OK:', response.status, response.statusText);
      return NextResponse.json({
        success: false,
        user: null,
        isAuthenticated: false
      }, { status: response.status });
    }

    const userData = await response.json() as any;
    console.log('Laravel user API response:', userData);
    
    // Check if we have proper user data
    if (userData && (userData.id || userData.user)) {
      const userInfo = userData.user || userData;
      return NextResponse.json({
        success: true,
        user: userInfo,
        isAuthenticated: true
      });
    } else {
      return NextResponse.json({
        success: false,
        user: null,
        isAuthenticated: false
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth user error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      user: null,
      isAuthenticated: false
    }, { status: 500 });
  }
}
