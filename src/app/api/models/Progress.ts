import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // User Identifier
  autismCategory: { type: Number, required: true }, // 1 = Mild, 2 = Moderate, 3 = Extreme
  progress: [
    {
      week: { type: Number, required: true },
      checkedIndexes: [{ type: Number }], // Stores indexes of checked suggestions
    },
  ],
});

const ProgressModel =
  mongoose.models.Progress || mongoose.model("Progress", ProgressSchema);

export default ProgressModel;
