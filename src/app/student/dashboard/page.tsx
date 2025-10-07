"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import CourseCard from "@/components/CourseCard";

import ProgramsHeader from "@/components/ProgramsHeader";

interface Course {
  _id: string;
  title: string;
  description: string;
  image?: string;
  features: string[];
  price?: number;
  enrollmentType: "offline" | "online" | "combo";
  startDate?: string;
  modules: Array<{
    _id: string;
    title: string;
    topics: string[];
    classVideos: string[];
    files: string[];
  }>;
}

interface StudentStats {
  enrolledCourses: number;
  completedCourses: number;
  totalProgress: number;
  certificatesEarned: number;
}

interface UploadedFile {
  _id: string;
  filename: string;
  originalName: string;
  fileType: "video" | "pdf" | "document" | "image";
  fileUrl: string;
  description?: string;
  fileSize?: number;
  uploadedBy: {
    name: string;
    email: string;
  };
  course?: {
    title: string;
  };
  createdAt: string;
}

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "enrolled" | "files">(
    "all"
  );
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const [stats, setStats] = useState<StudentStats>({
    enrolledCourses: 0,
    completedCourses: 0,
    totalProgress: 0,
    certificatesEarned: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }

    if (session?.user?.role !== "student") {
      router.push("/");
      return;
    }

    fetchStudentData();
  }, [session, status, router]);

  // Add effect to handle footer spacing for sidebar
  useEffect(() => {
    // Add left margin to footer when component mounts
    const footer = document.querySelector("footer");
    if (footer) {
      footer.style.marginLeft = "320px"; // 80 * 0.25rem = 320px (w-80)
    }

    // Cleanup: Remove the margin when component unmounts
    return () => {
      const footer = document.querySelector("footer");
      if (footer) {
        footer.style.marginLeft = "0";
      }
    };
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);

      // Fetch all courses
      const response = await fetch("/api/courses");
      if (response.ok) {
        const data = await response.json();
        const transformedCourses = (data.courses || []).map(
          (course: Course) => ({
            ...course,
            features: [
              `${course.modules?.length || 0} modules included`,
              "Expert instructors and quality content",
              "Interactive learning experience",
              "24/7 student support available",
              "Certificate upon completion",
              "Lifetime access to materials",
            ],
            enrollmentType: "online" as const,
            price: Math.floor(Math.random() * 5000) + 1000,
            startDate: new Date(
              Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
          })
        );
        setCourses(transformedCourses);
      }

      // Fetch enrolled courses
      const enrolledResponse = await fetch("/api/courses/enrolled");
      if (enrolledResponse.ok) {
        const enrolledData = await enrolledResponse.json();
        const transformedEnrolledCourses = (enrolledData.courses || []).map(
          (course: Course) => ({
            ...course,
            features: [
              `${course.modules?.length || 0} modules included`,
              "Expert instructors and quality content",
              "Interactive learning experience",
              "24/7 student support available",
              "Certificate upon completion",
              "Lifetime access to materials",
            ],
            enrollmentType: "online" as const,
            price: Math.floor(Math.random() * 5000) + 1000,
            startDate: new Date(
              Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
          })
        );
        setEnrolledCourses(transformedEnrolledCourses);

        // Update stats based on enrolled courses
        setStats({
          enrolledCourses: transformedEnrolledCourses.length,
          completedCourses: Math.floor(transformedEnrolledCourses.length * 0.3),
          totalProgress: Math.floor(Math.random() * 40) + 50,
          certificatesEarned: Math.floor(
            transformedEnrolledCourses.length * 0.2
          ),
        });
      }

      // Fetch files
      const filesResponse = await fetch("/api/upload?isPublic=true");
      if (filesResponse.ok) {
        const filesData = await filesResponse.json();
        setUploadedFiles(filesData.files || []);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false);
      setFilesLoading(false);
    }
  };

  // Filter courses based on active filter
  const filteredCourses = courses.filter((course) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "admission")
      return course.title.toLowerCase().includes("admission");
    if (activeFilter === "academic")
      return course.title.toLowerCase().includes("academic");
    if (activeFilter === "test")
      return course.title.toLowerCase().includes("test");
    if (activeFilter === "revision")
      return course.title.toLowerCase().includes("revision");
    return true;
  });

  const handleEnroll = async (courseId: string) => {
    const course = courses.find((c) => c._id === courseId);
    if (!course) return;

    setEnrollLoading(courseId);
    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        showToast({
          type: "success",
          title: "Enrollment Successful!",
          message: `You have successfully enrolled in "${course.title}". You can now access course materials.`,
          duration: 4000,
        });

        // Refresh data to show updated enrollment status
        await fetchStudentData();
      } else {
        showToast({
          type: "error",
          title: "Enrollment Failed",
          message:
            data.message || "Failed to enroll in the course. Please try again.",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      showToast({
        type: "error",
        title: "Enrollment Error",
        message: "An error occurred while enrolling. Please try again.",
        duration: 4000,
      });
    } finally {
      setEnrollLoading(null);
    }
  };

  const handleUnenroll = async (courseId: string) => {
    const course = enrolledCourses.find((c) => c._id === courseId);
    if (!course) return;

    if (!confirm(`Are you sure you want to unenroll from "${course.title}"?`)) {
      return;
    }

    setEnrollLoading(courseId);
    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        showToast({
          type: "success",
          title: "Unenrollment Successful",
          message: `You have been unenrolled from "${course.title}".`,
          duration: 4000,
        });

        // Refresh data to show updated enrollment status
        await fetchStudentData();
      } else {
        showToast({
          type: "error",
          title: "Unenrollment Failed",
          message:
            data.message ||
            "Failed to unenroll from the course. Please try again.",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error unenrolling from course:", error);
      showToast({
        type: "error",
        title: "Unenrollment Error",
        message: "An error occurred while unenrolling. Please try again.",
        duration: 4000,
      });
    } finally {
      setEnrollLoading(null);
    }
  };

  const handleViewDetails = (courseId: string) => {
    const course =
      courses.find((c) => c._id === courseId) ||
      enrolledCourses.find((c) => c._id === courseId);
    setSelectedCourse(course || null);
  };

  const handleAccessCourse = (courseId: string) => {
    router.push(`/student/courses/${courseId}`);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">
            Loading Student Dashboard...
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-white shadow-xl border-r border-gray-200 flex flex-col fixed left-0 top-20 h-[calc(100vh-80px)] overflow-y-auto z-10">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">🎓</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Student Dashboard
              </h2>
              <p className="text-sm text-gray-600">
                Welcome, {session.user?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-6">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span className="font-medium">
                All Courses ({courses.length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab("enrolled")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === "enrolled"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="font-medium">
                My Courses ({enrolledCourses.length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab("files")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === "files"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="font-medium">
                Materials ({uploadedFiles.length})
              </span>
            </button>
          </nav>

          {/* Stats in Sidebar */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              My Progress
            </h3>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Enrolled</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {stats.enrolledCourses}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {stats.completedCourses}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">
                    Progress
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {stats.totalProgress}%
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">
                    Certificates
                  </p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {stats.certificatesEarned}
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 ml-80">
        {/* Content Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {activeTab === "all"
                  ? "Available Courses"
                  : activeTab === "enrolled"
                  ? "My Enrolled Courses"
                  : "Learning Materials"}
              </h1>
              <p className="text-gray-600 mt-1">
                {activeTab === "all"
                  ? "Explore our comprehensive course offerings designed for your academic success."
                  : activeTab === "enrolled"
                  ? "Access your enrolled courses and learning materials."
                  : "Access your lecture materials and course resources."}
              </p>
            </div>
            {activeTab === "enrolled" && enrolledCourses.length > 0 && (
              <Button
                onClick={() => router.push("/student/courses")}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                View All My Courses
              </Button>
            )}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "all" ? (
          <div>
            {/* Programs Header with Filters */}
            <ProgramsHeader
              title=""
              subtitle=""
              showFilters={true}
              onFilterChange={setActiveFilter}
              activeFilter={activeFilter}
            />

            {/* Course Grid */}
            {loading ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <div className="text-lg text-gray-600">
                    Loading courses...
                  </div>
                </div>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No Courses Found
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeFilter === "all"
                    ? "No courses are available yet. Check back later for new courses."
                    : `No courses found for "${activeFilter}" category. Try a different filter.`}
                </p>
                <Button
                  onClick={() => setActiveFilter("all")}
                  variant="outline"
                >
                  View All Courses
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.map((course) => {
                  const isEnrolled = enrolledCourses.some(
                    (enrolledCourse) => enrolledCourse._id === course._id
                  );
                  return (
                    <CourseCard
                      key={course._id}
                      course={course}
                      isEnrolled={isEnrolled}
                      isLoading={enrollLoading === course._id}
                      onEnroll={handleEnroll}
                      onUnenroll={handleUnenroll}
                      onViewDetails={handleViewDetails}
                      onAccessCourse={handleAccessCourse}
                    />
                  );
                })}
              </div>
            )}
          </div>
        ) : activeTab === "enrolled" ? (
          <div>
            {/* Enrolled Courses */}
            {loading ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <div className="text-lg text-gray-600">
                    Loading enrolled courses...
                  </div>
                </div>
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">🎓</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No Enrolled Courses
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven&apos;t enrolled in any courses yet. Browse available
                  courses and start your learning journey!
                </p>
                <Button
                  onClick={() => setActiveTab("all")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Browse Courses
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {enrolledCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    isEnrolled={true}
                    isLoading={enrollLoading === course._id}
                    onUnenroll={handleUnenroll}
                    onViewDetails={handleViewDetails}
                    onAccessCourse={handleAccessCourse}
                  />
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "files" ? (
          <div>
            {/* Files content */}
            {filesLoading ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <div className="text-lg text-gray-600">
                    Loading materials...
                  </div>
                </div>
              </div>
            ) : uploadedFiles.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No Materials Available
                </h3>
                <p className="text-gray-600">
                  Course materials will appear here when they become available.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploadedFiles.map((file) => (
                  <Card
                    key={file._id}
                    className="p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {file.originalName}
                        </h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {file.fileType} File
                        </p>
                      </div>
                      <div className="text-2xl">
                        {file.fileType === "video"
                          ? "🎥"
                          : file.fileType === "pdf"
                          ? "📄"
                          : file.fileType === "image"
                          ? "🖼️"
                          : "📁"}
                      </div>
                    </div>

                    {file.description && (
                      <p className="text-sm text-gray-600 mb-4">
                        {file.description}
                      </p>
                    )}

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      {file.fileSize && (
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span>
                            {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Uploaded:</span>
                        <span>
                          {new Date(file.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => window.open(file.fileUrl, "_blank")}
                    >
                      {file.fileType === "video"
                        ? "Watch Video"
                        : "View/Download"}
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Course Details Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedCourse.title}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      {selectedCourse.description}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCourse(null)}
                    className="ml-4"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Course Modules
                </h3>
                <div className="space-y-3">
                  {selectedCourse.modules.map((module, index) => (
                    <div key={module._id} className="border rounded-lg">
                      <button
                        className={`w-full text-left p-4 font-medium transition-colors ${
                          selectedModule === index
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() =>
                          setSelectedModule(
                            selectedModule === index ? null : index
                          )
                        }
                      >
                        Module {index + 1}: {module.title}
                      </button>
                      {selectedModule === index && (
                        <div className="p-4 border-t bg-gray-50 space-y-4">
                          {module.topics.length > 0 && (
                            <div>
                              <p className="font-medium text-sm text-gray-600 mb-2">
                                Topics:
                              </p>
                              <ul className="text-sm text-gray-700 space-y-1">
                                {module.topics.map((topic, topicIndex) => (
                                  <li
                                    key={topicIndex}
                                    className="flex items-start"
                                  >
                                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    {topic}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {module.classVideos.length > 0 && (
                            <div>
                              <p className="font-medium text-sm text-gray-600 mb-2">
                                Class Videos:
                              </p>
                              <div className="space-y-2">
                                {module.classVideos.map((video, videoIndex) => (
                                  <div
                                    key={videoIndex}
                                    className="flex items-center justify-between"
                                  >
                                    <span className="text-sm text-gray-700">
                                      Video {videoIndex + 1}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        window.open(video, "_blank")
                                      }
                                    >
                                      Watch
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {module.files.length > 0 && (
                            <div>
                              <p className="font-medium text-sm text-gray-600 mb-2">
                                Files:
                              </p>
                              <div className="space-y-2">
                                {module.files.map((file, fileIndex) => (
                                  <div
                                    key={fileIndex}
                                    className="flex items-center justify-between"
                                  >
                                    <span className="text-sm text-gray-700">
                                      File {fileIndex + 1}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        window.open(file, "_blank")
                                      }
                                    >
                                      Download
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
