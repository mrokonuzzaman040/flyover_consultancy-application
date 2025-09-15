import { Schema, model, models } from "mongoose";

const OfficeHourSchema = new Schema(
  {
    day: { type: String },
    open: { type: String },
    close: { type: String },
  },
  { _id: false }
);

const SocialSchema = new Schema(
  {
    platform: { type: String },
    url: { type: String },
  },
  { _id: false }
);

const ContactInfoSchema = new Schema(
  {
    address: { type: String },
    city: { type: String },
    country: { type: String },
    phones: { type: [String], default: [] },
    emails: { type: [String], default: [] },
    mapEmbedUrl: { type: String },
    officeHours: { type: [OfficeHourSchema], default: [] },
    socials: { type: [SocialSchema], default: [] },
  },
  { timestamps: true }
);

export const ContactInfo = models.ContactInfo || model("ContactInfo", ContactInfoSchema);

