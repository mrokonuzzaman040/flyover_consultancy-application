import mongoose, { Document, Schema } from 'mongoose';

// Interface for Award document
export interface IAward extends Document {
  id: number;
  image: string;
  title: string;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

// Award Schema
const AwardSchema = new Schema<IAward>({
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 10,
    index: true
  }
}, {
  timestamps: true,
  collection: 'awards'
});

// Indexes
AwardSchema.index({ year: -1 });
AwardSchema.index({ title: 'text' });

// Virtual for award age
AwardSchema.virtual('awardAge').get(function() {
  return new Date().getFullYear() - this.year;
});

// Ensure virtual fields are serialized
AwardSchema.set('toJSON', {
  virtuals: true
});

const Award = mongoose.models.Award || mongoose.model<IAward>('Award', AwardSchema);

export default Award;