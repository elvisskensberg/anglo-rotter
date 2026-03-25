import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js proxy (formerly "middleware") — protects write endpoints that require authentication.
 *
 * Next.js 16 renames "middleware" convention to "proxy".
 * See: https://nextjs.org/docs/messages/middleware-to-proxy
 *
 * Protected routes (POST/PUT/DELETE only):
 *   - /api/threads        — create new threads
 *   - /api/threads/*      — replies, ratings, and other thread mutations
 *
 * All GET requests and /api/auth/* pass through without restriction.
 * Public read API routes (/api/forums/*, /api/news, /api/scrape) are not blocked.
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const method = request.method.toUpperCase();

  // Only protect mutating requests (POST, PUT, PATCH, DELETE)
  // GET requests are always public (read-only data)
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return NextResponse.next();
  }

  // Check for a Better Auth session cookie.
  // Better Auth sets a cookie named "better-auth.session_token" by default.
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ??
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  if (!sessionToken) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

/**
 * Matcher: only run proxy on /api/threads/* paths.
 * /api/auth/*, /api/forums/*, /api/news, /api/push/* are handled separately
 * and do not need auth protection at the proxy level.
 */
export const config = {
  matcher: ["/api/threads/:path*"],
};
