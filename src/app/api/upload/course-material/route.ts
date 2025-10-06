import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// POST /api/upload/course-material - Upload course materials
export async function POST(request: NextRequest) {
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

    // Check if user has permission to upload course materials
    if (!["instructor", "admin", "developer"].includes(token.role as string)) {
      return NextResponse.json(
        { success: false, message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // For now, redirect to the main upload endpoint
    // This can be expanded later for course-specific material handling
    return NextResponse.json(
      { success: false, message: "Please use the main upload endpoint" },
      { status: 501 }
    );
  } catch (error) {
    console.error("Error uploading course material:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
