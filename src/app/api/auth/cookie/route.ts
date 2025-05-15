import { NextRequest, NextResponse } from 'next/server';

// Configure cookie options for security
const COOKIE_NAME = 'auth_token';
const ROLE_COOKIE_NAME = 'userRole';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, token, role } = body;
    const response = NextResponse.json({ success: true });
    
    if (action === 'set' && token) {
      // Set secure HTTP-only cookie
      response.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: COOKIE_MAX_AGE,
        path: '/',
        sameSite: 'strict',
      });

      // Set user role cookie if provided
      if (role) {
        response.cookies.set({
          name: ROLE_COOKIE_NAME,
          value: role,
          httpOnly: false, // Allow JS to read this
          secure: process.env.NODE_ENV === 'production',
          maxAge: COOKIE_MAX_AGE,
          path: '/',
          sameSite: 'strict',
        });
      }

      return response;
    } 
    
    if (action === 'clear') {
      // Clear the cookies
      response.cookies.delete(COOKIE_NAME);
      response.cookies.delete(ROLE_COOKIE_NAME);
      return response;
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Cookie API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 