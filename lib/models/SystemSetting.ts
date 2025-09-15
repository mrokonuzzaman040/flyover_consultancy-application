import { Schema, model, models } from "mongoose";

const SystemSettingSchema = new Schema(
  {
    siteName: { type: String },
    siteDescription: { type: String },
    adminEmail: { type: String },
    maxFileSize: { type: Number, default: 10 },
    allowedFileTypes: { type: [String], default: ["image/jpeg", "image/png", "image/gif", "application/pdf"] },
    enableRegistration: { type: Boolean, default: false },
    enableEmailVerification: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
    cloudinaryCloudName: { type: String },
    cloudinaryApiKey: { type: String },
    smtpHost: { type: String },
    smtpPort: { type: Number, default: 587 },
    smtpUser: { type: String },
  },
  { timestamps: true }
);

export const SystemSetting = models.SystemSetting || model("SystemSetting", SystemSettingSchema);

