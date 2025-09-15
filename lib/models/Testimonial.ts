import { Schema, model, models } from "mongoose";

const TestimonialSchema = new Schema(
  {
    author: { type: String, required: true },
    quote: { type: String, required: true },
    source: { type: String },
    avatarUrl: { type: String },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export const Testimonial = models.Testimonial || model("Testimonial", TestimonialSchema);

