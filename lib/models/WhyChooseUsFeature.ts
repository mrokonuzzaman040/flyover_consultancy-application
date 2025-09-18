import mongoose, { Document, Schema } from 'mongoose';

// Interface for WhyChooseUsFeature document
export interface IWhyChooseUsFeature extends Document {
  id: number;
  icon: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// WhyChooseUsFeature Schema
const WhyChooseUsFeatureSchema = new Schema<IWhyChooseUsFeature>({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  icon: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  }
}, {
  timestamps: true,
  collection: 'whychooseusfeatures'
});

// Indexes
WhyChooseUsFeatureSchema.index({ title: 'text', description: 'text' });

// Ensure virtual fields are serialized
WhyChooseUsFeatureSchema.set('toJSON', {
  virtuals: true
});

const WhyChooseUsFeature = mongoose.models.WhyChooseUsFeature || mongoose.model<IWhyChooseUsFeature>('WhyChooseUsFeature', WhyChooseUsFeatureSchema);

export default WhyChooseUsFeature;