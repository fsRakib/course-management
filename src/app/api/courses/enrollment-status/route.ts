import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Course } from "@/models";
import { getToken } from "next-auth/jwt";

// GET /api/courses/enrollment-status - Check enrollment status for courses
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

    // Only students can check enrollment status
    if (token.role !== "student") {
      return NextResponse.json(
        {
          success: false,
          message: "Only students can check enrollment status",
        },
        { status: 403 }
      );
    }

    await dbConnect();

    const studentId = token.sub;
    const { searchParams } = new URL(request.url);
    const courseIds = searchParams.get("courseIds")?.split(",") || [];

    if (courseIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "No course IDs provided" },
        { status: 400 }
      );
    }

    // Find courses where the student is enrolled
    const enrolledCourses = await Course.find({
      _id: { $in: courseIds },
      students: studentId,
    }).select("_id");

    const enrollmentStatus = courseIds.reduce((acc, courseId) => {
      acc[courseId] = enrolledCourses.some(
        (course) => course._id.toString() === courseId
      );
      return acc;
    }, {} as Record<string, boolean>);

    return NextResponse.json(
      {
        success: true,
        enrollmentStatus,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking enrollment status:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
