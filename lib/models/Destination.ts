import mongoose, { Document, Schema } from 'mongoose';

// Interface for FAQ
export interface IFAQ {
  question: string;
  answer: string;
}

// Interface for Destination document
export interface IDestination extends Document {
  id: number;
  name: string;
  flag: string;
  universities: number;
  students: number;
  // Additional fields for detailed destination info
  country?: string;
  slug?: string;
  hero?: string;
  overviewMD?: string;
  costsMD?: string;
  intakesMD?: string;
  visaMD?: string;
  scholarshipsMD?: string;
  popularCourses?: string[];
  faqs?: IFAQ[];
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>({
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id: false });

const DestinationSchema = new Schema<IDestination>({
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    index: true
  },
  flag: {
    type: String,
    required: true,
    trim: true
  },
  universities: {
    type: Number,
    required: true,
    min: 0
  },
  students: {
    type: Number,
    required: true,
    min: 0
  },
  // Additional optional fields for detailed destination info
  country: { type: String, trim: true },
  slug: { type: String, unique: true, lowercase: true, trim: true, sparse: true },
  hero: { type: String },
  overviewMD: { type: String },
  costsMD: { type: String },
  intakesMD: { type: String },
  visaMD: { type: String },
  scholarshipsMD: { type: String },
  popularCourses: { type: [String], default: [] },
  faqs: { type: [FAQSchema], default: [] }
}, {
  timestamps: true,
  collection: 'destinations'
});

// Pre-save middleware to generate slug from name if not provided
DestinationSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  if (!this.country && this.name) {
    this.country = this.name;
  }
  next();
});

// Indexes
DestinationSchema.index({ name: 'text', country: 'text' });
DestinationSchema.index({ universities: -1 });
DestinationSchema.index({ students: -1 });

// Virtual for total capacity
DestinationSchema.virtual('totalCapacity').get(function() {
  return this.universities * 1000; // Estimated capacity
});

// Ensure virtual fields are serialized
DestinationSchema.set('toJSON', {
  virtuals: true
});

const Destination = mongoose.models.Destination || mongoose.model<IDestination>('Destination', DestinationSchema);

export default Destination;
export { Destination };

