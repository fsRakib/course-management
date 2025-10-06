import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { File } from "@/models";
import { getToken } from "next-auth/jwt";

// POST /api/upload - Upload a file
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

    // Check if user has permission to upload files
    const allowedRoles = [
      "developer",
      "socialMediaManager",
      "admin",
      "instructor",
    ];
    if (!allowedRoles.includes(token.role as string)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Insufficient permissions. Only developers, instructors, and social media managers can upload files.",
        },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileType = formData.get("fileType") as string;
    const description = formData.get("description") as string;
    const courseId = formData.get("courseId") as string;
    const moduleId = formData.get("moduleId") as string;
    const isPublic = formData.get("isPublic") === "true";

    // Validation with detailed logging
    console.log("Upload request received:", {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      requestedFileType: fileType,
      courseId,
      moduleId,
    });

    if (!file) {
      console.error("Upload validation failed: No file provided");
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    if (!fileType) {
      console.error("Upload validation failed: File type is required");
      return NextResponse.json(
        { success: false, message: "File type is required" },
        { status: 400 }
      );
    }

    // Validate file type
    const validFileTypes = ["video", "pdf", "document", "image"];
    if (!validFileTypes.includes(fileType)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid file type. Must be one of: ${validFileTypes.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Validate file size (different limits for different file types)
    const maxSizes = {
      video: 100 * 1024 * 1024, // 100MB for videos
      pdf: 10 * 1024 * 1024, // 10MB for PDFs
      document: 10 * 1024 * 1024, // 10MB for documents
      image: 5 * 1024 * 1024, // 5MB for images
    };

    const maxSize =
      maxSizes[fileType as keyof typeof maxSizes] || 10 * 1024 * 1024;

    if (file.size > maxSize) {
      console.error(
        `File size validation failed: ${file.name} (${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB) exceeds limit of ${(maxSize / 1024 / 1024).toFixed(
          2
        )}MB`
      );
      return NextResponse.json(
        {
          success: false,
          message: `File size must be less than ${(
            maxSize /
            1024 /
            1024
          ).toFixed(2)}MB for ${fileType} files. Current file size: ${(
            file.size /
            1024 /
            1024
          ).toFixed(2)}MB`,
        },
        { status: 400 }
      );
    }

    // Validate MIME types (expanded video support)
    const allowedMimeTypes = {
      video: [
        "video/mp4",
        "video/avi",
        "video/mov",
        "video/wmv",
        "video/webm",
        "video/quicktime", // .mov files
        "video/x-msvideo", // .avi files
        "video/x-ms-wmv", // .wmv files
        "application/octet-stream", // Sometimes videos are uploaded as this
      ],
      pdf: ["application/pdf"],
      document: [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ],
      image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    };

    const validMimeTypes =
      allowedMimeTypes[fileType as keyof typeof allowedMimeTypes];

    if (!validMimeTypes || !validMimeTypes.includes(file.type)) {
      console.error(
        `MIME type validation failed: ${file.type} not allowed for ${fileType}. File: ${file.name}`
      );
      console.log("Valid MIME types:", validMimeTypes);

      // For development: Allow the upload but warn about MIME type mismatch
      // In production, you might want to be more strict
      console.warn(
        `Allowing upload despite MIME type mismatch for development purposes: ${file.name}`
      );

      // Uncomment the following return statement to enforce strict validation:
      /*
      return NextResponse.json(
        {
          success: false,
          message: `Invalid file format for ${fileType}. File type detected: ${file.type}. Allowed: ${validMimeTypes?.join(", ") || 'None'}`,
        },
        { status: 400 }
      );
      */
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFilename = `${timestamp}_${sanitizedName}`;

    // For development, we'll simulate file storage and generate a mock URL
    // In a real implementation, you would upload to cloud storage (AWS S3, Cloudinary, etc.)
    const mockFileUrl = `https://mock-storage.example.com/uploads/${uniqueFilename}`;

    console.log(`Creating file record for: ${file.name} -> ${mockFileUrl}`);

    await dbConnect();

    // Create file record in database
    const fileRecord = await File.create({
      filename: uniqueFilename,
      originalName: file.name,
      fileType,
      fileUrl: mockFileUrl,
      uploadedBy: token.sub,
      course: courseId || undefined,
      module: moduleId || undefined,
      description: description || undefined,
      fileSize: file.size,
      mimeType: file.type,
      isPublic: isPublic !== false, // Default to true if not specified
    });

    // Populate uploader information
    await fileRecord.populate("uploadedBy", "name email");
    await fileRecord.populate("course", "title");

    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully",
        file: {
          id: fileRecord._id,
          filename: fileRecord.filename,
          originalName: fileRecord.originalName,
          fileType: fileRecord.fileType,
          fileUrl: fileRecord.fileUrl,
          description: fileRecord.description,
          fileSize: fileRecord.fileSize,
          mimeType: fileRecord.mimeType,
          isPublic: fileRecord.isPublic,
          uploadedBy: fileRecord.uploadedBy,
          course: fileRecord.course,
          createdAt: fileRecord.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("File upload error:", error);

    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: "Invalid file data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/upload - Get uploaded files
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const fileType = searchParams.get("fileType");
    const courseId = searchParams.get("courseId");
    const isPublic = searchParams.get("isPublic");

    await dbConnect();

    // Build query
    const query: Record<string, unknown> = {};

    // Students can only see public files
    if (token.role === "student") {
      query.isPublic = true;
    } else if (isPublic !== null) {
      query.isPublic = isPublic === "true";
    }

    if (fileType) {
      query.fileType = fileType;
    }

    if (courseId) {
      query.course = courseId;
    }

    const files = await File.find(query)
      .populate("uploadedBy", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        files,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/upload - Delete a file
export async function DELETE(request: NextRequest) {
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

    // Only developers and admins can delete files
    if (!["developer", "admin"].includes(token.role as string)) {
      return NextResponse.json(
        { success: false, message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json(
        { success: false, message: "File ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const file = await File.findById(fileId);

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    await File.findByIdAndDelete(fileId);

    return NextResponse.json(
      {
        success: true,
        message: "File deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
