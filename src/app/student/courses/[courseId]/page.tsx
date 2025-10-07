"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Module {
  _id: string;
  title: string;
  topics: string[];
  classVideos: string[];
  files: string[];
}

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
    _id: string;
    name: string;
    email: string;
  };
  modules: Module[];
  students?: string[];
  createdAt: string;
}

interface CourseAccessPageProps {
  params: {
    courseId: string;
  };
}

export default function CourseAccessPage({ params }: CourseAccessPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const courseId = params.courseId;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "modules" | "materials"
  >("overview");
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }

    if (session?.user?.role !== "student") {
      router.push("/");
      return;
    }

    if (courseId) {
      fetchCourseAndCheckEnrollment();
    }
  }, [session, status, router, courseId]);

  const fetchCourseAndCheckEnrollment = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch course details
      const courseResponse = await fetch(`/api/courses/${courseId}`);
      if (!courseResponse.ok) {
        throw new Error("Course not found");
      }

      const courseData = await courseResponse.json();
      setCourse(courseData.course);

      // Check if student is enrolled
      const enrolledResponse = await fetch("/api/courses/enrolled");
      if (enrolledResponse.ok) {
        const enrolledData = await enrolledResponse.json();
        const enrolled = enrolledData.courses.some(
          (c: Course) => c._id === courseId
        );
        setIsEnrolled(enrolled);

        if (!enrolled) {
          // Redirect to dashboard if not enrolled
          router.push("/student/dashboard");
          return;
        }
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      router.push("/student/dashboard");
    } finally {
      setLoading(false);
    }
  }, [courseId, router]);

  const handleModuleToggle = (index: number) => {
    setExpandedModule(expandedModule === index ? null : index);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading course...</div>
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

  if (!course || !isEnrolled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-lg text-red-600">Course Not Accessible</div>
          <p className="text-gray-600 mt-2">
            You don&apos;t have access to this course or it doesn&apos;t exist.
          </p>
          <Button
            onClick={() => router.push("/student/dashboard")}
            className="mt-4"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push("/student/dashboard")}
                variant="outline"
                size="sm"
              >
                ← Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {course.title}
                </h1>
                <p className="text-sm text-gray-600">
                  {course.instructor?.name &&
                    `Instructor: ${course.instructor.name}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                ✓ Enrolled
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                {course.enrollmentType}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Course Image */}
        {course.image && (
          <div className="mb-8">
            <Image
              src={course.image}
              alt={course.title}
              width={800}
              height={256}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("modules")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "modules"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Modules ({course.modules.length})
              </button>
              <button
                onClick={() => setActiveTab("materials")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "materials"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Materials
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Description */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Course Description
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {course.description}
                </p>

                {course.features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      What You&apos;ll Learn
                    </h3>
                    <ul className="space-y-2">
                      {course.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            </div>

            {/* Course Info Sidebar */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Course Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Enrollment Type:</span>
                    <span className="font-medium capitalize">
                      {course.enrollmentType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Modules:</span>
                    <span className="font-medium">{course.modules.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Topics:</span>
                    <span className="font-medium">
                      {course.modules.reduce(
                        (sum, module) => sum + module.topics.length,
                        0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Videos:</span>
                    <span className="font-medium">
                      {course.modules.reduce(
                        (sum, module) => sum + module.classVideos.length,
                        0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Files:</span>
                    <span className="font-medium">
                      {course.modules.reduce(
                        (sum, module) => sum + module.files.length,
                        0
                      )}
                    </span>
                  </div>
                  {course.startDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">
                        {new Date(course.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Enrolled:</span>
                    <span className="font-medium">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>

              {course.instructor && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Instructor
                  </h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {course.instructor.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {course.instructor.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {course.instructor.email}
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === "modules" && (
          <div className="space-y-4">
            {course.modules.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No Modules Available
                </h3>
                <p className="text-gray-600">
                  Course modules will appear here when they are added by the
                  instructor.
                </p>
              </Card>
            ) : (
              course.modules.map((module, index) => (
                <Card key={module._id} className="overflow-hidden">
                  <button
                    onClick={() => handleModuleToggle(index)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Module {index + 1}: {module.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {module.topics.length} topics •{" "}
                          {module.classVideos.length} videos •{" "}
                          {module.files.length} files
                        </p>
                      </div>
                      <div className="text-2xl">
                        {expandedModule === index ? "−" : "+"}
                      </div>
                    </div>
                  </button>

                  {expandedModule === index && (
                    <div className="px-6 pb-6 border-t bg-gray-50">
                      <div className="pt-6 space-y-6">
                        {/* Topics */}
                        {module.topics.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">
                              📋 Topics Covered
                            </h4>
                            <ul className="space-y-2">
                              {module.topics.map((topic, topicIndex) => (
                                <li
                                  key={topicIndex}
                                  className="flex items-start"
                                >
                                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                  <span className="text-gray-700">{topic}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Videos */}
                        {module.classVideos.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">
                              🎥 Class Videos
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {module.classVideos.map((video, videoIndex) => (
                                <div
                                  key={videoIndex}
                                  className="flex items-center justify-between bg-white p-4 rounded-lg border"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                      <span className="text-red-600 text-lg">
                                        ▶
                                      </span>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        Video {videoIndex + 1}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Class Recording
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    onClick={() => window.open(video, "_blank")}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    Watch
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Files */}
                        {module.files.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">
                              📁 Course Files
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {module.files.map((file, fileIndex) => (
                                <div
                                  key={fileIndex}
                                  className="flex items-center justify-between bg-white p-4 rounded-lg border"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                      <span className="text-green-600 text-lg">
                                        📄
                                      </span>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        File {fileIndex + 1}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Course Material
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    onClick={() => window.open(file, "_blank")}
                                    size="sm"
                                    variant="outline"
                                  >
                                    Download
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === "materials" && (
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                All Course Materials
              </h2>

              {/* All Videos */}
              {course.modules.some((m) => m.classVideos.length > 0) && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    🎥 All Videos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {course.modules.map((module, modIndex) =>
                      module.classVideos.map((video, vidIndex) => (
                        <div
                          key={`${modIndex}-${vidIndex}`}
                          className="bg-gray-50 p-4 rounded-lg border"
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                              <span className="text-red-600 text-xl">▶</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {module.title}
                              </p>
                              <p className="text-sm text-gray-600">
                                Video {vidIndex + 1}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => window.open(video, "_blank")}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            Watch Video
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* All Files */}
              {course.modules.some((m) => m.files.length > 0) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    📁 All Files
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {course.modules.map((module, modIndex) =>
                      module.files.map((file, fileIndex) => (
                        <div
                          key={`${modIndex}-${fileIndex}`}
                          className="bg-gray-50 p-4 rounded-lg border"
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <span className="text-green-600 text-xl">📄</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {module.title}
                              </p>
                              <p className="text-sm text-gray-600">
                                File {fileIndex + 1}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => window.open(file, "_blank")}
                            variant="outline"
                            className="w-full"
                          >
                            Download File
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* No materials message */}
              {!course.modules.some(
                (m) => m.classVideos.length > 0 || m.files.length > 0
              ) && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No Materials Available
                  </h3>
                  <p className="text-gray-600">
                    Course materials will appear here when they are uploaded by
                    the instructor.
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
