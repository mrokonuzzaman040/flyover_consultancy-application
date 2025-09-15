import { Schema, model, models } from "mongoose";

const ButtonSchema = new Schema(
  {
    label: { type: String },
    href: { type: String },
    isModal: { type: Boolean },
  },
  { _id: false }
);

const SlideSchema = new Schema(
  {
    // Backward compatible + richer shape used by Hero
    title: { type: String },
    subtitle: { type: String },
    headline: { type: String },
    sub: { type: String },
    imageUrl: { type: String },
    image: { type: String },
    primaryButton: { type: ButtonSchema },
    secondaryButton: { type: ButtonSchema },
  },
  { _id: false }
);

const ItemSchema = new Schema(
  {
    // Generic item used by multiple sections
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    href: { type: String },
    icon: { type: String },
    name: { type: String },
    logoUrl: { type: String },
    // Stats/supporting fields
    stat: { type: String },
    statLabel: { type: String },
    number: { type: String },
    step: { type: String },
    // Awards fields
    year: { type: String },
    organization: { type: String },
    color: { type: String },
    // Destination fields
    city: { type: String },
    category: { type: String },
    country: { type: String },
    universityLogoUrl: { type: String },
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
    servicesSection: { type: ContentSectionSchema, default: {} },
    destinationsSection: { type: ContentSectionSchema, default: {} },
    fiveStepsSection: { type: ContentSectionSchema, default: {} },
    whyChooseSection: { type: ContentSectionSchema, default: {} },
    awardsSection: { type: ContentSectionSchema, default: {} },
    partnersSection: { type: ContentSectionSchema, default: {} },
    successStoriesSection: { type: ContentSectionSchema, default: {} },
    insightsSection: { type: ContentSectionSchema, default: {} },
    upcomingEventsSection: { type: ContentSectionSchema, default: {} },
  },
  { timestamps: true }
);

export const HomeSettings = models.HomeSettings || model("HomeSettings", HomeSettingsSchema);
