import { Schema, model, models } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String },
    contentMD: { type: String, required: true },
    tags: { type: [String], default: [] },
    country: { type: [String], default: [] },
    author: { type: String, required: true },
    coverUrl: { type: String },
    publishedAt: { type: Date },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
  },
  { timestamps: true }
);

export const Post = models.Post || model("Post", PostSchema);

