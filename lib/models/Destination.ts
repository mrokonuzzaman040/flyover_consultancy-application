import { Schema, model, models } from "mongoose";

const FAQSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const DestinationSchema = new Schema(
  {
    country: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    hero: { type: String },
    overviewMD: { type: String },
    costsMD: { type: String },
    intakesMD: { type: String },
    visaMD: { type: String },
    scholarshipsMD: { type: String },
    popularCourses: { type: [String], default: [] },
    faqs: { type: [FAQSchema], default: [] },
  },
  { timestamps: true }
);

export const Destination = models.Destination || model("Destination", DestinationSchema);

