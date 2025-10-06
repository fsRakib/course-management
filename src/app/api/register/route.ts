import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: name, email, and password are required",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address",
        },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["user", "student", "socialMediaManager", "developer"];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists with this email address",
        },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || "user",
    });

    // Return success response (exclude password)
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Handle mongoose validation errors
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error: Please check your input data",
        },
        { status: 400 }
      );
    }

    // Handle duplicate key error (in case unique constraint fails)
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists with this email address",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}
