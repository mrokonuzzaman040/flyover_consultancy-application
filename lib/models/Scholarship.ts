import { Schema, model, models } from "mongoose";

const ScholarshipSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    country: { type: [String], default: [] },
    deadline: { type: Date },
    amount: { type: String }, // Scholarship amount/value
    eligibility: { type: String }, // Eligibility criteria
    requirements: { type: String }, // Application requirements
    applicationProcess: { type: String }, // How to apply
    website: { type: String }, // Official website URL
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    // Keep legacy fields for backward compatibility
    eligibilityMD: { type: String },
    benefitsMD: { type: String },
  },
  { timestamps: true }
);

// Pre-save hook to ensure slug is properly formatted
ScholarshipSchema.pre('save', function(next) {
  if (this.isModified('slug') || this.isNew) {
    this.slug = this.slug.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }
  next();
});

// Indexes
ScholarshipSchema.index({ status: 1 });
ScholarshipSchema.index({ country: 1 });
ScholarshipSchema.index({ deadline: 1 });
ScholarshipSchema.index({ tags: 1 });

export const Scholarship = models.Scholarship || model("Scholarship", ScholarshipSchema);

