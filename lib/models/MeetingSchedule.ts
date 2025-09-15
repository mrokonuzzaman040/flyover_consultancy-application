import { Schema, model, models } from "mongoose";

const MeetingScheduleSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    preferredDate: { type: String },
    preferredTime: { type: String },
    scheduledDateTime: { type: Date, required: true },
    message: { type: String },
    preferredService: { type: String },
    urgency: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], default: "LOW" },
    status: { type: String, enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"], default: "PENDING" },
  },
  { timestamps: true }
);

export const MeetingSchedule = models.MeetingSchedule || model("MeetingSchedule", MeetingScheduleSchema);

