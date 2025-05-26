import { NextRequest, NextResponse } from "next/server";
import User from "../models/user";
import { connectDB } from "@/lib/mongodb";

// GET: Fetch all users
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const users = await User.find({});
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST: Create new user
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("Received user data:", body); // Debug log

    const { email, name, role = "user", firebaseUid } = body;

    if (!email || !name) {
      console.log("Missing required fields:", { email, name }); // Debug log
      return NextResponse.json(
        { error: "Missing required fields: email and name are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", existingUser); // Debug log
      return NextResponse.json(existingUser, { status: 200 });
    }

    // Create new user
    const newUser = await User.create({
      email,
      name,
      role,
      isEmailVerified: false,
      status: "active",
      lastLogin: new Date(),
      firebaseUid,
    });

    console.log("Created new user:", newUser); // Debug log
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error); // Debug log
    return NextResponse.json(
      {
        error: "Failed to create user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT: Update user role
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error); // Debug log
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
