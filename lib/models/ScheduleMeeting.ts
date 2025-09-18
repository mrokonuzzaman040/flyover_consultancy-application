import mongoose, { Document, Schema } from 'mongoose';

// Interface for ScheduleMeeting document
export interface IScheduleMeeting extends Document {
  fullName: string;
  phoneNumber: string;
  email?: string;
  scheduledDateTime: Date;
  message?: string;
  preferredService?: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: Date;
  updatedAt: Date;
}

// ScheduleMeeting Schema
const ScheduleMeetingSchema = new Schema<IScheduleMeeting>({
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  email: {
    type: String,
    trim: true,
    maxlength: 100,
    lowercase: true
  },
  scheduledDateTime: {
    type: Date,
    required: true
  },
  message: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  preferredService: {
    type: String,
    trim: true,
    maxlength: 50,
    enum: ['study-consultation', 'application-support', 'visa-assistance', 'course-selection', 'general-inquiry', '']
  },
  urgency: {
    type: String,
    required: true,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'LOW'
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
    default: 'PENDING'
  }
}, {
  timestamps: true,
  collection: 'schedulemeetings'
});

// Indexes
ScheduleMeetingSchema.index({ scheduledDateTime: 1 });
ScheduleMeetingSchema.index({ status: 1 });
ScheduleMeetingSchema.index({ phoneNumber: 1 });
ScheduleMeetingSchema.index({ email: 1 });

// Ensure virtual fields are serialized
ScheduleMeetingSchema.set('toJSON', {
  virtuals: true
});

const ScheduleMeeting = mongoose.models.ScheduleMeeting || mongoose.model<IScheduleMeeting>('ScheduleMeeting', ScheduleMeetingSchema);

export default ScheduleMeeting;
