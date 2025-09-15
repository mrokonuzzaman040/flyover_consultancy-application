import { Schema, model, models } from "mongoose";

const OfficeSchema = new Schema(
  {
    city: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    mapEmbedUrl: { type: String },
  },
  { timestamps: true }
);

export const Office = models.Office || model("Office", OfficeSchema);

