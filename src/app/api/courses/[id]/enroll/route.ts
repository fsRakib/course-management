import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Course, User } from "@/models";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

// POST /api/courses/[id]/enroll - Enroll student in a course
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

    // Only students can enroll in courses
    if (token.role !== "student") {
      return NextResponse.json(
        { success: false, message: "Only students can enroll in courses" },
        { status: 403 }
      );
    }

    await dbConnect();

    const { id: courseId } = await params;
    const studentId = token.sub;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json(
        { success: false, message: "Invalid course ID" },
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

    // Check if student is already enrolled
    const isAlreadyEnrolled = course.students.some(
      (id: mongoose.Types.ObjectId) => id.toString() === studentId
    );

    if (isAlreadyEnrolled) {
      return NextResponse.json(
        { success: false, message: "You are already enrolled in this course" },
        { status: 400 }
      );
    }

    // Add student to course
    course.students.push(new mongoose.Types.ObjectId(studentId));
    await course.save();

    // Also add course to student's enrolledCourses
    student.enrolledCourses = student.enrolledCourses || [];
    if (
      !student.enrolledCourses.some(
        (id: mongoose.Types.ObjectId) => id.toString() === courseId
      )
    ) {
      student.enrolledCourses.push(new mongoose.Types.ObjectId(courseId));
      await student.save();
    }

    // Return success response with course details
    const updatedCourse = await Course.findById(courseId)
      .populate("instructor", "name email")
      .populate("students", "name email");

    return NextResponse.json(
      {
        success: true,
        message: "Successfully enrolled in the course",
        course: updatedCourse,
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

// DELETE /api/courses/[id]/enroll - Unenroll student from a course
export async function DELETE(
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

    // Only students can unenroll from courses
    if (token.role !== "student") {
      return NextResponse.json(
        { success: false, message: "Only students can unenroll from courses" },
        { status: 403 }
      );
    }

    await dbConnect();

    const { id: courseId } = await params;
    const studentId = token.sub;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json(
        { success: false, message: "Invalid course ID" },
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

    // Check if student is enrolled
    const isEnrolled = course.students.some(
      (id: mongoose.Types.ObjectId) => id.toString() === studentId
    );

    if (!isEnrolled) {
      return NextResponse.json(
        { success: false, message: "You are not enrolled in this course" },
        { status: 400 }
      );
    }

    // Remove student from course
    course.students = course.students.filter(
      (id: mongoose.Types.ObjectId) => id.toString() !== studentId
    );
    await course.save();

    // Also remove course from student's enrolledCourses
    const student = await User.findById(studentId);
    if (student && student.enrolledCourses) {
      student.enrolledCourses = student.enrolledCourses.filter(
        (id: mongoose.Types.ObjectId) => id.toString() !== courseId
      );
      await student.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully unenrolled from the course",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unenrolling student:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
