"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getDashboardPath } from "@/lib/auth-utils";

export default function SignUp() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      // Redirect authenticated users to their dashboard
      const dashboardPath = getDashboardPath(session.user.role);
      router.push(dashboardPath);
    } else if (status === "unauthenticated") {
      // Redirect unauthenticated users to home page where they can access the auth modal
      router.push("/");
    }
  }, [status, session, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to authentication...</p>
      </div>
    </div>
  );
}
