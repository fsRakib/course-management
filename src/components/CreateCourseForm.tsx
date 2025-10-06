"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";

interface CourseFormProps {
  onCourseCreated: () => void;
  onCancel: () => void;
}

interface Module {
  title: string;
  topics: string[];
  classVideos: File[];
  files: File[];
}

export default function CreateCourseForm({
  onCourseCreated,
  onCancel,
}: CourseFormProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
  });
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModule, setCurrentModule] = useState<Module>({
    title: "",
    topics: [""],
    classVideos: [],
    files: [],
  });

  const handleInputChange = (field: string, value: string) => {
    setCourseData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleModuleChange = (field: string, value: any) => {
    setCurrentModule((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTopic = () => {
    setCurrentModule((prev) => ({
      ...prev,
      topics: [...prev.topics, ""],
    }));
  };

  const updateTopic = (index: number, value: string) => {
    setCurrentModule((prev) => ({
      ...prev,
      topics: prev.topics.map((topic, i) => (i === index ? value : topic)),
    }));
  };

  const removeTopic = (index: number) => {
    setCurrentModule((prev) => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index),
    }));
  };

  const handleVideoUpload = (files: FileList | null) => {
    if (files) {
      const videoFiles = Array.from(files).filter(
        (file) =>
          file.type.startsWith("video/") ||
          file.name.endsWith(".mp4") ||
          file.name.endsWith(".webm")
      );
      setCurrentModule((prev) => ({
        ...prev,
        classVideos: [...prev.classVideos, ...videoFiles],
      }));
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const documentFiles = Array.from(files).filter(
        (file) =>
          file.type.includes("pdf") ||
          file.type.includes("document") ||
          file.type.includes("text") ||
          file.name.endsWith(".pdf") ||
          file.name.endsWith(".doc") ||
          file.name.endsWith(".docx") ||
          file.name.endsWith(".txt")
      );
      setCurrentModule((prev) => ({
        ...prev,
        files: [...prev.files, ...documentFiles],
      }));
    }
  };

  const addModule = () => {
    if (!currentModule.title.trim()) {
      showToast({
        type: "error",
        title: "Error",
        message: "Module title is required",
      });
      return;
    }

    setModules((prev) => [...prev, { ...currentModule }]);
    setCurrentModule({
      title: "",
      topics: [""],
      classVideos: [],
      files: [],
    });
  };

  const removeModule = (index: number) => {
    setModules((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (
    files: File[],
    courseId: string,
    moduleId: string
  ) => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      // Better file type detection
      let detectedFileType = "document"; // default
      if (file.type.startsWith("video/")) {
        detectedFileType = "video";
      } else if (file.type === "application/pdf") {
        detectedFileType = "pdf";
      } else if (file.type.startsWith("image/")) {
        detectedFileType = "image";
      }

      formData.append("fileType", detectedFileType);
      formData.append("courseId", courseId);
      formData.append("moduleId", moduleId);
      formData.append("isPublic", "false");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        console.error(`Upload failed for ${file.name}:`, errorData);
        throw new Error(
          `Failed to upload ${file.name}: ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const result = await response.json();

      if (!result.success || !result.file) {
        throw new Error(
          `Invalid response for ${file.name}: ${
            result.message || "Unknown error"
          }`
        );
      }

      return result.file.fileUrl || result.file.downloadUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseData.title.trim() || !courseData.description.trim()) {
      showToast({
        type: "error",
        title: "Error",
        message: "Course title and description are required",
      });
      return;
    }

    try {
      setLoading(true);

      // Create course first
      const courseResponse = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: courseData.title,
          description: courseData.description,
        }),
      });

      if (!courseResponse.ok) {
        throw new Error("Failed to create course");
      }

      const courseResult = await courseResponse.json();
      const courseId = courseResult.course._id;

      // Add modules with file uploads
      for (const courseModule of modules) {
        const moduleResponse = await fetch(`/api/courses/${courseId}/modules`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: courseModule.title,
            topics: courseModule.topics.filter((topic) => topic.trim() !== ""),
          }),
        });

        if (!moduleResponse.ok) {
          throw new Error(`Failed to create module: ${courseModule.title}`);
        }

        const moduleResult = await moduleResponse.json();

        // Validate API response structure
        if (
          !moduleResult.success ||
          !moduleResult.course ||
          !moduleResult.course.modules
        ) {
          throw new Error(
            `Invalid response structure for module: ${courseModule.title}`
          );
        }

        // Get the newly added module (last one in the array)
        const updatedCourse = moduleResult.course;
        const newModule =
          updatedCourse.modules[updatedCourse.modules.length - 1];

        if (!newModule || !newModule._id) {
          throw new Error(`Failed to get module ID for: ${courseModule.title}`);
        }

        const moduleId = newModule._id;

        // Upload videos and files with error handling
        try {
          if (courseModule.classVideos.length > 0) {
            console.log(
              `Uploading ${courseModule.classVideos.length} video(s) for module: ${courseModule.title}`
            );
            const videoUrls = await uploadFiles(
              courseModule.classVideos,
              courseId,
              moduleId
            );

            // Update module with video URLs
            await fetch(`/api/courses/${courseId}/modules/${moduleId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                classVideos: videoUrls,
              }),
            });
            console.log(
              `Successfully uploaded videos for module: ${courseModule.title}`
            );
          }

          if (courseModule.files.length > 0) {
            console.log(
              `Uploading ${courseModule.files.length} file(s) for module: ${courseModule.title}`
            );
            const fileUrls = await uploadFiles(
              courseModule.files,
              courseId,
              moduleId
            );

            // Update module with file URLs
            await fetch(`/api/courses/${courseId}/modules/${moduleId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                files: fileUrls,
              }),
            });
            console.log(
              `Successfully uploaded files for module: ${courseModule.title}`
            );
          }
        } catch (uploadError) {
          console.error(
            `File upload failed for module "${courseModule.title}":`,
            uploadError
          );

          // Show a warning but do not fail the entire course creation
          showToast({
            type: "error",
            title: "File Upload Warning",
            message: `Some files couldn't be uploaded for module "${courseModule.title}". The course was created but you may need to upload files manually later.`,
          });

          // Continue with the next module instead of failing completely
        }
      }

      showToast({
        type: "success",
        title: "Success",
        message: "Course created successfully!",
      });

      onCourseCreated();
    } catch (error) {
      console.error("Error creating course:", error);
      showToast({
        type: "error",
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to create course",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section with Animation */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-lg animate-pulse">
            <svg
              className="w-8 h-8 text-white"
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
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Create New Course
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform knowledge into engaging learning experiences. Build
            comprehensive courses with interactive modules and rich content.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-indigo-600">
                Course Info
              </span>
            </div>
            <div className="w-16 h-1 bg-gray-200 rounded">
              <div className="w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded"></div>
            </div>
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold shadow-lg ${
                  modules.length > 0
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  modules.length > 0 ? "text-indigo-600" : "text-gray-400"
                }`}
              >
                Add Modules
              </span>
            </div>
            <div className="w-16 h-1 bg-gray-200 rounded">
              <div
                className={`h-1 rounded transition-all duration-500 ${
                  modules.length > 0
                    ? "w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                    : "w-0"
                }`}
              ></div>
            </div>
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold shadow-lg ${
                  modules.length > 0 &&
                  courseData.title &&
                  courseData.description
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                3
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  modules.length > 0 &&
                  courseData.title &&
                  courseData.description
                    ? "text-indigo-600"
                    : "text-gray-400"
                }`}
              >
                Complete
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Course Basic Info Card */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Course Information
                </h3>
                <p className="text-gray-600 mt-1">
                  Define your course basics and overview
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-lg font-semibold text-gray-700 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2 text-indigo-600"
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
                  Course Title *
                </Label>
                <Input
                  id="title"
                  value={courseData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Advanced JavaScript Fundamentals"
                  className="w-full h-14 text-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 rounded-xl"
                  required
                />
                <div className="text-sm text-gray-500 mt-1">
                  {courseData.title.length}/100 characters
                </div>
              </div>

              <div className="space-y-2 md:row-span-2">
                <Label
                  htmlFor="description"
                  className="text-lg font-semibold text-gray-700 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                  Course Description *
                </Label>
                <Textarea
                  id="description"
                  value={courseData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe what students will learn, course objectives, and key outcomes..."
                  className="w-full h-32 text-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 rounded-xl resize-none"
                  required
                />
                <div className="text-sm text-gray-500 mt-1">
                  {courseData.description.length}/500 characters
                </div>
              </div>
            </div>
          </Card>

          {/* Module Creation Card */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Add Course Module
                </h3>
                <p className="text-gray-600 mt-1">
                  Structure your course with engaging modules
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-indigo-50 p-8 rounded-2xl border border-gray-100 shadow-inner">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="moduleTitle"
                    className="text-lg font-semibold text-gray-700 flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    Module Title
                  </Label>
                  <Input
                    id="moduleTitle"
                    value={currentModule.title}
                    onChange={(e) =>
                      handleModuleChange("title", e.target.value)
                    }
                    placeholder="e.g., Introduction to React Hooks"
                    className="h-12 text-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 rounded-xl"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-gray-700 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                    Topics (
                    {currentModule.topics.filter((t) => t.trim()).length})
                  </Label>
                  <div className="space-y-3">
                    {currentModule.topics.map((topic, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                          {index + 1}
                        </div>
                        <Input
                          value={topic}
                          onChange={(e) => updateTopic(index, e.target.value)}
                          placeholder={`Topic ${
                            index + 1
                          } - e.g., useState Hook Basics`}
                          className="flex-1 h-12 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 rounded-xl"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTopic(index)}
                          disabled={currentModule.topics.length === 1}
                          className="w-10 h-10 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTopic}
                      className="w-full h-12 border-2 border-dashed border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 rounded-xl font-semibold transition-all duration-200"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Another Topic
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="videos"
                      className="text-lg font-semibold text-gray-700 flex items-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Class Videos
                    </Label>
                    <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded-lg border border-blue-200 mb-2">
                      💡 <strong>Note:</strong> File uploads are in development
                      mode. Large videos (&gt;100MB) may fail but won&apos;t
                      prevent course creation.
                    </div>
                    <div className="relative">
                      <Input
                        id="videos"
                        type="file"
                        multiple
                        accept="video/*"
                        onChange={(e) => handleVideoUpload(e.target.files)}
                        className="w-full h-24 border-2 border-dashed border-red-300 hover:border-red-400 focus:border-red-500 rounded-xl file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 transition-all duration-200"
                      />
                      <div className="absolute top-2 right-2">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
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
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {currentModule.classVideos.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center text-red-700">
                          <svg
                            className="w-4 h-4 mr-2"
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
                          <span className="font-semibold">
                            {currentModule.classVideos.length} video(s) selected
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="files"
                      className="text-lg font-semibold text-gray-700 flex items-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-green-600"
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
                      Lecture Notes/Files
                    </Label>
                    <div className="relative">
                      <Input
                        id="files"
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="w-full h-24 border-2 border-dashed border-green-300 hover:border-green-400 focus:border-green-500 rounded-xl file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-all duration-200"
                      />
                      <div className="absolute top-2 right-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
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
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {currentModule.files.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center text-green-700">
                          <svg
                            className="w-4 h-4 mr-2"
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
                          <span className="font-semibold">
                            {currentModule.files.length} file(s) selected
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    onClick={addModule}
                    className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    disabled={!currentModule.title.trim()}
                  >
                    <svg
                      className="w-6 h-6 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Module to Course
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Added Modules */}
          {modules.length > 0 && (
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
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
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Course Modules ({modules.length})
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Review and manage your course structure
                  </p>
                </div>
              </div>

              <div className="grid gap-6">
                {modules.map((module, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 shadow-md">
                            {index + 1}
                          </div>
                          <h4 className="font-bold text-xl text-gray-900">
                            {module.title}
                          </h4>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-start">
                            <svg
                              className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                              />
                            </svg>
                            <div>
                              <p className="font-semibold text-gray-700 mb-1">
                                Topics:
                              </p>
                              <p className="text-gray-600 leading-relaxed">
                                {module.topics
                                  .filter((t) => t.trim())
                                  .join(" • ")}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6">
                            <div className="flex items-center">
                              <svg
                                className="w-5 h-5 text-red-600 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                {module.classVideos.length} videos
                              </span>
                            </div>
                            <div className="flex items-center">
                              <svg
                                className="w-5 h-5 text-green-600 mr-2"
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
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                {module.files.length} files
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeModule(index)}
                        className="ml-4 w-10 h-10 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl transition-all duration-200"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <Button
              type="submit"
              disabled={
                loading ||
                !courseData.title.trim() ||
                !courseData.description.trim()
              }
              className="flex-1 sm:flex-none sm:px-12 h-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin w-6 h-6 border-3 border-white border-t-transparent rounded-full mr-3"></div>
                  Creating Course...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-3"
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
                  Create Course
                </div>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 sm:flex-none sm:px-8 h-16 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold text-lg rounded-2xl transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
