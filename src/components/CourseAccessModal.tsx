import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";

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
}

interface CourseAccessModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseAccessModal({
  course,
  isOpen,
  onClose,
}: CourseAccessModalProps) {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "modules">(
    "overview"
  );

  if (!course) return null;

  const handleDownloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWatchVideo = (videoUrl: string) => {
    window.open(videoUrl, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                <p className="text-blue-100 mb-2">{course.description}</p>
                {course.instructor && (
                  <p className="text-blue-200 text-sm">
                    Instructor: {course.instructor.name}
                  </p>
                )}
              </div>
              <Button
                onClick={onClose}
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10"
              >
                ✕
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Course Overview
              </button>
              <button
                onClick={() => setActiveTab("modules")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "modules"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Modules ({course.modules.length})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Course Statistics
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {course.modules.length}
                      </div>
                      <div className="text-sm text-gray-600">Total Modules</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {course.modules.reduce(
                          (acc, module) => acc + module.classVideos.length,
                          0
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Video Lessons</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {course.modules.reduce(
                          (acc, module) => acc + module.files.length,
                          0
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Resources</div>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    What You'll Learn
                  </h3>
                  <div className="space-y-2">
                    {course.modules.slice(0, 5).map((module, index) => (
                      <div key={module._id} className="flex items-start gap-3">
                        <span className="text-green-500 font-bold mt-1">✓</span>
                        <span className="text-gray-700">{module.title}</span>
                      </div>
                    ))}
                    {course.modules.length > 5 && (
                      <div className="text-gray-500 text-sm italic">
                        +{course.modules.length - 5} more modules...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "modules" && (
              <div className="space-y-4">
                {selectedModule ? (
                  <div>
                    <Button
                      onClick={() => setSelectedModule(null)}
                      variant="outline"
                      className="mb-4"
                    >
                      ← Back to Modules
                    </Button>

                    <div>
                      <h3 className="text-xl font-bold mb-4">
                        {selectedModule.title}
                      </h3>

                      {/* Topics */}
                      {selectedModule.topics.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold mb-3">
                            📋 Topics Covered
                          </h4>
                          <div className="space-y-2">
                            {selectedModule.topics.map((topic, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <span className="text-blue-500 font-bold text-sm mt-1">
                                  •
                                </span>
                                <span className="text-gray-700">{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Videos */}
                      {selectedModule.classVideos.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold mb-3">
                            🎥 Class Videos
                          </h4>
                          <div className="space-y-3">
                            {selectedModule.classVideos.map((video, index) => (
                              <Card key={index} className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">
                                      Video {index + 1}
                                    </p>
                                    <p className="text-sm text-gray-600 truncate max-w-md">
                                      {video}
                                    </p>
                                  </div>
                                  <Button
                                    onClick={() => handleWatchVideo(video)}
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Watch
                                  </Button>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Files */}
                      {selectedModule.files.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">
                            📄 Course Materials
                          </h4>
                          <div className="space-y-3">
                            {selectedModule.files.map((file, index) => (
                              <Card key={index} className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">
                                      File {index + 1}
                                    </p>
                                    <p className="text-sm text-gray-600 truncate max-w-md">
                                      {file}
                                    </p>
                                  </div>
                                  <Button
                                    onClick={() =>
                                      handleDownloadFile(
                                        file,
                                        `file-${index + 1}`
                                      )
                                    }
                                    size="sm"
                                    variant="outline"
                                  >
                                    Download
                                  </Button>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {course.modules.map((module, index) => (
                      <Card
                        key={module._id}
                        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedModule(module)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-2">
                              Module {index + 1}: {module.title}
                            </h4>
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                              <span>📋 {module.topics.length} topics</span>
                              <span>🎥 {module.classVideos.length} videos</span>
                              <span>📄 {module.files.length} files</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Open Module →
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
