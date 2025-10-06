"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Course {
  _id: string;
  title: string;
}

interface FileUploadProps {
  courses: Course[];
  onUploadSuccess: () => void;
}

export default function FileUploadComponent({
  courses,
  onUploadSuccess,
}: FileUploadProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    fileType: "video" as "video" | "pdf" | "document" | "image",
    description: "",
    courseId: "",
    isPublic: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Auto-detect file type based on mime type
      if (file.type.startsWith("video/")) {
        setUploadForm((prev) => ({ ...prev, fileType: "video" }));
      } else if (file.type === "application/pdf") {
        setUploadForm((prev) => ({ ...prev, fileType: "pdf" }));
      } else if (file.type.startsWith("image/")) {
        setUploadForm((prev) => ({ ...prev, fileType: "image" }));
      } else {
        setUploadForm((prev) => ({ ...prev, fileType: "document" }));
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("fileType", uploadForm.fileType);
      formData.append("description", uploadForm.description);
      formData.append("courseId", uploadForm.courseId);
      formData.append("isPublic", uploadForm.isPublic.toString());

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("File uploaded successfully!");
        setIsUploadDialogOpen(false);
        setSelectedFile(null);
        setUploadForm({
          fileType: "video",
          description: "",
          courseId: "",
          isPublic: true,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        onUploadSuccess();
      } else {
        alert(data.message || "Error uploading file");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case "video":
        return (
          <svg
            className="w-5 h-5 text-red-600"
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
        );
      case "pdf":
        return (
          <svg
            className="w-5 h-5 text-blue-600"
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
        );
      case "image":
        return (
          <svg
            className="w-5 h-5 text-purple-600"
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
        );
      default:
        return (
          <svg
            className="w-5 h-5 text-green-600"
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
        );
    }
  };

  const openUploadDialog = () => {
    setUploadForm({
      fileType: "video",
      description: "",
      courseId: "",
      isPublic: true,
    });
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsUploadDialogOpen(true);
  };

  return (
    <>
      <Button
        onClick={openUploadDialog}
        className="bg-green-600 hover:bg-green-700"
      >
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
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        Upload File
      </Button>

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Lecture Material</DialogTitle>
            <DialogDescription>
              Upload videos, PDFs, or documents for students to access
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* File Selection */}
            <div>
              <Label htmlFor="file-upload">Select File</Label>
              <Input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="video/*,application/pdf,.doc,.docx,.txt,image/*"
                className="mt-1"
              />
              {selectedFile && (
                <div className="mt-2 p-2 bg-gray-50 rounded flex items-center">
                  {getFileTypeIcon(uploadForm.fileType)}
                  <span className="ml-2 text-sm text-gray-700">
                    {selectedFile.name} (
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}
            </div>

            {/* File Type */}
            <div>
              <Label htmlFor="file-type">File Type</Label>
              <select
                id="file-type"
                value={uploadForm.fileType}
                onChange={(e) =>
                  setUploadForm({
                    ...uploadForm,
                    fileType: e.target.value as
                      | "video"
                      | "pdf"
                      | "document"
                      | "image",
                  })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
                <option value="document">Document</option>
                <option value="image">Image</option>
              </select>
            </div>

            {/* Course Selection */}
            <div>
              <Label htmlFor="course">Course (Optional)</Label>
              <select
                id="course"
                value={uploadForm.courseId}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, courseId: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">No specific course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={uploadForm.description}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, description: e.target.value })
                }
                placeholder="Add a description for this file..."
                rows={3}
                className="mt-1"
              />
            </div>

            {/* Public/Private */}
            <div className="flex items-center">
              <input
                id="is-public"
                type="checkbox"
                checked={uploadForm.isPublic}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, isPublic: e.target.checked })
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <Label
                htmlFor="is-public"
                className="ml-2 block text-sm text-gray-900"
              >
                Make this file public (visible to all students)
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUploadDialogOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
            >
              {uploading ? "Uploading..." : "Upload File"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
