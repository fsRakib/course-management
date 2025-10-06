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
      formData.append(
        "fileType",
        file.type.startsWith("video/") ? "video" : "document"
      );
      formData.append("courseId", courseId);
      formData.append("moduleId", moduleId);
      formData.append("isPublic", "false");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload ${file.name}`);
      }

      const result = await response.json();
      return result.file.downloadUrl;
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
      for (const module of modules) {
        const moduleResponse = await fetch(`/api/courses/${courseId}/modules`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: module.title,
            topics: module.topics.filter((topic) => topic.trim() !== ""),
          }),
        });

        if (!moduleResponse.ok) {
          throw new Error(`Failed to create module: ${module.title}`);
        }

        const moduleResult = await moduleResponse.json();
        const moduleId = moduleResult.module._id;

        // Upload videos and files
        if (module.classVideos.length > 0) {
          const videoUrls = await uploadFiles(
            module.classVideos,
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
        }

        if (module.files.length > 0) {
          const fileUrls = await uploadFiles(module.files, courseId, moduleId);

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
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Course
          </h2>
          <p className="text-gray-600">
            Fill in the details to create a new course for your students.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Course Basic Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Course Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                value={courseData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter course title"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Course Description *</Label>
              <Textarea
                id="description"
                value={courseData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter course description"
                className="w-full h-32"
                required
              />
            </div>
          </div>

          {/* Current Module */}
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-800">Add Module</h3>

            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="moduleTitle">Module Title</Label>
                <Input
                  id="moduleTitle"
                  value={currentModule.title}
                  onChange={(e) => handleModuleChange("title", e.target.value)}
                  placeholder="Enter module title"
                />
              </div>

              <div className="space-y-2">
                <Label>Topics</Label>
                {currentModule.topics.map((topic, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={topic}
                      onChange={(e) => updateTopic(index, e.target.value)}
                      placeholder={`Topic ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeTopic(index)}
                      disabled={currentModule.topics.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addTopic}>
                  Add Topic
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="videos">Class Videos</Label>
                  <Input
                    id="videos"
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={(e) => handleVideoUpload(e.target.files)}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  {currentModule.classVideos.length > 0 && (
                    <div className="text-sm text-gray-600">
                      {currentModule.classVideos.length} video(s) selected
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="files">Lecture Notes/Files</Label>
                  <Input
                    id="files"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {currentModule.files.length > 0 && (
                    <div className="text-sm text-gray-600">
                      {currentModule.files.length} file(s) selected
                    </div>
                  )}
                </div>
              </div>

              <Button type="button" onClick={addModule} variant="outline">
                Add Module to Course
              </Button>
            </div>
          </div>

          {/* Added Modules */}
          {modules.length > 0 && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Added Modules ({modules.length})
              </h3>
              {modules.map((module, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{module.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Topics:{" "}
                        {module.topics.filter((t) => t.trim()).join(", ")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {module.classVideos.length} videos,{" "}
                        {module.files.length} files
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeModule(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <Button
              type="submit"
              disabled={
                loading ||
                !courseData.title.trim() ||
                !courseData.description.trim()
              }
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? "Creating Course..." : "Create Course"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
