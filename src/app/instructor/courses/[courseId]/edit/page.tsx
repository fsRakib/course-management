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
  image?: string;
  features: string[];
  price?: number;
  enrollmentType: "offline" | "online" | "combo";
  startDate?: string;
}

interface EditCoursePageProps {
  params: {
    courseId: string;
  };
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const courseId = params.courseId;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    features: [] as string[],
    price: "",
    enrollmentType: "online" as "offline" | "online" | "combo",
    startDate: "",
  });
  const [newFeature, setNewFeature] = useState("");

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
        const courseData = data.course;
        setCourse(courseData);
        setFormData({
          title: courseData.title || "",
          description: courseData.description || "",
          image: courseData.image || "",
          features: courseData.features || [],
          price: courseData.price?.toString() || "",
          enrollmentType: courseData.enrollmentType || "online",
          startDate: courseData.startDate
            ? new Date(courseData.startDate).toISOString().split("T")[0]
            : "",
        });
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

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Title and description are required");
      return;
    }

    try {
      setSaving(true);
      const submitData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : undefined,
        startDate: formData.startDate || undefined,
      };

      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        router.push("/instructor/courses");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course");
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
            <p className="text-gray-600 mt-2">Update your course information</p>
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
              {/* Title */}
              <div>
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter course title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Enter course description"
                  rows={4}
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <Label htmlFor="image">Course Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  placeholder="Enter image URL"
                  type="url"
                />
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="price">Price (optional)</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="Enter price"
                  type="number"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Enrollment Type */}
              <div>
                <Label htmlFor="enrollmentType">Enrollment Type</Label>
                <select
                  id="enrollmentType"
                  value={formData.enrollmentType}
                  onChange={(e) =>
                    handleInputChange("enrollmentType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="combo">Combo</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <Label htmlFor="startDate">Start Date (optional)</Label>
                <Input
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  type="date"
                />
              </div>

              {/* Features */}
              <div>
                <Label>Course Features</Label>
                <div className="space-y-3">
                  {/* Add Feature */}
                  <div className="flex space-x-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a course feature"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleAddFeature}
                      disabled={!newFeature.trim()}
                    >
                      Add
                    </Button>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded"
                      >
                        <span className="text-sm">{feature}</span>
                        <Button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
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
                  {saving ? "Updating..." : "Update Course"}
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
