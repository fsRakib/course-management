"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CreateCourseForm from "@/components/CreateCourseForm";

export default function DeveloperCreateCoursePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }

    if (session?.user?.role !== "developer") {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  const handleCourseCreated = () => {
    router.push("/developer/courses");
  };

  const handleCancel = () => {
    router.push("/developer/courses");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== "developer") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-lg text-red-600">Access Denied</div>
          <p className="text-gray-600 mt-2">
            You don&apos;t have developer privileges.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Course
          </h1>
          <p className="text-gray-600 mt-2">
            Create a comprehensive course as a developer
          </p>
        </div>

        <CreateCourseForm
          onCourseCreated={handleCourseCreated}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
