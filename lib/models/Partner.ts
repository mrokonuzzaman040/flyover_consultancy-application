import mongoose, { Document, Schema } from 'mongoose';

// Interface for Partner document
export interface IPartner extends Document {
  id: number;
  name: string;
  category: string;
  country: string;
  logo: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

// Partner Schema
const PartnerSchema = new Schema<IPartner>({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  country: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  logo: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'partners'
});

// Indexes
PartnerSchema.index({ name: 'text' });
PartnerSchema.index({ name: 1 });

// Ensure virtual fields are serialized
PartnerSchema.set('toJSON', {
  virtuals: true
});

const Partner = mongoose.models.Partner || mongoose.model<IPartner>('Partner', PartnerSchema);

export default Partner;