import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import ResultModel from "../models/Result";

// GET API to fetch results
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userId = req.headers.get("userId");

    // If userId is provided, fetch results for that user
    if (userId) {
      const results = await ResultModel.find({ userId }).sort({
        createdAt: -1,
      });
      if (!results || results.length === 0) {
        return NextResponse.json([], { status: 200 });
      }
      return NextResponse.json(results, { status: 200 });
    }

    // Otherwise fetch all results
    const results = await ResultModel.find().sort({ createdAt: -1 });
    if (!results) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json([], { status: 500 });
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
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    );
  }
}
