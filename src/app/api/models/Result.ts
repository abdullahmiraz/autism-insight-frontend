import { Schema, model, models } from "mongoose";

const ResultSchema = new Schema(
  {
    form: {
      prediction: { type: Number },
      confidence: { type: Number },
    },
    video: {
      prediction: { type: Number, default: null },
      confidence: { type: Number, default: null },
    },
    images: [
      {
        prediction: { type: Number, default: null },
        confidence: { type: Number, default: null },
      },
    ],
    userId: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true },
    autismCategory: { type: Number, default: null },
  },
  { timestamps: true }
);

const ResultModel = models.Result || model("Result", ResultSchema);
export default ResultModel;
