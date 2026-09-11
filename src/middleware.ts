import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware to protect routes that require an authenticated user.
// Redirects unauthenticated visitors to /auth/login, preserving the original destination.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedPrefixes = ['/customer', '/worker', '/admin'];
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

  if (isProtected) {
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
    const allCookies = request.cookies.getAll();
    const hasSbToken = allCookies.some(
      (c) => c.name.startsWith('sb-') || c.name.startsWith('sb:') || c.name.includes('access-token')
    );
    const hasDemoCookie = request.cookies.get('sahyog_demo');

    // If not in demo mode and no authentication cookie is present, redirect to /auth/login
    if (!isDemoMode && !hasSbToken && !hasDemoCookie) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/customer/:path*', '/worker/:path*', '/admin/:path*'],
};
