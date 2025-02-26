import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ResultModel from "../models/Result";

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/autism-db";

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI, { dbName: "autism-db" });
}

// GET API to fetch user's progress data
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get the user's UID from the request headers (Assuming you set the token in Authorization header)
    const userId = req.headers.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the results for the logged-in user
    const results = await ResultModel.find({ userId });

    if (!results || results.length === 0) {
      return NextResponse.json({ error: "No results found" }, { status: 404 });
    }

    // Return the data for the user
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
