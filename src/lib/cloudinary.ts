// Simple Cloudinary configuration for file uploads
// In a production environment, you would use actual Cloudinary credentials

import { v2 as cloudinary } from "cloudinary";

// For development, we'll create a mock implementation
// In production, you would configure this with real Cloudinary credentials:
/*
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
*/

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const uploadToCloudinary = async (file: File, _options: any = {}) => {
  // Mock implementation for development
  // In production, this would actually upload to Cloudinary

  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const mockUrl = `https://mock-cloudinary.com/uploads/${timestamp}_${sanitizedName}`;

  return {
    secure_url: mockUrl,
    public_id: `${timestamp}_${sanitizedName}`,
    bytes: file.size,
    format: file.type.split("/")[1],
    resource_type: file.type.startsWith("video/") ? "video" : "raw",
  };
};

export default cloudinary;
