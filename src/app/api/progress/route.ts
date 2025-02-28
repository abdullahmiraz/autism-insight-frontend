/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ProgressModel from "../models/Progress";

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/autism-db";
// "mongodb://localhost:27017/autism-db";

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI, { dbName: "autism-db" });
}

// 📌 GET: Fetch user progress
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userId = req.headers.get("userId");
    // const autismCategory = parseInt(req.headers.get("autismCategory") || "1");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const progress = await ProgressModel.findOne({ userId });

    return NextResponse.json(progress || { progress: [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

// 📌 POST: Save/update progress
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, autismCategory, week, checkedIndexes } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let progressDoc = await ProgressModel.findOne({ userId, autismCategory });

    if (!progressDoc) {
      progressDoc = new ProgressModel({ userId, autismCategory, progress: [] });
    }

    // Update existing week or add new entry
    const existingWeek = progressDoc.progress.find(
      (entry: any) => entry.week === week
    );
    if (existingWeek) {
      existingWeek.checkedIndexes = checkedIndexes;
    } else {
      progressDoc.progress.push({ week, checkedIndexes });
    }

    await progressDoc.save();
    return NextResponse.json({ message: "Progress saved" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    );
  }
}
