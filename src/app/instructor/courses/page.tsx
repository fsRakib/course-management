"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Course {
  _id: string;
  title: string;
  description: string;
  image?: string;
  features: string[];
  price?: number;
  enrollmentType: "offline" | "online" | "combo";
  startDate?: string;
  instructor?: string;
  students?: string[];
  modules: Array<{
    _id: string;
    title: string;
    topics: string[];
    classVideos: string[];
    files: string[];
  }>;
  createdAt: string;
}

export default function InstructorCoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }

    if (session?.user?.role !== "instructor") {
      router.push("/");
      return;
    }

    fetchCourses();
  }, [session, status, router]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/courses");
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudents = (courseId: string) => {
    router.push(`/instructor/courses/${courseId}/students`);
  };

  const handleEditCourse = (courseId: string) => {
    router.push(`/instructor/courses/${courseId}/edit`);
  };

  const handleAddModule = (courseId: string) => {
    router.push(`/instructor/courses/${courseId}/modules/create`);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading courses...</div>
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
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-2">
              Manage your courses and track student progress
            </p>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={() => router.push("/instructor/dashboard")}
              variant="outline"
            >
              Back to Dashboard
            </Button>
            <Button
              onClick={() => router.push("/instructor/courses/create")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Create New Course
            </Button>
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Courses Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven&apos;t created any courses yet. Start by creating your
              first course!
            </p>
            <Button
              onClick={() => router.push("/instructor/courses/create")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Create Your First Course
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card
                key={course._id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  {course.image && (
                    <Image
                      src={course.image}
                      alt={course.title}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Students:</span>
                    <span className="font-medium">
                      {course.students?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Modules:</span>
                    <span className="font-medium">{course.modules.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">
                      {course.enrollmentType}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => handleViewStudents(course._id)}
                    variant="outline"
                    className="w-full"
                  >
                    View Students ({course.students?.length || 0})
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleEditCourse(course._id)}
                      variant="outline"
                      className="flex-1"
                    >
                      Edit Course
                    </Button>
                    <Button
                      onClick={() => handleAddModule(course._id)}
                      variant="outline"
                      className="flex-1"
                    >
                      Add Module
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
