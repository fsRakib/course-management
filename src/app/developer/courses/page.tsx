"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  instructor?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function CoursesManagementPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  // Form states
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
  });

  const [moduleForm, setModuleForm] = useState({
    title: "",
    topics: "",
    classVideos: "",
    files: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

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

  const handleCreateCourse = async () => {
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseForm),
      });

      if (response.ok) {
        await fetchCourses();
        setIsCreateDialogOpen(false);
        setCourseForm({ title: "", description: "" });
      } else {
        const data = await response.json();
        alert(data.message || "Error creating course");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Error creating course");
    }
  };

  const handleEditCourse = async () => {
    if (!selectedCourse) return;

    try {
      const response = await fetch(`/api/courses/${selectedCourse._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseForm),
      });

      if (response.ok) {
        await fetchCourses();
        setIsEditDialogOpen(false);
        setSelectedCourse(null);
        setCourseForm({ title: "", description: "" });
      } else {
        const data = await response.json();
        alert(data.message || "Error updating course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Error updating course");
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCourses();
      } else {
        const data = await response.json();
        alert(data.message || "Error deleting course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Error deleting course");
    }
  };

  const handleAddModule = async () => {
    if (!selectedCourse) return;

    try {
      const moduleData = {
        title: moduleForm.title,
        topics: moduleForm.topics.split("\n").filter((topic) => topic.trim()),
        classVideos: moduleForm.classVideos
          .split("\n")
          .filter((video) => video.trim()),
        files: moduleForm.files.split("\n").filter((file) => file.trim()),
      };

      const response = await fetch(
        `/api/courses/${selectedCourse._id}/modules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(moduleData),
        }
      );

      if (response.ok) {
        await fetchCourses();
        setIsModuleDialogOpen(false);
        setSelectedCourse(null);
        setModuleForm({ title: "", topics: "", classVideos: "", files: "" });
      } else {
        const data = await response.json();
        alert(data.message || "Error adding module");
      }
    } catch (error) {
      console.error("Error adding module:", error);
      alert("Error adding module");
    }
  };

  const handleEditModule = async () => {
    if (!selectedCourse || !selectedModule) return;

    try {
      const moduleData = {
        title: moduleForm.title,
        topics: moduleForm.topics.split("\n").filter((topic) => topic.trim()),
        classVideos: moduleForm.classVideos
          .split("\n")
          .filter((video) => video.trim()),
        files: moduleForm.files.split("\n").filter((file) => file.trim()),
      };

      const response = await fetch(
        `/api/courses/${selectedCourse._id}/modules/${selectedModule._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(moduleData),
        }
      );

      if (response.ok) {
        await fetchCourses();
        setIsModuleDialogOpen(false);
        setSelectedCourse(null);
        setSelectedModule(null);
        setModuleForm({ title: "", topics: "", classVideos: "", files: "" });
      } else {
        const data = await response.json();
        alert(data.message || "Error updating module");
      }
    } catch (error) {
      console.error("Error updating module:", error);
      alert("Error updating module");
    }
  };

  const handleDeleteModule = async (courseId: string, moduleId: string) => {
    if (!confirm("Are you sure you want to delete this module?")) return;

    try {
      const response = await fetch(
        `/api/courses/${courseId}/modules/${moduleId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await fetchCourses();
      } else {
        const data = await response.json();
        alert(data.message || "Error deleting module");
      }
    } catch (error) {
      console.error("Error deleting module:", error);
      alert("Error deleting module");
    }
  };

  const openCreateDialog = () => {
    setCourseForm({ title: "", description: "" });
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (course: Course) => {
    setSelectedCourse(course);
    setCourseForm({ title: course.title, description: course.description });
    setIsEditDialogOpen(true);
  };

  const openModuleDialog = (course: Course, module?: Module) => {
    setSelectedCourse(course);
    if (module) {
      setSelectedModule(module);
      setModuleForm({
        title: module.title,
        topics: module.topics.join("\n"),
        classVideos: module.classVideos.join("\n"),
        files: module.files.join("\n"),
      });
    } else {
      setSelectedModule(null);
      setModuleForm({ title: "", topics: "", classVideos: "", files: "" });
    }
    setIsModuleDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Course Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage courses and modules for the platform
            </p>
          </div>
          <Button onClick={openCreateDialog}>
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Course
          </Button>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No courses yet
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your first course
              </p>
              <Button onClick={openCreateDialog}>
                Create Your First Course
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card
                key={course._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-600">
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
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      {course.modules.length} modules
                    </div>

                    {/* Modules List */}
                    {course.modules.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-900">
                          Modules:
                        </h4>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {course.modules.map((module, index) => (
                            <div
                              key={module._id}
                              className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                            >
                              <span className="truncate">
                                {index + 1}. {module.title}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    openModuleDialog(course, module)
                                  }
                                  className="h-6 px-2 text-xs"
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleDeleteModule(course._id, module._id)
                                  }
                                  className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                                >
                                  Del
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Course Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(course)}
                        >
                          Edit Course
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => openModuleDialog(course)}
                        >
                          Add Module
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCourse(course._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Course Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>
                Add a new course to the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={courseForm.title}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, title: e.target.value })
                  }
                  placeholder="Enter course title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={courseForm.description}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter course description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateCourse}>Create Course</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Course Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>Update course information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Course Title</Label>
                <Input
                  id="edit-title"
                  value={courseForm.title}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, title: e.target.value })
                  }
                  placeholder="Enter course title"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={courseForm.description}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter course description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditCourse}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Module Dialog */}
        <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedModule ? "Edit Module" : "Add New Module"}
              </DialogTitle>
              <DialogDescription>
                {selectedModule
                  ? "Update module information and content"
                  : `Add a new module to "${selectedCourse?.title}"`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="module-title">Module Title</Label>
                <Input
                  id="module-title"
                  value={moduleForm.title}
                  onChange={(e) =>
                    setModuleForm({ ...moduleForm, title: e.target.value })
                  }
                  placeholder="Enter module title"
                />
              </div>
              <div>
                <Label htmlFor="module-topics">Topics (one per line)</Label>
                <Textarea
                  id="module-topics"
                  value={moduleForm.topics}
                  onChange={(e) =>
                    setModuleForm({ ...moduleForm, topics: e.target.value })
                  }
                  placeholder="Topic 1&#10;Topic 2&#10;Topic 3"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="module-videos">
                  Class Videos (URLs, one per line)
                </Label>
                <Textarea
                  id="module-videos"
                  value={moduleForm.classVideos}
                  onChange={(e) =>
                    setModuleForm({
                      ...moduleForm,
                      classVideos: e.target.value,
                    })
                  }
                  placeholder="https://example.com/video1&#10;https://example.com/video2"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="module-files">Files (URLs, one per line)</Label>
                <Textarea
                  id="module-files"
                  value={moduleForm.files}
                  onChange={(e) =>
                    setModuleForm({ ...moduleForm, files: e.target.value })
                  }
                  placeholder="https://example.com/file1.pdf&#10;https://example.com/file2.doc"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsModuleDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={selectedModule ? handleEditModule : handleAddModule}
              >
                {selectedModule ? "Save Changes" : "Add Module"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
