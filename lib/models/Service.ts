import mongoose, { Document, Schema } from 'mongoose';

// Interface for Service document
export interface IService extends Document {
  id: number;
  icon: string;
  title: string;
  description: string;
  features: string[];
  popular: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Service Schema
const ServiceSchema = new Schema<IService>({
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true
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
  },
  features: {
    type: [String],
    required: true,
    validate: {
      validator: function(features: string[]) {
        return features.length > 0 && features.length <= 10;
      },
      message: 'Features array must contain 1-10 items'
    }
  },
  popular: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true,
  collection: 'services'
});

// Indexes
ServiceSchema.index({ popular: -1 });
ServiceSchema.index({ title: 'text', description: 'text' });

// Virtual for feature count
ServiceSchema.virtual('featureCount').get(function() {
  return this.features.length;
});

// Ensure virtual fields are serialized
ServiceSchema.set('toJSON', {
  virtuals: true
});

const Service = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);

export default Service;
export { Service };

