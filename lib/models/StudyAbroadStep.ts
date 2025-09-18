import mongoose, { Document, Schema } from 'mongoose';

// Interface for StudyAbroadStep document
export interface IStudyAbroadStep extends Document {
  stepId: number;
  icon?: string;
  title: string;
  description: string;
  color?: string;
  bgColor?: string;
  textColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

// StudyAbroadStep Schema
const StudyAbroadStepSchema = new Schema<IStudyAbroadStep>({
  stepId: {
    type: Number,
    required: true,
    unique: true
  },
  icon: {
    type: String,
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
  color: {
    type: String,
    trim: true
  },
  bgColor: {
    type: String,
    trim: true
  },
  textColor: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'studyabroadsteps'
});

// Indexes
StudyAbroadStepSchema.index({ title: 'text', description: 'text' });

// Ensure virtual fields are serialized
StudyAbroadStepSchema.set('toJSON', {
  virtuals: true
});

const StudyAbroadStep = mongoose.models.StudyAbroadStep || mongoose.model<IStudyAbroadStep>('StudyAbroadStep', StudyAbroadStepSchema);

export default StudyAbroadStep;