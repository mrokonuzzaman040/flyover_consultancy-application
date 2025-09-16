import mongoose, { Document, Schema } from 'mongoose';

// Interface for Feature
export interface IFeature {
  icon: string;
  title: string;
  description: string;
}

// Interface for Process Step
export interface IProcessStep {
  step: string;
  title: string;
  description: string;
}

// Interface for Service document
export interface IService extends Document {
  name: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  sectionsMD: string[];
  features: IFeature[];
  benefits: string[];
  process: IProcessStep[];
  ctaLabel: string;
  ctaText: string;
  popular?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Feature Schema
const FeatureSchema = new Schema<IFeature>({
  icon: {
    type: String,
    required: true,
    trim: true
  },
  title: {
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
}, { _id: false });

// Process Step Schema
const ProcessStepSchema = new Schema<IProcessStep>({
  step: {
    type: String,
    required: true,
    trim: true
  },
  title: {
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
}, { _id: false });

// Service Schema
const ServiceSchema = new Schema<IService>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  subtitle: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  sectionsMD: {
    type: [String],
    required: true,
    validate: {
      validator: function(sections: string[]) {
        return sections.length > 0;
      },
      message: 'At least one section is required'
    }
  },
  features: {
    type: [FeatureSchema],
    required: true,
    validate: {
      validator: function(features: IFeature[]) {
        return features.length > 0 && features.length <= 10;
      },
      message: 'Features array must contain 1-10 items'
    }
  },
  benefits: {
    type: [String],
    required: true,
    validate: {
      validator: function(benefits: string[]) {
        return benefits.length > 0;
      },
      message: 'At least one benefit is required'
    }
  },
  process: {
    type: [ProcessStepSchema],
    required: true,
    validate: {
      validator: function(process: IProcessStep[]) {
        return process.length > 0;
      },
      message: 'At least one process step is required'
    }
  },
  ctaLabel: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  ctaText: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  popular: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'services'
});

// Indexes
ServiceSchema.index({ popular: -1 });
ServiceSchema.index({ name: 'text', title: 'text', description: 'text' });
ServiceSchema.index({ createdAt: -1 });

// Virtual properties
ServiceSchema.virtual('featureCount').get(function() {
  return this.features.length;
});

ServiceSchema.virtual('benefitCount').get(function() {
  return this.benefits.length;
});

ServiceSchema.virtual('processStepCount').get(function() {
  return this.process.length;
});

// Transform output
ServiceSchema.set('toJSON', {
  virtuals: true
});

// Pre-save middleware to generate slug if not provided
ServiceSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

const Service = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);

export default Service;
export { Service };

