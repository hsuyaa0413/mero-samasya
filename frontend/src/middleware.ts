// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define a type for your JWT payload
interface UserJWTPayload {
  id: string;
  role: 'citizen' | 'authority' | 'admin';
}

// Function to get the JWT secret key
const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  // Encode the secret to a Uint8Array, as required by jose
  return new TextEncoder().encode(secret);
};

// Define dashboard paths for each role
const dashboardPaths = {
  citizen: '/user-dashboard',
  authority: '/authority-dashboard',
  admin: '/admin-dashboard',
};

// Define routes that are only accessible to unauthenticated users
const publicOnlyPaths = ['/login', '/role'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('jwt')?.value;

  // --- NEW: Redirect logged-in users from public-only pages ---
  const isAccessingPublicOnlyPath =
    publicOnlyPaths.includes(pathname) || pathname.startsWith('/register/');

  if (isAccessingPublicOnlyPath && token) {
    try {
      // Verify token to confirm user is actually logged in
      const { payload } = await jwtVerify<UserJWTPayload>(
        token,
        getJwtSecretKey()
      );
      // Redirect to their dashboard
      const userRole = payload.role;
      const dashboardUrl = dashboardPaths[userRole] || '/';
      return NextResponse.redirect(new URL(dashboardUrl, req.url));
    } catch (error) {
      // If token is invalid, it's safe to let them proceed to the public page.
      // We can also clear the invalid cookie.
      console.error('JWT Verification Error:', error);
      const response = NextResponse.next();
      response.cookies.set('jwt', '', { maxAge: -1 });
      return response;
    }
  }

  // --- Logic for protecting dashboard routes ---
  const protectedPath = Object.values(dashboardPaths).find(p =>
    pathname.startsWith(p)
  );

  if (!protectedPath) {
    return NextResponse.next();
  }

  // If trying to access a protected route without a token, redirect to login
  const loginUrl = new URL('/login', req.url);
  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  // Verify the token for protected routes
  try {
    const { payload } = await jwtVerify<UserJWTPayload>(
      token,
      getJwtSecretKey()
    );
    const userRole = payload.role;
    const requiredDashboard = dashboardPaths[userRole];

    // If user is trying to access a dashboard that is not theirs, redirect them
    if (protectedPath !== requiredDashboard) {
      return NextResponse.redirect(new URL(requiredDashboard, req.url));
    }

    // If verification is successful and role is correct, allow access
    return NextResponse.next();
  } catch (error) {
    // This will catch errors from jwtVerify (e.g., invalid signature, expired token)
    console.error('JWT Verification Error:', error);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set('jwt', '', { maxAge: -1 }); // Delete the invalid cookie
    return response;
  }
}

// Configure which paths the middleware should run on.
// We include all paths except for static files and API routes.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
