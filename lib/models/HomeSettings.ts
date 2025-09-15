import { Schema, model, models } from "mongoose";

const ButtonSchema = new Schema(
  {
    label: { type: String },
    href: { type: String },
  },
  { _id: false }
);

const SlideSchema = new Schema(
  {
    title: { type: String },
    subtitle: { type: String },
    imageUrl: { type: String },
    primaryButton: { type: ButtonSchema },
    secondaryButton: { type: ButtonSchema },
  },
  { _id: false }
);

const ItemSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    href: { type: String },
    icon: { type: String },
    name: { type: String },
    logoUrl: { type: String },
  },
  { _id: false }
);

const ContentSectionSchema = new Schema(
  {
    title: { type: String },
    contentMD: { type: String },
    imageUrl: { type: String },
    items: { type: [ItemSchema], default: [] },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const HomeSettingsSchema = new Schema(
  {
    heroSlider: { type: [SlideSchema], default: [] },
    transformSection: { type: ContentSectionSchema, default: {} },
    topInstitutionsSection: { type: ContentSectionSchema, default: {} },
    fiveStepsSection: { type: ContentSectionSchema, default: {} },
    whyChooseSection: { type: ContentSectionSchema, default: {} },
    awardsSection: { type: ContentSectionSchema, default: {} },
    partnersSection: { type: ContentSectionSchema, default: {} },
  },
  { timestamps: true }
);

export const HomeSettings = models.HomeSettings || model("HomeSettings", HomeSettingsSchema);

