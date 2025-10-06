import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Define protected routes and their required roles
  const roleBasedRoutes = {
    "/developer": ["developer"],
    "/manager": ["socialMediaManager"],
    "/student": ["student"],
  };

  // Check if the current path matches any protected route
  const protectedRoute = Object.keys(roleBasedRoutes).find((route) =>
    pathname.startsWith(route)
  );

  // If accessing a protected route
  if (protectedRoute) {
    // Redirect to signin if not authenticated
    if (!token) {
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Check if user has required role for this route
    const requiredRoles =
      roleBasedRoutes[protectedRoute as keyof typeof roleBasedRoutes];
    const userRole = token.role as string;

    if (!requiredRoles.includes(userRole)) {
      // Redirect to homepage if user doesn't have required role
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Allow access to public routes and auth routes
  if (
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/register") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // For any other protected routes, check authentication
  if (!token && !pathname.startsWith("/api")) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
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
