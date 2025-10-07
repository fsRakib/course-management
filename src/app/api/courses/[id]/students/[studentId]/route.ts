import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Course, User } from "@/models";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

// DELETE /api/courses/[id]/students/[studentId] - Remove student from course (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; studentId: string }> }
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

    // Only admins can remove students from courses
    if (token.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Only admins can remove students from courses",
        },
        { status: 403 }
      );
    }

    await dbConnect();

    const { id: courseId, studentId } = await params;

    // Validate ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(studentId)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid course ID or student ID" },
        { status: 400 }
      );
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    // Check if student exists
    const student = await User.findById(studentId);
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    // Check if student is enrolled
    const isEnrolled = course.students.some(
      (id: mongoose.Types.ObjectId) => id.toString() === studentId
    );

    if (!isEnrolled) {
      return NextResponse.json(
        { success: false, message: "Student is not enrolled in this course" },
        { status: 400 }
      );
    }

    // Remove student from course
    course.students = course.students.filter(
      (id: mongoose.Types.ObjectId) => id.toString() !== studentId
    );
    await course.save();

    // Also remove course from student's enrolledCourses
    if (student.enrolledCourses) {
      student.enrolledCourses = student.enrolledCourses.filter(
        (id: mongoose.Types.ObjectId) => id.toString() !== courseId
      );
      await student.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: `Successfully removed ${student.name} from the course`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing student from course:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
