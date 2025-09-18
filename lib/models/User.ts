import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["USER", "SUPPORT", "ADMIN"], 
      default: "USER" 
    },
    emailVerified: { type: Date, default: null },
    image: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index for faster queries
UserSchema.index({ role: 1 });

export const User = models.User || model("User", UserSchema);