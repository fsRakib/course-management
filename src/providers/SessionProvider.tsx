"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import {
  getDashboardPath,
  canAccessRoute,
  isPublicRoute,
} from "@/lib/auth-utils";

interface SessionContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: string | null;
  userName: string | null;
  userEmail: string | null;
  redirectToDashboard: () => void;
  redirectToHome: () => void;
  canAccess: (route: string) => boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status]);

  // Handle automatic redirections
  useEffect(() => {
    if (status === "loading") return;

    // Redirect authenticated users from public pages to their dashboard
    if (status === "authenticated" && session?.user?.role) {
      // Only redirect from root page, not from other public pages like /
      if (pathname === "/") {
        const dashboardPath = getDashboardPath(session.user.role);
        router.push(dashboardPath);
        return;
      }

      // Check if user can access current protected route
      if (
        !isPublicRoute(pathname) &&
        !canAccessRoute(session.user.role, pathname)
      ) {
        router.push("/");
        return;
      }
    }

    // Redirect unauthenticated users from protected routes
    if (status === "unauthenticated" && !isPublicRoute(pathname)) {
      router.push("/");
      return;
    }
  }, [status, session, pathname, router]);

  const redirectToDashboard = () => {
    if (session?.user?.role) {
      const dashboardPath = getDashboardPath(session.user.role);
      router.push(dashboardPath);
    }
  };

  const redirectToHome = () => {
    router.push("/");
  };

  const canAccess = (route: string): boolean => {
    if (!session?.user?.role) return false;
    return canAccessRoute(session.user.role, route);
  };

  const value: SessionContextType = {
    isLoading,
    isAuthenticated: status === "authenticated" && !!session,
    userRole: session?.user?.role || null,
    userName: session?.user?.name || null,
    userEmail: session?.user?.email || null,
    redirectToDashboard,
    redirectToHome,
    canAccess,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  }
  return context;
}

export default SessionProvider;
