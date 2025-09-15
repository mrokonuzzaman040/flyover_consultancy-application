import { Schema, model, models } from "mongoose";

const EventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date },
    venue: { type: String },
    city: { type: String },
    bannerUrl: { type: String },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "draft",
    },
    capacity: { type: Number, default: 0, min: 0 },
    seatsRemaining: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export const Event = models.Event || model("Event", EventSchema);

