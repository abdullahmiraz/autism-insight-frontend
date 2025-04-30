import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ResultModel from "../models/Result";

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/autism-db";
  // "mongodb://localhost:27017/autism-db";

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI, { dbName: "autism-db" });
}

// GET API to fetch user's progress data
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const results = await ResultModel.find();

    if (!results || results.length === 0) {
      return NextResponse.json({ error: "No results found" }, { status: 404 });
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}


// DELETE API to remove a specific progress entry
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { id } = await req.json(); // Extract ID from request body
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const deletedEntry = await ResultModel.findByIdAndDelete(id);

    if (!deletedEntry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Entry deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting entry:", error);
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
  }
}
