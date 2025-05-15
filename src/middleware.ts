import { NextRequest, NextResponse } from 'next/server';

// Define valid roles
type UserRole = 'admin' | 'customer';

// Define which routes require authentication
const authRequiredPaths = [
  '/profile',
  '/bookings',
  '/admin',
  '/transaction',
  '/setting',
  '/booking'      // Add booking to protected routes
];

// Define admin-only routes
const adminOnlyPaths = [
  '/admin'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`Middleware running for path: ${pathname}`);

  // Handle root path - redirect to home
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Check if this is a protected route
  const isAuthRequired = authRequiredPaths.some(path => 
    pathname.startsWith(path)
  );

  // Check if this is an admin-only route
  const isAdminRequired = adminOnlyPaths.some(path => 
    pathname.startsWith(path)
  );

  // Get token from various possible sources
  const authToken = request.cookies.get('auth_token')?.value;
  const token = request.cookies.get('token')?.value || 
                authToken ||
                request.headers.get('Authorization')?.split(' ')[1];
  
  // Get user role and validate it
  const rawRole = request.headers.get('X-User-Role') || 
                 request.cookies.get('userRole')?.value;
  
  // Ensure role is valid
  const userRole: UserRole | undefined = 
    rawRole === 'admin' || rawRole === 'customer' ? rawRole : undefined;
  
  console.log(`Middleware - Auth check:`, {
    token: !!token,
    userRole,
    rawRole,
    path: pathname,
    isAuthRequired,
    isAdminRequired
  });
  
  // If route requires authentication and no token exists, redirect to auth-required
  if (isAuthRequired && !token) {
    console.log('Middleware - Auth required but no token, redirecting to auth-required');
    return NextResponse.redirect(new URL('/auth-required', request.url));
  }
  
  // If route requires admin role and user is not admin, redirect to unauthorized
  if (isAdminRequired && userRole !== 'admin') {
    console.log('Middleware - Admin required but user not admin, redirecting to unauthorized');
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  // If trying to access login/register while already authenticated, redirect appropriately
  if ((pathname === '/login' || pathname === '/register') && token) {
    console.log('Middleware - Already authenticated, redirecting based on role');
    const redirectUrl = userRole === 'admin' ? '/admin/dashboard' : '/home';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Add headers to the response
  const response = NextResponse.next();
  
  // Set the Authorization header if token exists
  if (token) {
    response.headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Set the role header if it exists and is valid
  if (userRole) {
    response.headers.set('X-User-Role', userRole);
  }
  
  return response;
}

// Configure the paths that middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files (files stored in the public folder)
     * - API routes that handle cookies
     */
    '/((?!_next/static|_next/image|favicon.ico|public|images|api/auth/cookie|api).*)',
  ],
}; 