"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CourseCard from "@/components/CourseCard";

interface Course {
  _id: string;
  title: string;
  description: string;
  image?: string;
  features: string[];
  price?: number;
  enrollmentType: "offline" | "online" | "combo";
  startDate?: string;
  instructor?: {
    name: string;
    email: string;
  };
  modules: Array<{
    _id: string;
    title: string;
    topics: string[];
    classVideos: string[];
    files: string[];
  }>;
  students?: string[];
  createdAt: string;
}

export default function StudentCoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }

    if (session?.user?.role !== "student") {
      router.push("/");
      return;
    }

    fetchEnrolledCourses();
  }, [session, status, router]);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/courses/enrolled");
      if (response.ok) {
        const data = await response.json();
        setEnrolledCourses(data.courses || []);
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccessCourse = (courseId: string) => {
    router.push(`/student/courses/${courseId}`);
  };

  const handleViewDetails = (courseId: string) => {
    router.push(`/student/courses/${courseId}`);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading your courses...</div>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== "student") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-lg text-red-600">Access Denied</div>
          <p className="text-gray-600 mt-2">
            You don&apos;t have student privileges.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Enrolled Courses
            </h1>
            <p className="text-gray-600 mt-2">
              Access your enrolled courses and track your learning progress
            </p>
          </div>
          <Button
            onClick={() => router.push("/student/dashboard")}
            variant="outline"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Course Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {enrolledCourses.length}
            </div>
            <div className="text-sm font-medium text-blue-800">
              Total Courses
            </div>
          </Card>

          <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {enrolledCourses.reduce(
                (sum, course) => sum + course.modules.length,
                0
              )}
            </div>
            <div className="text-sm font-medium text-green-800">
              Total Modules
            </div>
          </Card>

          <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {enrolledCourses.reduce(
                (sum, course) =>
                  sum +
                  course.modules.reduce(
                    (modSum, mod) => modSum + mod.classVideos.length,
                    0
                  ),
                0
              )}
            </div>
            <div className="text-sm font-medium text-purple-800">
              Total Videos
            </div>
          </Card>

          <Card className="p-6 text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {enrolledCourses.reduce(
                (sum, course) =>
                  sum +
                  course.modules.reduce(
                    (modSum, mod) => modSum + mod.files.length,
                    0
                  ),
                0
              )}
            </div>
            <div className="text-sm font-medium text-yellow-800">
              Total Files
            </div>
          </Card>
        </div>

        {/* Courses Grid */}
        {enrolledCourses.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Enrolled Courses
            </h3>
            <p className="text-gray-600 mb-6">
              You haven&apos;t enrolled in any courses yet. Browse available
              courses and start your learning journey!
            </p>
            <Button
              onClick={() => router.push("/student/dashboard")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Browse Courses
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {enrolledCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                isEnrolled={true}
                onAccessCourse={handleAccessCourse}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
