import { Schema, model, models } from "mongoose";

const ScholarshipSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    eligibilityMD: { type: String },
    benefitsMD: { type: String },
    deadline: { type: Date },
    country: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
  },
  { timestamps: true }
);

export const Scholarship = models.Scholarship || model("Scholarship", ScholarshipSchema);

