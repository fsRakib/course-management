"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { getDashboardPath } from "@/lib/auth-utils";
// import { canAccessRoute } from "@/lib/auth-utils"; // Commented out as unused

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
  allowUnauthenticated?: boolean;
}

export function ProtectedRoute({
  children,
  requiredRoles = [],
  redirectTo,
  allowUnauthenticated = false,
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    // If authentication is required and user is not authenticated
    if (!allowUnauthenticated && status === "unauthenticated") {
      router.push(redirectTo || "/");
      return;
    }

    // If user is authenticated, check role permissions
    if (status === "authenticated" && session?.user) {
      const userRole = session.user.role;

      // If specific roles are required, check if user has permission
      if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
        router.push("/");
        return;
      }

      // If user is on root page, redirect to their dashboard
      if (window.location.pathname === "/" && userRole) {
        const dashboardPath = getDashboardPath(userRole);
        router.push(dashboardPath);
        return;
      }
    }
  }, [
    status,
    session,
    router,
    requiredRoles,
    redirectTo,
    allowUnauthenticated,
  ]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required and user is not authenticated, don't render
  if (!allowUnauthenticated && status === "unauthenticated") {
    return null;
  }

  // If user is authenticated but doesn't have required role, don't render
  if (
    status === "authenticated" &&
    session?.user &&
    requiredRoles.length > 0 &&
    !requiredRoles.includes(session.user.role)
  ) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
