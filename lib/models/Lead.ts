import { Schema, model, models } from "mongoose";

const LeadSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    countryInterest: { type: [String], default: [] },
    serviceInterest: { type: [String], default: [] },
    message: { type: String },
    utmSource: { type: String },
    utmMedium: { type: String },
    utmCampaign: { type: String },
    source: { type: String },
    status: { type: String, enum: ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "CLOSED"], default: "NEW" },
  },
  { timestamps: true }
);

export const Lead = models.Lead || model("Lead", LeadSchema);

