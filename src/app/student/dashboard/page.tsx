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

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);

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

    if (session) {
      fetchCourses();
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
                    Check back later for new courses or contact your instructor.
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
      </div>
    </div>
  );
}
