import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    description: string;
    image?: string;
    features: string[];
    price?: number;
    enrollmentType: "offline" | "online" | "combo";
    startDate?: string;
    modules?: Array<{
      _id: string;
      title: string;
      topics: string[];
      classVideos: string[];
      files: string[];
    }>;
  };
  isEnrolled?: boolean;
  onEnroll?: (courseId: string) => void;
  onUnenroll?: (courseId: string) => void;
  onViewDetails?: (courseId: string) => void;
  onAccessCourse?: (courseId: string) => void;
  isLoading?: boolean;
}

export default function CourseCard({
  course,
  isEnrolled = false,
  onEnroll,
  onUnenroll,
  onViewDetails,
  onAccessCourse,
  isLoading = false,
}: CourseCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 bg-white rounded-2xl overflow-hidden border-0 shadow-lg">
      {/* Course Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        {course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="text-center">
              <div className="text-4xl mb-2">📚</div>
              <div className="text-sm font-medium">Course Material</div>
            </div>
          </div>
        )}
        {course.price && !isEnrolled && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
            ৳{course.price}
          </div>
        )}
        {isEnrolled && (
          <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-white">
            Enrolled ✓
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Course Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>

        {/* Course Features */}
        <div className="space-y-2 mb-6">
          {course.features.slice(0, 4).map((feature, index) => (
            <div
              key={index}
              className="flex items-start space-x-2 text-sm text-gray-600"
            >
              <span className="text-green-500 font-bold text-xs mt-1">•</span>
              <span className="leading-relaxed">{feature}</span>
            </div>
          ))}
          {course.features.length > 4 && (
            <div className="text-sm text-gray-500 italic">
              +{course.features.length - 4} more features...
            </div>
          )}
        </div>

        {/* Course Metadata */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              course.enrollmentType === "online"
                ? "bg-blue-100 text-blue-700"
                : course.enrollmentType === "offline"
                ? "bg-green-100 text-green-700"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            {course.enrollmentType === "online"
              ? "Online"
              : course.enrollmentType === "offline"
              ? "Offline"
              : "Combo"}
          </span>
          {course.startDate && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              Starts: {new Date(course.startDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Course Stats */}
        {course.modules && (
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span>📚 {course.modules.length} modules</span>
            <span>
              🎥{" "}
              {course.modules.reduce(
                (acc, module) => acc + module.classVideos.length,
                0
              )}{" "}
              videos
            </span>
            <span>
              📄{" "}
              {course.modules.reduce(
                (acc, module) => acc + module.files.length,
                0
              )}{" "}
              files
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => onViewDetails?.(course._id)}
            variant="outline"
            className="flex-1 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
            disabled={isLoading}
          >
            Details
          </Button>

          {isEnrolled ? (
            <div className="flex-1 flex gap-2">
              <Button
                onClick={() => onAccessCourse?.(course._id)}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 shadow-md hover:shadow-lg transition-all"
                disabled={isLoading}
              >
                Access Course
              </Button>
              <Button
                onClick={() => onUnenroll?.(course._id)}
                variant="outline"
                className="px-3 border-red-300 text-red-600 hover:border-red-500 hover:text-red-700 transition-colors"
                disabled={isLoading}
                title="Unenroll from course"
              >
                ✕
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => onEnroll?.(course._id)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Enrolling..." : "Enroll Now"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
