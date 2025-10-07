import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Course } from "@/models";
import { getToken } from "next-auth/jwt";

// GET /api/courses/enrolled - Get enrolled courses for the current student
export async function GET(request: NextRequest) {
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

    // Only students can access their enrolled courses
    if (token.role !== "student") {
      return NextResponse.json(
        {
          success: false,
          message: "Only students can access enrolled courses",
        },
        { status: 403 }
      );
    }

    await dbConnect();

    const studentId = token.sub;

    // Find all courses where the student is enrolled
    const enrolledCourses = await Course.find({
      students: studentId,
    })
      .populate("instructor", "name email")
      .populate("students", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        courses: enrolledCourses,
        totalEnrolled: enrolledCourses.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
