import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ResultModel from "../models/Result";

// MongoDB Connection
const MONGODB_URI =
  // process.env.MONGODB_URI || "mongodb://localhost:27017/autism-db";
  "mongodb://localhost:27017/autism-db";

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI, { dbName: "autism-db" });
}

// POST API to save detection results
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { uid, email, autismCategory, results: body } = await req.json();

    // Ensure required `form` fields exist
    if (
      !body.form ||
      typeof body.form.prediction !== "number" ||
      typeof body.form.confidence !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid data: 'form' fields are required" },
        { status: 400 }
      );
    }

    const existingResult = await ResultModel.findOne({ userId: uid });
    if (existingResult) {
      return NextResponse.json(
        { error: "User has already submitted data" },
        { status: 400 }
      );
    }

    // Default empty values for optional fields
    const resultData = {
      form: body.form,
      autismCategory: autismCategory,
      video: body.video || { prediction: null, confidence: null },
      images: body.images || [],
      userId: uid,
      userEmail: email,
    };

    console.log(resultData);

    // Save to database
    const newResult = new ResultModel(resultData);
    await newResult.save();

    return NextResponse.json(
      { message: "Data saved successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
