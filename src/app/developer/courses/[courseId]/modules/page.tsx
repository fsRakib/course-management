"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  modules: Module[];
}

interface EditModulesPageProps {
  params: {
    courseId: string;
  };
}

export default function EditModulesPage({ params }: EditModulesPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const courseId = params.courseId;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newTopic, setNewTopic] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }

    if (session?.user?.role !== "developer") {
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

  const handleAddModule = async () => {
    if (!newModuleTitle.trim() || !course) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/courses/${courseId}/modules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newModuleTitle,
          topics: [],
          classVideos: [],
          files: [],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCourse(data.course);
        setNewModuleTitle("");
      }
    } catch (error) {
      console.error("Error adding module:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTopic = async (moduleIndex: number) => {
    if (!newTopic.trim() || !course) return;

    try {
      setSaving(true);
      const moduleId = course.modules[moduleIndex]._id;
      const response = await fetch(
        `/api/courses/${courseId}/modules/${moduleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topics: [...course.modules[moduleIndex].topics, newTopic],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCourse(data.course);
        setNewTopic("");
      }
    } catch (error) {
      console.error("Error adding topic:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveTopic = async (moduleIndex: number, topicIndex: number) => {
    if (!course) return;

    try {
      setSaving(true);
      const moduleId = course.modules[moduleIndex]._id;
      const updatedTopics = course.modules[moduleIndex].topics.filter(
        (_, index) => index !== topicIndex
      );

      const response = await fetch(
        `/api/courses/${courseId}/modules/${moduleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topics: updatedTopics,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCourse(data.course);
      }
    } catch (error) {
      console.error("Error removing topic:", error);
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

  if (!session || session.user?.role !== "developer") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-lg text-red-600">Access Denied</div>
          <p className="text-gray-600 mt-2">
            You don&apos;t have developer privileges.
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
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Course Modules
            </h1>
            <p className="text-gray-600 mt-2">Course: {course.title}</p>
          </div>
          <Button
            onClick={() => router.push("/developer/courses")}
            variant="outline"
          >
            Back to Courses
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add New Module */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Add New Module
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="moduleTitle">Module Title</Label>
                  <Input
                    id="moduleTitle"
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    placeholder="Enter module title"
                  />
                </div>
                <Button
                  onClick={handleAddModule}
                  disabled={!newModuleTitle.trim() || saving}
                  className="w-full"
                >
                  {saving ? "Adding..." : "Add Module"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Existing Modules */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {course.modules.map((module, moduleIndex) => (
                <Card key={module._id} className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Module {moduleIndex + 1}: {module.title}
                    </h3>
                    <Button
                      onClick={() =>
                        setSelectedModule(
                          selectedModule === moduleIndex ? null : moduleIndex
                        )
                      }
                      variant="outline"
                      size="sm"
                    >
                      {selectedModule === moduleIndex ? "Collapse" : "Expand"}
                    </Button>
                  </div>

                  {selectedModule === moduleIndex && (
                    <div className="space-y-4">
                      {/* Topics */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Topics
                        </h4>
                        <div className="space-y-2">
                          {module.topics.map((topic, topicIndex) => (
                            <div
                              key={topicIndex}
                              className="flex items-center justify-between bg-gray-50 p-3 rounded"
                            >
                              <span className="text-sm">{topic}</span>
                              <Button
                                onClick={() =>
                                  handleRemoveTopic(moduleIndex, topicIndex)
                                }
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>

                        {/* Add Topic */}
                        <div className="flex space-x-2 mt-3">
                          <Input
                            value={newTopic}
                            onChange={(e) => setNewTopic(e.target.value)}
                            placeholder="Enter new topic"
                            className="flex-1"
                          />
                          <Button
                            onClick={() => handleAddTopic(moduleIndex)}
                            disabled={!newTopic.trim() || saving}
                            size="sm"
                          >
                            Add Topic
                          </Button>
                        </div>
                      </div>

                      {/* Videos & Files Count */}
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Videos:</span>{" "}
                          {module.classVideos.length}
                        </div>
                        <div>
                          <span className="font-medium">Files:</span>{" "}
                          {module.files.length}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}

              {course.modules.length === 0 && (
                <Card className="p-12 text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No Modules Yet
                  </h3>
                  <p className="text-gray-600">
                    Start by adding your first module to this course.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
