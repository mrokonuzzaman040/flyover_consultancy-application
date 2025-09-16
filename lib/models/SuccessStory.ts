import mongoose, { Document, Schema } from 'mongoose';

// Interface for SuccessStory document
export interface ISuccessStory extends Document {
  id: number;
  name: string;
  image: string;
  university: string;
  course: string;
  country: string;
  testimonial: string;
  createdAt: Date;
  updatedAt: Date;
}

// SuccessStory Schema
const SuccessStorySchema = new Schema<ISuccessStory>({
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
    maxlength: 100
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  university: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    index: true
  },
  course: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  country: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    index: true
  },
  testimonial: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  }
}, {
  timestamps: true,
  collection: 'successStories'
});

// Indexes
SuccessStorySchema.index({ country: 1 });
SuccessStorySchema.index({ university: 1 });
SuccessStorySchema.index({ name: 'text', university: 'text', course: 'text', testimonial: 'text' });

// Ensure virtual fields are serialized
SuccessStorySchema.set('toJSON', {
  virtuals: true
});

const SuccessStory = mongoose.models.SuccessStory || mongoose.model<ISuccessStory>('SuccessStory', SuccessStorySchema);

export default SuccessStory;