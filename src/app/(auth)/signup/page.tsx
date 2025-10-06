"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page where the user can access the auth modal
    router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to authentication...</p>
      </div>
    </div>
  );
}
