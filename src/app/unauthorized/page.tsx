"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getDashboardPath, getRoleDisplayName } from "@/lib/auth-utils";

export default function UnauthorizedPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGoToDashboard = () => {
    if (session?.user?.role) {
      const dashboardPath = getDashboardPath(session.user.role);
      router.push(dashboardPath);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-white shadow-xl rounded-2xl p-8">
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>

          <p className="text-gray-600 mb-6">
            You don&apos;t have permission to access this page. This area is
            restricted to users with specific roles and privileges.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-yellow-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-left">
                <p className="text-sm font-medium text-yellow-800">
                  Current Role:{" "}
                  {session?.user?.role
                    ? getRoleDisplayName(session.user.role)
                    : "Not authenticated"}
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  If you believe this is an error, please contact your
                  administrator.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {session ? (
              <Button
                onClick={handleGoToDashboard}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Go to My Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => router.push("/signin")}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Sign In
              </Button>
            )}

            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full"
            >
              Back to Home
            </Button>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            Need help? Contact support at{" "}
            <a
              href="mailto:support@example.com"
              className="text-blue-600 hover:text-blue-500"
            >
              support@example.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
