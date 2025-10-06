"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"courses" | "files">("courses");
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
      router.push("/unauthorized");
      return;
    }

    fetchStudentData();
  }, [session, status, router]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);

      // Fetch courses
      const response = await fetch("/api/courses");
      if (response.ok) {
        const data = await response.json();
        const transformedCourses = (data.courses || []).map((course: any) => ({
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
        }));
        setCourses(transformedCourses);

        // Mock student stats based on course data
        setStats({
          enrolledCourses: Math.min(3, transformedCourses.length),
          completedCourses: Math.floor(transformedCourses.length * 0.3),
          totalProgress: Math.floor(Math.random() * 40) + 50,
          certificatesEarned: Math.floor(transformedCourses.length * 0.2),
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

  const handleEnroll = (courseId: string) => {
    console.log("Enrolling in course:", courseId);
    alert("Enrollment feature coming soon!");
  };

  const handleViewDetails = (courseId: string) => {
    const course = courses.find((c) => c._id === courseId);
    setSelectedCourse(course || null);
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
            You don't have student privileges.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Student Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {session.user?.name}! Continue your learning
                journey.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                🎓 Student
              </div>
              <Button
                onClick={() => setActiveTab("courses")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Browse Courses
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
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
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">
                  Enrolled Courses
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats.enrolledCourses}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
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
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-2xl font-bold text-green-900">
                  {stats.completedCourses}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center">
              <div className="bg-purple-500 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
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
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">Progress</p>
                <p className="text-2xl font-bold text-purple-900">
                  {stats.totalProgress}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center">
              <div className="bg-yellow-500 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
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
              <div className="ml-4">
                <p className="text-sm font-medium text-yellow-600">
                  Certificates
                </p>
                <p className="text-2xl font-bold text-yellow-900">
                  {stats.certificatesEarned}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                My Learning Dashboard
              </h2>
              <p className="text-gray-600 mt-1">
                Manage your courses and learning materials
              </p>
            </div>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setActiveTab("courses")}
                className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeTab === "courses"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Courses ({courses.length})
              </button>
              <button
                onClick={() => setActiveTab("files")}
                className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeTab === "files"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Materials ({uploadedFiles.length})
              </button>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "courses" ? (
          <div>
            {/* Programs Header with Filters */}
            <ProgramsHeader
              title="Available Course Programs"
              subtitle="Explore our comprehensive course offerings designed for your academic success."
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
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    onEnroll={handleEnroll}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}

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
                                    {module.classVideos.map(
                                      (video, videoIndex) => (
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
                                      )
                                    )}
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
        ) : (
          /* Files Tab */
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Lecture Materials
            </h2>

            {filesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <div className="text-gray-500">Loading files...</div>
              </div>
            ) : uploadedFiles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <div className="text-gray-500 mb-4">
                  No lecture materials available yet.
                </div>
                <p className="text-sm text-gray-400">
                  Materials will appear here once your instructors upload them.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploadedFiles.map((file) => (
                  <div
                    key={file._id}
                    className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${
                            file.fileType === "video"
                              ? "bg-red-500"
                              : file.fileType === "pdf"
                              ? "bg-blue-500"
                              : file.fileType === "image"
                              ? "bg-green-500"
                              : "bg-gray-500"
                          }`}
                        >
                          {file.fileType === "video"
                            ? "📹"
                            : file.fileType === "pdf"
                            ? "📄"
                            : file.fileType === "image"
                            ? "🖼️"
                            : "📋"}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-2">
                            {file.originalName || file.filename}
                          </h3>
                          {file.course && (
                            <p className="text-sm text-blue-600">
                              {file.course.title}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {file.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {file.description}
                      </p>
                    )}

                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="capitalize">{file.fileType}</span>
                      </div>
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
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
