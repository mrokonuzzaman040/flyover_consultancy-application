import mongoose, { Document, Schema } from 'mongoose';

// Interface for SuccessStory document
export interface ISuccessStory extends Document {
  storyId: number;
  rating: number;
  text: string;
  author: string;
  university: string;
  program: string;
  country: string;
  scholarship: string;
  year: string;
  avatar: string;
  flag: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

// SuccessStory Schema
const SuccessStorySchema = new Schema<ISuccessStory>({
  storyId: {
    type: Number,
    required: true,
    unique: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  author: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  university: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  program: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  country: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  scholarship: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  year: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10
  },
  avatar: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10
  },
  flag: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10
  },
  color: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  }
}, {
  timestamps: true,
  collection: 'successstories'
});

// Indexes
SuccessStorySchema.index({ country: 1 });
SuccessStorySchema.index({ university: 1 });
SuccessStorySchema.index({ author: 'text', university: 'text', program: 'text', text: 'text' });

// Ensure virtual fields are serialized
SuccessStorySchema.set('toJSON', {
  virtuals: true
});

const SuccessStory = mongoose.models.SuccessStory || mongoose.model<ISuccessStory>('SuccessStory', SuccessStorySchema);

export default SuccessStory;