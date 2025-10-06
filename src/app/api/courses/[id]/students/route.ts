import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Course, User } from "@/models";
import { getToken } from "next-auth/jwt";

// GET /api/courses/[id]/students - Get enrolled students for a course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is instructor, admin, or developer
    if (!["instructor", "admin", "developer"].includes(token.role as string)) {
      return NextResponse.json(
        { success: false, message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    await dbConnect();

    const { id: courseId } = await params;

    // Find the course and populate instructor and students
    const course = await Course.findById(courseId)
      .populate("instructor", "name email")
      .populate("students", "name email createdAt");

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    // Check if the requesting user is the instructor of this course (unless admin/developer)
    if (
      token.role === "instructor" &&
      course.instructor?._id.toString() !== token.sub
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You can only view students of your own courses",
        },
        { status: 403 }
      );
    }

    // Format student data with mock progress and activity data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const studentsWithProgress = course.students.map((student: any) => ({
      _id: student._id,
      name: student.name,
      email: student.email,
      enrolledAt: student.createdAt,
      progress: Math.floor(Math.random() * 101), // Mock progress data
      lastActive: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(), // Mock last active
    }));

    return NextResponse.json(
      {
        success: true,
        course: {
          _id: course._id,
          title: course.title,
          description: course.description,
        },
        students: studentsWithProgress,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching course students:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/courses/[id]/students - Enroll a student in a course
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id: courseId } = await params;
    const { studentId } = await request.json();

    if (!studentId) {
      return NextResponse.json(
        { success: false, message: "Student ID is required" },
        { status: 400 }
      );
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    // Find the student
    const student = await User.findById(studentId);
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    // Check if student is already enrolled
    if (course.students.includes(studentId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Student is already enrolled in this course",
        },
        { status: 400 }
      );
    }

    // Add student to course
    course.students.push(studentId);
    await course.save();

    return NextResponse.json(
      {
        success: true,
        message: "Student enrolled successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error enrolling student:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
