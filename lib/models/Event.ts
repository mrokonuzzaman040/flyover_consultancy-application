import mongoose, { Document, Schema } from 'mongoose';

// Interface for Event document
export interface IEvent extends Document {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  registrationLink: string;
  // Additional fields for detailed event management
  slug?: string;
  startAt?: Date;
  endAt?: Date;
  venue?: string;
  city?: string;
  bannerUrl?: string;
  status?: 'draft' | 'published' | 'cancelled' | 'completed';
  capacity?: number;
  seatsRemaining?: number;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  date: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  registrationLink: {
    type: String,
    required: true,
    trim: true
  },
  // Additional optional fields for detailed event management
  slug: { type: String, unique: true, lowercase: true, trim: true, sparse: true },
  startAt: { type: Date },
  endAt: { type: Date },
  venue: { type: String, trim: true },
  city: { type: String, trim: true },
  bannerUrl: { type: String, trim: true },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'published'
  },
  capacity: { type: Number, default: 0, min: 0 },
  seatsRemaining: { type: Number, default: 0, min: 0 }
}, {
  timestamps: true,
  collection: 'events'
});

// Pre-save middleware to generate slug from title if not provided
EventSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  
  // Parse date and time to create startAt if not provided
  if (!this.startAt && this.date && this.time) {
    try {
      const dateTimeString = `${this.date} ${this.time}`;
      this.startAt = new Date(dateTimeString);
    } catch (error) {
      console.error('Error parsing date and time:', error);
    }
  }
  
  next();
});

// Indexes
EventSchema.index({ date: 1, time: 1 });
EventSchema.index({ location: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ title: 'text', description: 'text', location: 'text' });

// Virtual for formatted date-time
EventSchema.virtual('formattedDateTime').get(function() {
  return `${this.date} at ${this.time}`;
});

// Virtual for event status based on date
EventSchema.virtual('isUpcoming').get(function() {
  if (this.startAt) {
    return this.startAt > new Date();
  }
  return true; // Default to upcoming if no startAt
});

// Ensure virtual fields are serialized
EventSchema.set('toJSON', {
  virtuals: true
});

const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
export { Event };

