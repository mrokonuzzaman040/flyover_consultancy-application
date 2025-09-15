import { Schema, model, models } from "mongoose";

const ResourceSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    contentMD: { type: String, required: true },
    tags: { type: [String], default: [] },
    category: { type: String },
    author: { type: String },
    coverUrl: { type: String },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export const Resource = models.Resource || model("Resource", ResourceSchema);

