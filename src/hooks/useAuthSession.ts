"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDashboardPath } from "@/lib/auth-utils";

export function useAuthSession() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status]);

  const redirectToDashboard = () => {
    if (session?.user?.role) {
      const dashboardPath = getDashboardPath(session.user.role);
      router.push(dashboardPath);
    }
  };

  const redirectToHome = () => {
    router.push("/");
  };

  const redirectToUnauthorized = () => {
    router.push("/");
  };

  const isAuthenticated = status === "authenticated" && !!session;
  const isUnauthenticated = status === "unauthenticated";
  const userRole = session?.user?.role;
  const userName = session?.user?.name;
  const userEmail = session?.user?.email;

  return {
    session,
    status,
    isLoading,
    isAuthenticated,
    isUnauthenticated,
    userRole,
    userName,
    userEmail,
    redirectToDashboard,
    redirectToHome,
    redirectToUnauthorized,
  };
}

export default useAuthSession;
