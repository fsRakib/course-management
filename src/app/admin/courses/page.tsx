"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Course {
  _id: string;
  title: string;
  description: string;
  image?: string;
  instructor?: string;
  students?: string[];
  modules: Array<{
    _id: string;
    title: string;
  }>;
  enrollmentType: "offline" | "online" | "combo";
  price?: number;
  startDate?: string;
  createdAt: string;
  isActive: boolean;
}

export default function AdminCoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }

    if (session?.user?.role !== "admin") {
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
        const coursesWithStatus = (data.courses || []).map(
          (course: Course) => ({
            ...course,
            isActive: true, // Mock status, would come from API
          })
        );
        setCourses(coursesWithStatus);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCourseStatus = async (courseId: string) => {
    try {
      // This would be a real API call to toggle course status
      console.log(`Toggling status for course ${courseId}`);

      setCourses(
        courses.map((course) =>
          course._id === courseId
            ? { ...course, isActive: !course.isActive }
            : course
        )
      );
    } catch (error) {
      console.error("Error toggling course status:", error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // This would be a real API call to delete the course
      console.log(`Deleting course ${courseId}`);

      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" || course.enrollmentType === filterType;
    return matchesSearch && matchesType;
  });

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

  if (!session || session.user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-lg text-red-600">Access Denied</div>
          <p className="text-gray-600 mt-2">
            You don&apos;t have admin privileges.
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
              Course Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage all courses in the system
            </p>
          </div>
          <Button
            onClick={() => router.push("/admin/dashboard")}
            variant="outline"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search courses by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Types</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="combo">Combo</option>
            </select>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {courses.length}
            </div>
            <div className="text-sm text-gray-600">Total Courses</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {courses.filter((c) => c.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Active Courses</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {courses.reduce((sum, c) => sum + (c.students?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Enrollments</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {courses.reduce((sum, c) => sum + c.modules.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Modules</div>
          </Card>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Courses Found
            </h3>
            <p className="text-gray-600">
              No courses match your current search criteria.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
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
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                      {course.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        course.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {course.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">
                      {course.enrollmentType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Students:</span>
                    <span className="font-medium">
                      {course.students?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Modules:</span>
                    <span className="font-medium">{course.modules.length}</span>
                  </div>
                  {course.price && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">${course.price}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Button
                      onClick={() =>
                        router.push(`/admin/courses/${course._id}`)
                      }
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() =>
                        router.push(`/admin/courses/${course._id}/edit`)
                      }
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleToggleCourseStatus(course._id)}
                      variant="outline"
                      size="sm"
                      className={`flex-1 ${
                        course.isActive
                          ? "text-red-600 hover:text-red-700"
                          : "text-green-600 hover:text-green-700"
                      }`}
                    >
                      {course.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      onClick={() => handleDeleteCourse(course._id)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      Delete
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
