import mongoose, { Document, Schema } from "mongoose";

export interface IFile extends Document {
  filename: string;
  originalName: string;
  fileType: "video" | "pdf" | "document" | "image";
  fileUrl: string;
  uploadedBy: mongoose.Types.ObjectId;
  course?: mongoose.Types.ObjectId;
  module?: mongoose.Types.ObjectId;
  description?: string;
  fileSize?: number;
  mimeType: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FileSchema = new Schema<IFile>(
  {
    filename: {
      type: String,
      required: [true, "Filename is required"],
      trim: true,
    },
    originalName: {
      type: String,
      required: [true, "Original filename is required"],
      trim: true,
    },
    fileType: {
      type: String,
      enum: ["video", "pdf", "document", "image"],
      required: [true, "File type is required"],
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
      trim: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploader is required"],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    module: {
      type: Schema.Types.ObjectId,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    fileSize: {
      type: Number,
    },
    mimeType: {
      type: String,
      required: [true, "MIME type is required"],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
FileSchema.index({ uploadedBy: 1 });
FileSchema.index({ course: 1 });
FileSchema.index({ fileType: 1 });
FileSchema.index({ isPublic: 1 });

// Prevent model overwrite errors in Next.js
const File = mongoose.models.File || mongoose.model<IFile>("File", FileSchema);

export default File;
