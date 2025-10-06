import { Button } from "@/components/ui/button";

interface ProgramsHeaderProps {
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  onFilterChange?: (filter: string) => void;
  activeFilter?: string;
}

export default function ProgramsHeader({
  title = "সময়োপযোগী প্রোগ্রামসমূহ",
  subtitle = "Choose from our comprehensive course programs designed for your success",
  showFilters = true,
  onFilterChange,
  activeFilter = "all",
}: ProgramsHeaderProps) {
  const filters = [
    { id: "all", label: "All Programs", icon: "🎯" },
    { id: "admission", label: "Admission", icon: "🎓" },
    { id: "academic", label: "Academic", icon: "📚" },
    { id: "test", label: "Model Test", icon: "📝" },
    { id: "revision", label: "Revision", icon: "🔄" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      {/* Main Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
      </div>

      {/* Filter Buttons */}
      {showFilters && (
        <div className="flex flex-wrap justify-center gap-3">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              onClick={() => onFilterChange?.(filter.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeFilter === filter.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                  : "border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
              }`}
            >
              <span className="mr-2">{filter.icon}</span>
              {filter.label}
            </Button>
          ))}
        </div>
      )}

      {/* Stats Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
          <div className="text-2xl font-bold text-blue-600">50+</div>
          <div className="text-sm text-blue-800">Total Courses</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
          <div className="text-2xl font-bold text-green-600">1000+</div>
          <div className="text-sm text-green-800">Students Enrolled</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
          <div className="text-2xl font-bold text-purple-600">95%</div>
          <div className="text-sm text-purple-800">Success Rate</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
          <div className="text-2xl font-bold text-orange-600">24/7</div>
          <div className="text-sm text-orange-800">Support Available</div>
        </div>
      </div>
    </div>
  );
}
