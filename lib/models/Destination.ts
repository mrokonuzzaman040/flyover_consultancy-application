import mongoose, { Document, Schema } from 'mongoose';

// Interface for FAQ
export interface IFAQ {
  question: string;
  answer: string;
}

// Interface for University
export interface IUniversity {
  name: string;
  image?: string;
  ranking?: string;
  location?: string;
  courses?: string[];
}

// Interface for Destination document
export interface IDestination extends Document {
  slug: string;
  country: string;
  flag?: string;
  image?: string;
  description?: string;
  hero?: string;
  color?: string;
  students?: string;
  averageCost?: string;
  workRights?: string;
  popularCities?: string[];
  highlights?: string[];
  popularCourses?: string[];
  universities?: IUniversity[];
  overviewMD?: string;
  costsMD?: string;
  intakesMD?: string;
  visaMD?: string;
  scholarshipsMD?: string;
  faqs?: IFAQ[];
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>({
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id: false });

const UniversitySchema = new Schema<IUniversity>({
  name: { type: String, required: true },
  image: { type: String },
  ranking: { type: String },
  location: { type: String },
  courses: { type: [String], default: [] }
}, { _id: false });

const DestinationSchema = new Schema<IDestination>({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  flag: {
    type: String,
    trim: true
  },
  image: { type: String },
  description: { type: String },
  hero: { type: String },
  color: { type: String },
  students: { type: String },
  averageCost: { type: String },
  workRights: { type: String },
  popularCities: { type: [String], default: [] },
  highlights: { type: [String], default: [] },
  popularCourses: { type: [String], default: [] },
  universities: {
    type: [UniversitySchema],
    default: []
  },
  overviewMD: { type: String },
  costsMD: { type: String },
  intakesMD: { type: String },
  visaMD: { type: String },
  scholarshipsMD: { type: String },
  faqs: { type: [FAQSchema], default: [] }
}, {
  timestamps: true,
  collection: 'destinations'
});

// Pre-save hook to ensure slug is properly formatted
DestinationSchema.pre('save', function(next) {
  if (this.isModified('slug') || this.isNew) {
    this.slug = this.slug.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }
  next();
});

// Indexes
DestinationSchema.index({ country: 1 });
DestinationSchema.index({ country: 1, slug: 1 });
DestinationSchema.index({ 'universities.name': 1 });
DestinationSchema.index({ universities: -1 });
DestinationSchema.index({ students: -1 });

// Virtual for formatted country name
DestinationSchema.virtual('formattedCountry').get(function() {
  return this.country.charAt(0).toUpperCase() + this.country.slice(1);
});

// Virtual for display name (using country as the main name)
DestinationSchema.virtual('displayName').get(function() {
  return this.country;
});

// Virtual for total capacity
DestinationSchema.virtual('totalCapacity').get(function() {
  return this.universities?.reduce((total, uni) => {
    return total + (uni.courses ? uni.courses.length : 0);
  }, 0) || 0;
});

// Ensure virtual fields are serialized
DestinationSchema.set('toJSON', {
  virtuals: true
});

const Destination = mongoose.models.Destination || mongoose.model<IDestination>('Destination', DestinationSchema);

export default Destination;
export { Destination };

