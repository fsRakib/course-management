"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import EnrolledStudents from "@/components/EnrolledStudents";

interface ViewStudentsPageProps {
  params: {
    courseId: string;
  };
}

export default function ViewStudentsPage({ params }: ViewStudentsPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const courseId = params.courseId;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }

    if (session?.user?.role !== "instructor") {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  const handleBack = () => {
    router.push("/instructor/dashboard");
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

  if (!session || session.user?.role !== "instructor") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-lg text-red-600">Access Denied</div>
          <p className="text-gray-600 mt-2">
            You don&apos;t have instructor privileges.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EnrolledStudents courseId={courseId} onBack={handleBack} />
    </div>
  );
}
