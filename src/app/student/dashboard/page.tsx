"use client";"use client";



import { useSession } from "next-auth/react";import { useSession } from "next-auth/react";

import { useEffect, useState } from "react";import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";import { Button } from "@/components/ui/button";

import CourseCard from "@/components/CourseCard";import CourseCard from "@/components/CourseCard";

import ProgramsHeader from "@/components/ProgramsHeader";import ProgramsHeader from "@/components/ProgramsHeader";



interface Course {interface Course {

  _id: string;  _id: string;

  title: string;  title: string;

  description: string;  description: string;

  image?: string;  image?: string;

  features: string[];  features: string[];

  price?: number;  price?: number;

  enrollmentType: "offline" | "online" | "combo";  enrollmentType: "offline" | "online" | "combo";

  startDate?: string;  startDate?: string;

  modules: Array<{  modules: Array<{

    _id: string;    _id: string;

    title: string;    title: string;

    topics: string[];    topics: string[];

    classVideos: string[];    classVideos: string[];

    files: string[];    files: string[];

  }>;  }>;

}}



interface UploadedFile {interface UploadedFile {

  _id: string;  _id: string;

  filename: string;  filename: string;

  originalName: string;  originalName: string;

  fileType: "video" | "pdf" | "document" | "image";  fileType: "video" | "pdf" | "document" | "image";

  fileUrl: string;  fileUrl: string;

  description?: string;  description?: string;

  fileSize?: number;  fileSize?: number;

  uploadedBy: {  uploadedBy: {

    name: string;    name: string;

    email: string;    email: string;

  };  };

  course?: {  course?: {

    title: string;    title: string;

  };  };

  createdAt: string;  createdAt: string;

}}



export default function StudentDashboard() {export default function StudentDashboard() {

  const { data: session, status } = useSession();  const { data: session, status } = useSession();

  const [courses, setCourses] = useState<Course[]>([]);  const [courses, setCourses] = useState<Course[]>([]);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const [loading, setLoading] = useState(true);  const [loading, setLoading] = useState(true);

  const [filesLoading, setFilesLoading] = useState(true);  const [filesLoading, setFilesLoading] = useState(true);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [selectedModule, setSelectedModule] = useState<number | null>(null);  const [selectedModule, setSelectedModule] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<"courses" | "files">("courses");  const [activeTab, setActiveTab] = useState<"courses" | "files">("courses");

  const [activeFilter, setActiveFilter] = useState<string>("all");  const [activeFilter, setActiveFilter] = useState<string>("all");



  useEffect(() => {  useEffect(() => {

    const fetchCourses = async () => {    const fetchCourses = async () => {

      try {      try {

        const response = await fetch("/api/courses");        const response = await fetch("/api/courses");

        if (response.ok) {        if (response.ok) {

          const data = await response.json();          const data = await response.json();

          // Transform courses to include additional properties needed for CourseCard          // Transform courses to include additional properties needed for CourseCard

          const transformedCourses = (data.courses || []).map((course: any) => ({          const transformedCourses = (data.courses || []).map((course: any) => ({

            ...course,            ...course,

            features: [            features: [

              `${course.modules?.length || 0} modules included`,              `${course.modules?.length || 0} modules included`,

              "Expert instructors and quality content",              "Expert instructors and quality content",

              "Interactive learning experience",              "Interactive learning experience",

              "24/7 student support available",              "24/7 student support available",

              "Certificate upon completion",              "Certificate upon completion",

              "Lifetime access to materials"              "Lifetime access to materials"

            ],            ],

            enrollmentType: "online" as const,            enrollmentType: "online" as const,

            price: Math.floor(Math.random() * 5000) + 1000, // Random price for demo            price: Math.floor(Math.random() * 5000) + 1000, // Random price for demo

            startDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),            startDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),

          }));          }));

          setCourses(transformedCourses);          setCourses(transformedCourses);

        }        }

      } catch (error) {      } catch (error) {

        console.error("Error fetching courses:", error);        console.error("Error fetching courses:", error);

      } finally {      } finally {

        setLoading(false);        setLoading(false);

      }      }

    };    };



    const fetchFiles = async () => {    const fetchFiles = async () => {

      try {      try {

        const response = await fetch("/api/upload?isPublic=true");        const response = await fetch("/api/upload?isPublic=true");

        if (response.ok) {        if (response.ok) {

          const data = await response.json();          const data = await response.json();

          setUploadedFiles(data.files || []);          setUploadedFiles(data.files || []);

        }        }

      } catch (error) {      } catch (error) {

        console.error("Error fetching files:", error);        console.error("Error fetching files:", error);

      } finally {      } finally {

        setFilesLoading(false);        setFilesLoading(false);

      }      }

    };    };



    if (session) {    if (session) {

      fetchCourses();      fetchCourses();

      fetchFiles();      fetchFiles();

    }    }

  }, [session]);  }, [session]);



  // Filter courses based on active filter  if (status === "loading") {

  const filteredCourses = courses.filter(course => {    return (

    if (activeFilter === "all") return true;      <div className="min-h-screen flex items-center justify-center">

    if (activeFilter === "admission") return course.title.toLowerCase().includes("admission");        <div className="text-lg">Loading...</div>

    if (activeFilter === "academic") return course.title.toLowerCase().includes("academic");      </div>

    if (activeFilter === "test") return course.title.toLowerCase().includes("test");    );

    if (activeFilter === "revision") return course.title.toLowerCase().includes("revision");  }

    return true;

  });  // Filter courses based on active filter

  const filteredCourses = courses.filter(course => {

  const handleEnroll = (courseId: string) => {    if (activeFilter === "all") return true;

    // Handle enrollment logic here    if (activeFilter === "admission") return course.title.toLowerCase().includes("admission");

    console.log("Enrolling in course:", courseId);    if (activeFilter === "academic") return course.title.toLowerCase().includes("academic");

    alert("Enrollment feature coming soon!");    if (activeFilter === "test") return course.title.toLowerCase().includes("test");

  };    if (activeFilter === "revision") return course.title.toLowerCase().includes("revision");

    return true;

  const handleViewDetails = (courseId: string) => {  });

    const course = courses.find(c => c._id === courseId);

    setSelectedCourse(course || null);  const handleEnroll = (courseId: string) => {

  };    // Handle enrollment logic here

    console.log("Enrolling in course:", courseId);

  if (status === "loading") {    alert("Enrollment feature coming soon!");

    return (  };

      <div className="min-h-screen flex items-center justify-center">

        <div className="text-lg">Loading...</div>  const handleViewDetails = (courseId: string) => {

      </div>    const course = courses.find(c => c._id === courseId);

    );    setSelectedCourse(course || null);

  }  };



  return (  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Programs Header */}        {/* Programs Header */}

        <ProgramsHeader        <ProgramsHeader

          title="Available Course Programs"          title="Available Course Programs"

          subtitle={`Welcome back, ${session?.user?.name}! Explore our comprehensive course offerings designed for your academic success.`}          subtitle={`Welcome back, ${session?.user?.name}! Explore our comprehensive course offerings designed for your academic success.`}

          showFilters={true}          showFilters={true}

          onFilterChange={setActiveFilter}          onFilterChange={setActiveFilter}

          activeFilter={activeFilter}          activeFilter={activeFilter}

        />        />



        {/* Tab Navigation */}        {/* Tab Navigation */}

        <div className="bg-white rounded-2xl shadow-lg mb-8 p-6">        <div className="bg-white rounded-2xl shadow-lg mb-8 p-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>            <div>

              <h2 className="text-2xl font-bold text-gray-900">              <h2 className="text-2xl font-bold text-gray-900">

                My Learning Dashboard                My Learning Dashboard

              </h2>              </h2>

              <p className="text-gray-600 mt-1">              <p className="text-gray-600 mt-1">

                Manage your courses and learning materials                Manage your courses and learning materials

              </p>              </p>

            </div>            </div>

            <div className="flex bg-gray-100 rounded-xl p-1">            <div className="flex bg-gray-100 rounded-xl p-1">

              <button              <button

                onClick={() => setActiveTab("courses")}                onClick={() => setActiveTab("courses")}

                className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${                className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${

                  activeTab === "courses"                  activeTab === "courses"

                    ? "bg-white text-blue-600 shadow-sm"                    ? "bg-white text-blue-600 shadow-sm"

                    : "text-gray-600 hover:text-blue-600"                    : "text-gray-600 hover:text-blue-600"

                }`}                }`}

              >              >

                Courses ({courses.length})                Courses ({courses.length})

              </button>              </button>

              <button              <button

                onClick={() => setActiveTab("files")}                onClick={() => setActiveTab("files")}

                className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${                className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${

                  activeTab === "files"                  activeTab === "files"

                    ? "bg-white text-blue-600 shadow-sm"                    ? "bg-white text-blue-600 shadow-sm"

                    : "text-gray-600 hover:text-blue-600"                    : "text-gray-600 hover:text-blue-600"

                }`}                }`}

              >              >

                Materials ({uploadedFiles.length})                Materials ({uploadedFiles.length})

              </button>              </button>

            </div>            </div>

          </div>          </div>

        </div>        </div>



        {/* Course Content */}        {/* Course Content */}

        {activeTab === "courses" ? (        {activeTab === "courses" ? (

          <div>          <div>

            {loading ? (            {loading ? (

              <div className="min-h-[400px] flex items-center justify-center">              <div className="min-h-[400px] flex items-center justify-center">

                <div className="text-center">                <div className="text-center">

                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>

                  <div className="text-lg text-gray-600">Loading courses...</div>                  <div className="text-lg text-gray-600">Loading courses...</div>

                </div>                </div>

              </div>              </div>

            ) : filteredCourses.length === 0 ? (            ) : filteredCourses.length === 0 ? (

              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

                <div className="text-6xl mb-4">📚</div>                <div className="text-6xl mb-4">📚</div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Courses Found</h3>                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Courses Found</h3>

                <p className="text-gray-600 mb-6">                <p className="text-gray-600 mb-6">

                  {activeFilter === "all"                   {activeFilter === "all" 

                    ? "No courses are available yet. Check back later for new courses."                    ? "No courses are available yet. Check back later for new courses."

                    : `No courses found for "${activeFilter}" category. Try a different filter.`                    : `No courses found for "${activeFilter}" category. Try a different filter.`

                  }                  }

                </p>                </p>

                <Button onClick={() => setActiveFilter("all")} variant="outline">                <Button onClick={() => setActiveFilter("all")} variant="outline">

                  View All Courses                  View All Courses

                </Button>                </Button>

              </div>              </div>

            ) : (            ) : (

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {filteredCourses.map((course) => (                {filteredCourses.map((course) => (

                  <CourseCard                  <CourseCard

                    key={course._id}                    key={course._id}

                    course={course}                    course={course}

                    onEnroll={handleEnroll}                    onEnroll={handleEnroll}

                    onViewDetails={handleViewDetails}                    onViewDetails={handleViewDetails}

                  />                  />

                ))}                ))}

              </div>              </div>

            )}            )}

          </div>

            {/* Course Details Modal */}        ) : (

            {selectedCourse && (          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">            {/* Course List */}

                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">            <div className="lg:col-span-2">

                  <div className="p-6 border-b border-gray-200">              <div className="bg-white rounded-lg shadow-sm p-6">

                    <div className="flex justify-between items-start">                <h2 className="text-2xl font-bold text-gray-900 mb-6">

                      <div>                  My Courses

                        <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.title}</h2>                </h2>

                        <p className="text-gray-600 mt-2">{selectedCourse.description}</p>

                      </div>                {loading ? (

                      <Button                   <div className="text-center py-8">

                        variant="outline"                     <div className="text-gray-500">Loading courses...</div>

                        onClick={() => setSelectedCourse(null)}                  </div>

                        className="ml-4"                ) : courses.length === 0 ? (

                      >                  <div className="text-center py-8">

                        ✕                    <div className="text-gray-500 mb-4">

                      </Button>                      No courses available yet.

                    </div>                    </div>

                  </div>                    <p className="text-sm text-gray-400">

                                        Check back later for new courses or contact your

                  <div className="p-6">                      instructor.

                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Modules</h3>                    </p>

                    <div className="space-y-3">                  </div>

                      {selectedCourse.modules.map((module, index) => (                ) : (

                        <div key={module._id} className="border rounded-lg">                  <div className="space-y-4">

                          <button                    {courses.map((course) => (

                            className={`w-full text-left p-4 font-medium transition-colors ${                      <div

                              selectedModule === index                        key={course._id}

                                ? "bg-blue-50 text-blue-700"                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${

                                : "text-gray-700 hover:bg-gray-50"                          selectedCourse?._id === course._id

                            }`}                            ? "border-indigo-500 bg-indigo-50"

                            onClick={() =>                            : "border-gray-200 hover:border-gray-300"

                              setSelectedModule(selectedModule === index ? null : index)                        }`}

                            }                        onClick={() => {

                          >                          setSelectedCourse(course);

                            Module {index + 1}: {module.title}                          setSelectedModule(null);

                          </button>                        }}

                          {selectedModule === index && (                      >

                            <div className="p-4 border-t bg-gray-50 space-y-4">                        <h3 className="text-lg font-semibold text-gray-900 mb-2">

                              {module.topics.length > 0 && (                          {course.title}

                                <div>                        </h3>

                                  <p className="font-medium text-sm text-gray-600 mb-2">Topics:</p>                        <p className="text-gray-600 text-sm mb-3">

                                  <ul className="text-sm text-gray-700 space-y-1">                          {course.description}

                                    {module.topics.map((topic, topicIndex) => (                        </p>

                                      <li key={topicIndex} className="flex items-start">                        <div className="flex items-center justify-between">

                                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>                          <span className="text-sm text-gray-500">

                                        {topic}                            {course.modules.length} modules

                                      </li>                          </span>

                                    ))}                          <Button

                                  </ul>                            size="sm"

                                </div>                            variant={

                              )}                              selectedCourse?._id === course._id

                            </div>                                ? "default"

                          )}                                : "outline"

                        </div>                            }

                      ))}                          >

                    </div>                            {selectedCourse?._id === course._id

                  </div>                              ? "Selected"

                </div>                              : "View Course"}

              </div>                          </Button>

            )}                        </div>

          </div>                      </div>

        ) : (                    ))}

          /* Files Tab */                  </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">                )}

            <h2 className="text-2xl font-bold text-gray-900 mb-6">              </div>

              Lecture Materials            </div>

            </h2>

            {/* Course Content */}

            {filesLoading ? (            <div className="lg:col-span-1">

              <div className="text-center py-8">              <div className="bg-white rounded-lg shadow-sm p-6">

                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>                <h2 className="text-xl font-bold text-gray-900 mb-4">

                <div className="text-gray-500">Loading files...</div>                  Course Content

              </div>                </h2>

            ) : uploadedFiles.length === 0 ? (

              <div className="text-center py-12">                {!selectedCourse ? (

                <div className="text-6xl mb-4">📁</div>                  <div className="text-center py-8">

                <div className="text-gray-500 mb-4">No lecture materials available yet.</div>                    <div className="text-gray-500">

                <p className="text-sm text-gray-400">                      Select a course to view content

                  Materials will appear here once your instructors upload them.                    </div>

                </p>                  </div>

              </div>                ) : (

            ) : (                  <div className="space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">                    <h3 className="font-semibold text-gray-900">

                {uploadedFiles.map((file) => (                      {selectedCourse.title}

                  <div key={file._id} className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow">                    </h3>

                    <div className="flex items-start justify-between mb-4">

                      <div className="flex items-center space-x-3">                    {/* Modules */}

                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${                    <div className="space-y-3">

                          file.fileType === "video" ? "bg-red-500" :                      {selectedCourse.modules.map((module, index) => (

                          file.fileType === "pdf" ? "bg-blue-500" :                        <div key={module._id} className="border rounded-lg">

                          file.fileType === "image" ? "bg-green-500" : "bg-gray-500"                          <button

                        }`}>                            className={`w-full text-left p-3 font-medium ${

                          {file.fileType === "video" ? "📹" :                              selectedModule === index

                           file.fileType === "pdf" ? "📄" :                                ? "bg-indigo-50 text-indigo-700"

                           file.fileType === "image" ? "🖼️" : "📋"}                                : "text-gray-700 hover:bg-gray-50"

                        </div>                            }`}

                        <div>                            onClick={() =>

                          <h3 className="font-semibold text-gray-900 line-clamp-2">                              setSelectedModule(

                            {file.originalName || file.filename}                                selectedModule === index ? null : index

                          </h3>                              )

                          {file.course && (                            }

                            <p className="text-sm text-blue-600">{file.course.title}</p>                          >

                          )}                            Module {index + 1}: {module.title}

                        </div>                          </button>

                      </div>

                    </div>                          {selectedModule === index && (

                            <div className="p-3 border-t bg-gray-50">

                    {file.description && (                              {/* Topics */}

                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">                              {module.topics.length > 0 && (

                        {file.description}                                <div className="mb-3">

                      </p>                                  <p className="font-medium text-sm text-gray-600 mb-2">

                    )}                                    Topics:

                                  </p>

                    <div className="space-y-2 text-sm text-gray-500 mb-4">                                  <ul className="text-sm text-gray-700 space-y-1">

                      <div className="flex justify-between">                                    {module.topics.map((topic, topicIndex) => (

                        <span>Type:</span>                                      <li

                        <span className="capitalize">{file.fileType}</span>                                        key={topicIndex}

                      </div>                                        className="flex items-start"

                      {file.fileSize && (                                      >

                        <div className="flex justify-between">                                        <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>

                          <span>Size:</span>                                        {topic}

                          <span>{(file.fileSize / 1024 / 1024).toFixed(2)} MB</span>                                      </li>

                        </div>                                    ))}

                      )}                                  </ul>

                      <div className="flex justify-between">                                </div>

                        <span>Uploaded:</span>                              )}

                        <span>{new Date(file.createdAt).toLocaleDateString()}</span>

                      </div>                              {/* Class Videos */}

                    </div>                              {module.classVideos.length > 0 && (

                                <div className="mb-3">

                    <Button                                  <p className="font-medium text-sm text-gray-600 mb-2">

                      className="w-full"                                    Class Videos:

                      onClick={() => window.open(file.fileUrl, "_blank")}                                  </p>

                    >                                  <div className="space-y-2">

                      {file.fileType === "video" ? "Watch Video" : "View/Download"}                                    {module.classVideos.map(

                    </Button>                                      (video, videoIndex) => (

                  </div>                                        <div

                ))}                                          key={videoIndex}

              </div>                                          className="flex items-center justify-between"

            )}                                        >

          </div>                                          <span className="text-sm text-gray-700 truncate">

        )}                                            Video {videoIndex + 1}

      </div>                                          </span>

    </div>                                          <Button size="sm" variant="outline">

  );                                            <a

}                                              href={video}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              Watch
                                            </a>
                                          </Button>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Files */}
                              {module.files.length > 0 && (
                                <div>
                                  <p className="font-medium text-sm text-gray-600 mb-2">
                                    Files:
                                  </p>
                                  <div className="space-y-2">
                                    {module.files.map((file, fileIndex) => (
                                      <div
                                        key={fileIndex}
                                        className="flex items-center justify-between"
                                      >
                                        <span className="text-sm text-gray-700 truncate">
                                          File {fileIndex + 1}
                                        </span>
                                        <Button size="sm" variant="outline">
                                          <a
                                            href={file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            Download
                                          </a>
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Files Tab */
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Lecture Materials
            </h2>

            {filesLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading files...</div>
              </div>
            ) : uploadedFiles.length === 0 ? (
              <div className="text-center py-8">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="text-gray-500 mb-4">
                  No files available yet.
                </div>
                <p className="text-sm text-gray-400">
                  Your instructors haven't uploaded any materials yet. Check
                  back later!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploadedFiles.map((file) => (
                  <div
                    key={file._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        {file.fileType === "video" && (
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
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
                                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m2-5a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        )}
                        {file.fileType === "pdf" && (
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <svg
                              className="w-4 h-4 text-blue-600"
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
                          </div>
                        )}
                        {file.fileType === "document" && (
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
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
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                        )}
                        {file.fileType === "image" && (
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <svg
                              className="w-4 h-4 text-purple-600"
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
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm truncate">
                            {file.originalName}
                          </h3>
                          <p className="text-xs text-gray-500 capitalize">
                            {file.fileType}
                          </p>
                        </div>
                      </div>
                    </div>

                    {file.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {file.description}
                      </p>
                    )}

                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Uploaded by:</span>
                        <span className="font-medium">
                          {file.uploadedBy.name}
                        </span>
                      </div>
                      {file.course && (
                        <div className="flex justify-between">
                          <span>Course:</span>
                          <span className="font-medium">
                            {file.course.title}
                          </span>
                        </div>
                      )}
                      {file.fileSize && (
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span>
                            {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Uploaded:</span>
                        <span>
                          {new Date(file.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t">
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => window.open(file.fileUrl, "_blank")}
                      >
                        {file.fileType === "video"
                          ? "Watch Video"
                          : "View/Download"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
