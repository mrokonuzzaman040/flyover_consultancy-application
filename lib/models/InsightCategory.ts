import mongoose, { Document, Schema } from 'mongoose';

// Interface for InsightCategory document
export interface IInsightCategory extends Document {
  name: string;
  count: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

// InsightCategory Schema
const InsightCategorySchema = new Schema<IInsightCategory>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    unique: true
  },
  count: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'insightCategories'
});

// Pre-save middleware to generate slug from name
InsightCategorySchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Indexes
InsightCategorySchema.index({ name: 'text' });
InsightCategorySchema.index({ count: -1 });

// Ensure virtual fields are serialized
InsightCategorySchema.set('toJSON', {
  virtuals: true
});

const InsightCategory = mongoose.models.InsightCategory || mongoose.model<IInsightCategory>('InsightCategory', InsightCategorySchema);

export default InsightCategory;