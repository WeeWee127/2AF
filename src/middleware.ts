import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth'; // Use session logic (now Edge-compatible)

const PUBLIC_ROUTES = ['/login', '/register']; // Routes accessible without login
const AUTH_ROUTES = ['/login', '/register']; // Routes logged-in users shouldn't normally access
// PROTECTED_ROUTES are implicitly handled: if not public/auth/2fa and logged in, access is allowed.
const TWO_FA_ROUTE = '/verify-2fa'; // The 2FA verification route

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.url; // Base URL for redirects

  // Fetch session state using the Edge-compatible getSession function
  let session = null;
  try {
      session = await getSession();
  } catch (error) {
      console.error("[Middleware] Error fetching session:", error);
      // Decide how to handle session fetch errors, e.g., redirect to login or an error page
      // For now, treat as not logged in.
  }


  const isLoggedIn = !!session;
  // Ensure needs2FA defaults to false if session is null or needs2FA is not explicitly true
  const needs2FA = session?.needs2FA === true;

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isTwoFARoute = pathname === TWO_FA_ROUTE;

  // --- Debug Logging ---
  // console.log(`[Middleware] Path: ${pathname}, LoggedIn: ${isLoggedIn}, Needs2FA: ${needs2FA}`);

  // --- Redirect logic ---

  // Case 1: User is logged in AND requires 2FA verification
  if (isLoggedIn && needs2FA) {
    // If they are NOT on the 2FA page, redirect them there
    if (!isTwoFARoute) {
      // console.log(`[Middleware] Redirecting to ${TWO_FA_ROUTE} (needs 2FA)`);
      return NextResponse.redirect(new URL(TWO_FA_ROUTE, url));
    }
    // Allow access if already on the 2FA page
    // console.log(`[Middleware] Allowing access to ${TWO_FA_ROUTE} (needs 2FA)`);
    return NextResponse.next();
  }

  // Case 2: User is logged in AND does NOT require 2FA verification (already verified or not enabled)
  if (isLoggedIn && !needs2FA) {
    // If they try to access login/register or the 2FA page, redirect to dashboard (default protected page)
    if (isAuthRoute || isTwoFARoute) {
      // console.log(`[Middleware] Redirecting to /dashboard (logged in, 2FA OK, accessing auth/2fa route)`);
      return NextResponse.redirect(new URL('/dashboard', url));
    }
    // Allow access to any other route (e.g., /dashboard or other protected pages)
    // console.log(`[Middleware] Allowing access to ${pathname} (logged in, 2FA OK)`);
    return NextResponse.next();
  }

  // Case 3: User is NOT logged in
  if (!isLoggedIn) {
    // If they try to access anything other than a public route, redirect to login
    if (!isPublicRoute) {
      // console.log(`[Middleware] Redirecting to /login (not logged in, accessing non-public: ${pathname})`);
      return NextResponse.redirect(new URL('/login', url));
    }
    // Allow access to the public route
    // console.log(`[Middleware] Allowing access to public route: ${pathname} (not logged in)`);
    return NextResponse.next();
  }

  // Fallback (should ideally not be reached with the logic above)
  console.warn(`[Middleware] Fallback case reached for path: ${pathname}. Allowing access.`);
  return NextResponse.next();
}

// Configuration for the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Health check paths if any (e.g., /_health)
     * - Specific asset paths if needed (e.g., /images/logo.png)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|_health).*)',
  ],
};