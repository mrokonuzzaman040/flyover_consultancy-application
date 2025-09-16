import { Schema, model, models } from "mongoose";

export interface IInsight {
  _id?: string;
  id: number;
  category: string;
  categoryColor: string;
  author: string;
  authorRole: string;
  readTime: string;
  publishDate: string;
  title: string;
  excerpt: string;
  image: string;
  featured: boolean;
  views: string;
  likes: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const InsightSchema = new Schema<IInsight>(
  {
    id: { type: Number, required: true, unique: true },
    category: { type: String, required: true },
    categoryColor: { type: String, required: true },
    author: { type: String, required: true },
    authorRole: { type: String, required: true },
    readTime: { type: String, required: true },
    publishDate: { type: String, required: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    image: { type: String, required: true },
    featured: { type: Boolean, default: false },
    views: { type: String, default: "0" },
    likes: { type: String, default: "0" },
  },
  { timestamps: true }
);

export const Insight = models.Insight || model<IInsight>("Insight", InsightSchema);