import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Course } from "@/models";
import { getToken } from "next-auth/jwt";

// POST /api/courses/[id]/modules - Add a module to a course
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    if (!["developer", "admin", "instructor"].includes(token.role as string)) {
      return NextResponse.json(
        { success: false, message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { title, topics, classVideos, files } = await request.json();

    if (!title) {
      return NextResponse.json(
        { success: false, message: "Module title is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const course = await Course.findById(params.id);

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    // Add new module
    const newModule = {
      title,
      topics: topics || [],
      classVideos: classVideos || [],
      files: files || [],
    };

    course.modules.push(newModule);
    await course.save();

    return NextResponse.json(
      {
        success: true,
        message: "Module added successfully",
        course,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding module:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
