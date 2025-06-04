import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the current user from backend
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    
    // Forward the request to the Laravel backend
    const response = await fetch(`${API_URL}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Forward any authorization headers
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')!
        }),
        // Forward cookies for session-based auth
        ...(request.headers.get('cookie') && {
          'Cookie': request.headers.get('cookie')!
        })
      },
      credentials: 'include'
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        user: null,
        isAuthenticated: false
      }, { status: response.status });
    }

    const userData = await response.json();
    
    return NextResponse.json({
      success: true,
      user: userData,
      isAuthenticated: true
    });
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
