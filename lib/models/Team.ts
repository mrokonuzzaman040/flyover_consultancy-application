import { Schema, model, models } from "mongoose";

const TeamSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, required: true },
    bio: { type: String, required: true },
    expertise: [{ type: String, required: true }],
    email: { type: String, required: true },
    linkedin: { type: String, default: '' },
    phone: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Index for faster queries
TeamSchema.index({ order: 1, createdAt: -1 });
TeamSchema.index({ isActive: 1 });

export const Team = models.Team || model("Team", TeamSchema);
export default Team;
