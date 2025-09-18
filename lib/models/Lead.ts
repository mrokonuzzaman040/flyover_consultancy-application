import { Schema, model, models } from "mongoose";

const LeadSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: false },
    phone: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v: string) {
          return /^\+[1-9]\d{1,14}$/.test(v.replace(/[\s-()]/g, ''));
        },
        message: 'Please enter a valid phone number with country code (e.g., +1234567890)'
      }
    },
    countryInterest: { type: [String], default: [] },
    serviceInterest: { type: [String], default: [] },
    message: { type: String },
    purpose: { type: String, enum: ["consultation", "enquiry"], default: "consultation" },
    utmSource: { type: String },
    utmMedium: { type: String },
    utmCampaign: { type: String },
    source: { type: String },
    status: { type: String, enum: ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "CLOSED"], default: "NEW" },
  },
  { timestamps: true }
);

export const Lead = models.Lead || model("Lead", LeadSchema);

