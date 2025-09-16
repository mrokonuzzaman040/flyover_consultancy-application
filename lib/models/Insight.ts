import mongoose, { Document, Schema } from 'mongoose';

// Interface for Insight document
export interface IInsight extends Document {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  publishedAt: Date;
  category: string;
  readTime: string;
  tags: string[];
  // Additional fields for enhanced functionality
  categoryColor?: string;
  authorRole?: string;
  featured?: boolean;
  views?: number;
  likes?: number;
  slug?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InsightSchema = new Schema<IInsight>({
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  publishedAt: {
    type: Date,
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    index: true
  },
  readTime: {
    type: String,
    required: true,
    trim: true
  },
  tags: {
    type: [String],
    required: true,
    validate: {
      validator: function(tags: string[]) {
        return tags.length > 0 && tags.length <= 20;
      },
      message: 'Tags array must contain 1-20 items'
    }
  },
  // Additional optional fields
  categoryColor: { type: String, trim: true },
  authorRole: { type: String, trim: true },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0, min: 0 },
  likes: { type: Number, default: 0, min: 0 },
  slug: { type: String, unique: true, lowercase: true, trim: true, sparse: true }
}, {
  timestamps: true,
  collection: 'insights'
});

// Pre-save middleware to generate slug from title if not provided
InsightSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Indexes
InsightSchema.index({ publishedAt: -1 });
InsightSchema.index({ category: 1 });
InsightSchema.index({ featured: -1 });
InsightSchema.index({ tags: 1 });
InsightSchema.index({ author: 1 });
InsightSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });

// Virtual for reading time in minutes
InsightSchema.virtual('readTimeMinutes').get(function() {
  const match = this.readTime.match(/\d+/);
  return match ? parseInt(match[0]) : 5;
});

// Virtual for word count estimation
InsightSchema.virtual('wordCount').get(function() {
  return this.content ? this.content.split(/\s+/).length : 0;
});

// Ensure virtual fields are serialized
InsightSchema.set('toJSON', {
  virtuals: true
});

const Insight = mongoose.models.Insight || mongoose.model<IInsight>('Insight', InsightSchema);

export default Insight;
export { Insight };