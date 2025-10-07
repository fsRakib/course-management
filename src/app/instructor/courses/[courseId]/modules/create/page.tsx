"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Course {
  _id: string;
  title: string;
  description: string;
}

interface CreateModulePageProps {
  params: {
    courseId: string;
  };
}

export default function CreateModulePage({ params }: CreateModulePageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const courseId = params.courseId;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    topics: [] as string[],
    classVideos: [] as string[],
    files: [] as string[],
  });
  const [newTopic, setNewTopic] = useState("");
  const [newVideo, setNewVideo] = useState("");
  const [newFile, setNewFile] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }

    if (session?.user?.role !== "instructor") {
      router.push("/");
      return;
    }

    if (courseId) {
      fetchCourse();
    }
  }, [session, status, router, courseId]);

  const fetchCourse = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data.course);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTopic = () => {
    if (newTopic.trim() && !formData.topics.includes(newTopic.trim())) {
      setFormData((prev) => ({
        ...prev,
        topics: [...prev.topics, newTopic.trim()],
      }));
      setNewTopic("");
    }
  };

  const handleRemoveTopic = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index),
    }));
  };

  const handleAddVideo = () => {
    if (newVideo.trim() && !formData.classVideos.includes(newVideo.trim())) {
      setFormData((prev) => ({
        ...prev,
        classVideos: [...prev.classVideos, newVideo.trim()],
      }));
      setNewVideo("");
    }
  };

  const handleRemoveVideo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      classVideos: prev.classVideos.filter((_, i) => i !== index),
    }));
  };

  const handleAddFile = () => {
    if (newFile.trim() && !formData.files.includes(newFile.trim())) {
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, newFile.trim()],
      }));
      setNewFile("");
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Module title is required");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/courses/${courseId}/modules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/instructor/courses");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to create module");
      }
    } catch (error) {
      console.error("Error creating module:", error);
      alert("Failed to create module");
    } finally {
      setSaving(false);
    }
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

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-lg text-red-600">Course Not Found</div>
          <p className="text-gray-600 mt-2">
            The requested course could not be found.
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
            <h1 className="text-3xl font-bold text-gray-900">Create Module</h1>
            <p className="text-gray-600 mt-2">Course: {course.title}</p>
          </div>
          <Button
            onClick={() => router.push("/instructor/courses")}
            variant="outline"
          >
            Back to Courses
          </Button>
        </div>

        {/* Form */}
        <Card className="max-w-4xl mx-auto">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Module Title */}
              <div>
                <Label htmlFor="title">Module Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter module title"
                  required
                />
              </div>

              {/* Topics */}
              <div>
                <Label>Topics</Label>
                <div className="space-y-3">
                  {/* Add Topic */}
                  <div className="flex space-x-2">
                    <Input
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      placeholder="Add a topic"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTopic();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleAddTopic}
                      disabled={!newTopic.trim()}
                    >
                      Add Topic
                    </Button>
                  </div>

                  {/* Topics List */}
                  <div className="space-y-2">
                    {formData.topics.map((topic, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded"
                      >
                        <span className="text-sm">{topic}</span>
                        <Button
                          type="button"
                          onClick={() => handleRemoveTopic(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Class Videos */}
              <div>
                <Label>Class Videos (URLs)</Label>
                <div className="space-y-3">
                  {/* Add Video */}
                  <div className="flex space-x-2">
                    <Input
                      value={newVideo}
                      onChange={(e) => setNewVideo(e.target.value)}
                      placeholder="Add video URL"
                      type="url"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddVideo();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleAddVideo}
                      disabled={!newVideo.trim()}
                    >
                      Add Video
                    </Button>
                  </div>

                  {/* Videos List */}
                  <div className="space-y-2">
                    {formData.classVideos.map((video, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded"
                      >
                        <span className="text-sm truncate">{video}</span>
                        <Button
                          type="button"
                          onClick={() => handleRemoveVideo(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Files */}
              <div>
                <Label>Files (URLs)</Label>
                <div className="space-y-3">
                  {/* Add File */}
                  <div className="flex space-x-2">
                    <Input
                      value={newFile}
                      onChange={(e) => setNewFile(e.target.value)}
                      placeholder="Add file URL"
                      type="url"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddFile();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleAddFile}
                      disabled={!newFile.trim()}
                    >
                      Add File
                    </Button>
                  </div>

                  {/* Files List */}
                  <div className="space-y-2">
                    {formData.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded"
                      >
                        <span className="text-sm truncate">{file}</span>
                        <Button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-6">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {saving ? "Creating..." : "Create Module"}
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push("/instructor/courses")}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
