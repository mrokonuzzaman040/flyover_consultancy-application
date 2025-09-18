import mongoose, { Document, Schema } from 'mongoose';

// Interface for EventRegistration document
export interface IEventRegistration extends Document {
  eventId: string;
  eventTitle: string;
  // User information
  fullName: string;
  email: string;
  phone: string;
  // Additional user details
  company?: string;
  jobTitle?: string;
  country?: string;
  city?: string;
  // Registration details
  registrationDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'attended' | 'no-show';
  // Event-specific information
  dietaryRequirements?: string;
  accessibilityNeeds?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  // Additional information
  howDidYouHear?: string;
  expectations?: string;
  questions?: string;
  // Payment information (if applicable)
  paymentStatus?: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentAmount?: number;
  paymentMethod?: string;
  paymentReference?: string;
  // Check-in information
  checkedInAt?: Date;
  checkedInBy?: string;
  // Notes
  notes?: string;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const EventRegistrationSchema = new Schema<IEventRegistration>({
  eventId: {
    type: String,
    required: true,
    ref: 'Event'
  },
  eventTitle: {
    type: String,
    required: true,
    trim: true
  },
  // User information
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  // Additional user details
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },
  jobTitle: {
    type: String,
    trim: true,
    maxlength: 100
  },
  country: {
    type: String,
    trim: true,
    maxlength: 50
  },
  city: {
    type: String,
    trim: true,
    maxlength: 50
  },
  // Registration details
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'attended', 'no-show'],
    default: 'pending'
  },
  // Event-specific information
  dietaryRequirements: {
    type: String,
    trim: true,
    maxlength: 200
  },
  accessibilityNeeds: {
    type: String,
    trim: true,
    maxlength: 200
  },
  emergencyContact: {
    name: { type: String, trim: true, maxlength: 100 },
    phone: { type: String, trim: true, maxlength: 20 },
    relationship: { type: String, trim: true, maxlength: 50 }
  },
  // Additional information
  howDidYouHear: {
    type: String,
    trim: true,
    maxlength: 100
  },
  expectations: {
    type: String,
    trim: true,
    maxlength: 500
  },
  questions: {
    type: String,
    trim: true,
    maxlength: 500
  },
  // Payment information
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number,
    min: 0
  },
  paymentMethod: {
    type: String,
    trim: true
  },
  paymentReference: {
    type: String,
    trim: true
  },
  // Check-in information
  checkedInAt: {
    type: Date
  },
  checkedInBy: {
    type: String,
    trim: true
  },
  // Notes
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  }
}, {
  timestamps: true,
  collection: 'event_registrations'
});

// Compound index to prevent duplicate registrations
EventRegistrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

// Indexes for efficient queries
EventRegistrationSchema.index({ eventId: 1 });
EventRegistrationSchema.index({ email: 1 });
EventRegistrationSchema.index({ status: 1 });
EventRegistrationSchema.index({ registrationDate: 1 });
EventRegistrationSchema.index({ fullName: 'text', email: 'text', company: 'text' });

// Virtual for registration age
EventRegistrationSchema.virtual('registrationAge').get(function() {
  return Math.floor((Date.now() - this.registrationDate.getTime()) / (1000 * 60 * 60 * 24));
});

// Virtual for is recent registration (within 24 hours)
EventRegistrationSchema.virtual('isRecent').get(function() {
  const age = Math.floor((Date.now() - this.registrationDate.getTime()) / (1000 * 60 * 60 * 24));
  return age < 1;
});

// Ensure virtual fields are serialized
EventRegistrationSchema.set('toJSON', {
  virtuals: true
});

// Pre-save middleware to update event title if not provided
EventRegistrationSchema.pre('save', async function(next) {
  if (!this.eventTitle && this.eventId) {
    try {
      const Event = mongoose.model('Event');
      const event = await Event.findById(this.eventId);
      if (event) {
        this.eventTitle = event.title;
      }
    } catch (error) {
      console.error('Error fetching event title:', error);
    }
  }
  next();
});

const EventRegistration = mongoose.models.EventRegistration || mongoose.model<IEventRegistration>('EventRegistration', EventRegistrationSchema);

export default EventRegistration;
export { EventRegistration };
