import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Course } from "@/models";
import { getToken } from "next-auth/jwt";

// GET /api/courses - Get courses based on user role
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

    await dbConnect();

    let query = {};

    // Filter courses based on user role
    if (token.role === "instructor") {
      // Instructors see only their own courses
      query = { instructor: token.sub };
    } else if (token.role === "admin" || token.role === "manager") {
      // Admins and managers see all courses
      query = {};
    } else {
      // Students and other roles see all available courses
      query = {};
    }

    const courses = await Course.find(query)
      .populate("instructor", "name email")
      .populate("students", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        courses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course
export async function POST(request: NextRequest) {
  try {
    // Verify authentication and authorization
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

    // Check if user has permission to create courses
    if (!["developer", "admin", "instructor"].includes(token.role as string)) {
      return NextResponse.json(
        { success: false, message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { title, description } = await request.json();

    // Validation
    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: "Title and description are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Create new course
    const course = await Course.create({
      title,
      description,
      instructor: token.sub, // User ID from token
      modules: [],
    });

    // Populate instructor details
    await course.populate("instructor", "name email");

    return NextResponse.json(
      {
        success: true,
        message: "Course created successfully",
        course,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating course:", error);

    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: "Invalid input data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
