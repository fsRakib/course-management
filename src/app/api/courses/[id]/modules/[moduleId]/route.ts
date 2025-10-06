import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Course } from "@/models";
import { getToken } from "next-auth/jwt";

// PUT /api/courses/[id]/modules/[moduleId] - Update a module
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string } }
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

    // Find and update the module
    const moduleIndex = course.modules.findIndex(
      (module: any) => module._id.toString() === params.moduleId
    );

    if (moduleIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Module not found" },
        { status: 404 }
      );
    }

    course.modules[moduleIndex] = {
      ...course.modules[moduleIndex],
      title,
      topics: topics || [],
      classVideos: classVideos || [],
      files: files || [],
    };

    await course.save();

    return NextResponse.json(
      {
        success: true,
        message: "Module updated successfully",
        course,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating module:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id]/modules/[moduleId] - Delete a module
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string } }
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

    await dbConnect();

    const course = await Course.findById(params.id);

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    // Find and remove the module
    const moduleIndex = course.modules.findIndex(
      (module: any) => module._id.toString() === params.moduleId
    );

    if (moduleIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Module not found" },
        { status: 404 }
      );
    }

    course.modules.splice(moduleIndex, 1);
    await course.save();

    return NextResponse.json(
      {
        success: true,
        message: "Module deleted successfully",
        course,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting module:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
