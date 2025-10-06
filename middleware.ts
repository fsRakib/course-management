import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  getDashboardPath,
  canAccessRoute,
  isPublicRoute,
} from "@/lib/auth-utils";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect authenticated users from root page to their dashboard
  if (pathname === "/" && token?.role) {
    const dashboardPath = getDashboardPath(token.role as string);
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  // Skip middleware for public routes and static assets
  if (
    isPublicRoute(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/register")
  ) {
    return NextResponse.next();
  }

  // For protected routes, check authentication and authorization
  if (!token) {
    // Redirect unauthenticated users to home page
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check if user has permission to access the current route
  const userRole = token.role as string;
  if (!canAccessRoute(userRole, pathname)) {
    // Redirect to unauthorized page if user doesn't have required role
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
