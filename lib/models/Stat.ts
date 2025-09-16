import mongoose, { Document, Schema } from 'mongoose';

// Interface for Stat document
export interface IStat extends Document {
  id: number;
  number: string;
  label: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Stat Schema
const StatSchema = new Schema<IStat>({
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  number: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  label: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true,
  collection: 'stats'
});

// Indexes
StatSchema.index({ label: 'text', description: 'text' });

// Ensure virtual fields are serialized
StatSchema.set('toJSON', {
  virtuals: true
});

const Stat = mongoose.models.Stat || mongoose.model<IStat>('Stat', StatSchema);

export default Stat;