import { Schema, model, models } from "mongoose";

const FeatureSchema = new Schema(
  {
    icon: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const ProcessSchema = new Schema(
  {
    step: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    image: { type: String },
    ctaLabel: { type: String },
    ctaText: { type: String },
    sectionsMD: { type: [String], default: [] },
    features: { type: [FeatureSchema], default: [] },
    benefits: { type: [String], default: [] },
    process: { type: [ProcessSchema], default: [] },
  },
  { timestamps: true }
);

export const Service = models.Service || model("Service", ServiceSchema);

