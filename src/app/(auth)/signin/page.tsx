"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  // This page is deprecated - auth is now handled via modal
  // Redirect to home page
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Redirecting...
          </h2>
          <p className="text-gray-600">
            Taking you to the new authentication system
          </p>
        </div>
      </div>
    </div>
  );
}
