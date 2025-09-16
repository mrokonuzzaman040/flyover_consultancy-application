import mongoose, { Document, Schema } from 'mongoose';

// Interface for StudyAbroadStep document
export interface IStudyAbroadStep extends Document {
  id: number;
  icon: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// StudyAbroadStep Schema
const StudyAbroadStepSchema = new Schema<IStudyAbroadStep>({
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
  }
}, {
  timestamps: true,
  collection: 'studyAbroadSteps'
});

// Indexes
StudyAbroadStepSchema.index({ id: 1 });
StudyAbroadStepSchema.index({ title: 'text', description: 'text' });

// Ensure virtual fields are serialized
StudyAbroadStepSchema.set('toJSON', {
  virtuals: true
});

const StudyAbroadStep = mongoose.models.StudyAbroadStep || mongoose.model<IStudyAbroadStep>('StudyAbroadStep', StudyAbroadStepSchema);

export default StudyAbroadStep;