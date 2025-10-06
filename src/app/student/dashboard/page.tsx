"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Course {
  _id: string;
  title: string;
  description: string;
  modules: Array<{
    _id: string;
    title: string;
    topics: string[];
    classVideos: string[];
    files: string[];
  }>;
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"courses" | "files">("courses");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
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

    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/upload?isPublic=true");
        if (response.ok) {
          const data = await response.json();
          setUploadedFiles(data.files || []);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setFilesLoading(false);
      }
    };

    if (session) {
      fetchCourses();
      fetchFiles();
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className="text-lg text-gray-600">
            Role:{" "}
            <span className="font-semibold capitalize">
              {session?.user?.role}
            </span>
          </p>
          <p className="text-gray-600 mt-2">
            Continue your learning journey with the courses below.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("courses")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "courses"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Courses ({courses.length})
              </button>
              <button
                onClick={() => setActiveTab("files")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "files"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Lecture Materials ({uploadedFiles.length})
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "courses" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  My Courses
                </h2>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">Loading courses...</div>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500 mb-4">
                      No courses available yet.
                    </div>
                    <p className="text-sm text-gray-400">
                      Check back later for new courses or contact your
                      instructor.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div
                        key={course._id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedCourse?._id === course._id
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => {
                          setSelectedCourse(course);
                          setSelectedModule(null);
                        }}
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {course.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {course.modules.length} modules
                          </span>
                          <Button
                            size="sm"
                            variant={
                              selectedCourse?._id === course._id
                                ? "default"
                                : "outline"
                            }
                          >
                            {selectedCourse?._id === course._id
                              ? "Selected"
                              : "View Course"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Course Content */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Course Content
                </h2>

                {!selectedCourse ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">
                      Select a course to view content
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">
                      {selectedCourse.title}
                    </h3>

                    {/* Modules */}
                    <div className="space-y-3">
                      {selectedCourse.modules.map((module, index) => (
                        <div key={module._id} className="border rounded-lg">
                          <button
                            className={`w-full text-left p-3 font-medium ${
                              selectedModule === index
                                ? "bg-indigo-50 text-indigo-700"
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
                            <div className="p-3 border-t bg-gray-50">
                              {/* Topics */}
                              {module.topics.length > 0 && (
                                <div className="mb-3">
                                  <p className="font-medium text-sm text-gray-600 mb-2">
                                    Topics:
                                  </p>
                                  <ul className="text-sm text-gray-700 space-y-1">
                                    {module.topics.map((topic, topicIndex) => (
                                      <li
                                        key={topicIndex}
                                        className="flex items-start"
                                      >
                                        <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                        {topic}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Class Videos */}
                              {module.classVideos.length > 0 && (
                                <div className="mb-3">
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
                                          <span className="text-sm text-gray-700 truncate">
                                            Video {videoIndex + 1}
                                          </span>
                                          <Button size="sm" variant="outline">
                                            <a
                                              href={video}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              Watch
                                            </a>
                                          </Button>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Files */}
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
                                        <span className="text-sm text-gray-700 truncate">
                                          File {fileIndex + 1}
                                        </span>
                                        <Button size="sm" variant="outline">
                                          <a
                                            href={file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            Download
                                          </a>
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
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Files Tab */
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Lecture Materials
            </h2>

            {filesLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading files...</div>
              </div>
            ) : uploadedFiles.length === 0 ? (
              <div className="text-center py-8">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-400"
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
                </div>
                <div className="text-gray-500 mb-4">
                  No files available yet.
                </div>
                <p className="text-sm text-gray-400">
                  Your instructors haven't uploaded any materials yet. Check
                  back later!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploadedFiles.map((file) => (
                  <div
                    key={file._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        {file.fileType === "video" && (
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                            <svg
                              className="w-4 h-4 text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m2-5a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        )}
                        {file.fileType === "pdf" && (
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <svg
                              className="w-4 h-4 text-blue-600"
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
                          </div>
                        )}
                        {file.fileType === "document" && (
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <svg
                              className="w-4 h-4 text-green-600"
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
                          </div>
                        )}
                        {file.fileType === "image" && (
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <svg
                              className="w-4 h-4 text-purple-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm truncate">
                            {file.originalName}
                          </h3>
                          <p className="text-xs text-gray-500 capitalize">
                            {file.fileType}
                          </p>
                        </div>
                      </div>
                    </div>

                    {file.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {file.description}
                      </p>
                    )}

                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Uploaded by:</span>
                        <span className="font-medium">
                          {file.uploadedBy.name}
                        </span>
                      </div>
                      {file.course && (
                        <div className="flex justify-between">
                          <span>Course:</span>
                          <span className="font-medium">
                            {file.course.title}
                          </span>
                        </div>
                      )}
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

                    <div className="mt-4 pt-3 border-t">
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => window.open(file.fileUrl, "_blank")}
                      >
                        {file.fileType === "video"
                          ? "Watch Video"
                          : "View/Download"}
                      </Button>
                    </div>
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
