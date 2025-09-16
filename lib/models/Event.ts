import mongoose, { Document, Schema } from 'mongoose';

// Interface for Event document
export interface IEvent extends Document {
  id?: number | string;
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
  // Enhanced event information
  eventType?: 'workshop' | 'seminar' | 'conference' | 'webinar' | 'fair' | 'exhibition' | 'networking' | 'other';
  category?: 'education' | 'career' | 'networking' | 'training' | 'information' | 'other';
  targetAudience?: string[];
  organizer?: string;
  organizerEmail?: string;
  organizerPhone?: string;
  price?: number;
  currency?: string;
  isFree?: boolean;
  registrationDeadline?: Date;
  maxAttendees?: number;
  minAttendees?: number;
  requirements?: string[];
  agenda?: Array<{
    time: string;
    title: string;
    description?: string;
    speaker?: string;
  }>;
  speakers?: Array<{
    name: string;
    title: string;
    company?: string;
    bio?: string;
    image?: string;
    socialLinks?: {
      linkedin?: string;
      twitter?: string;
      website?: string;
    };
  }>;
  tags?: string[];
  featured?: boolean;
  priority?: 'low' | 'medium' | 'high';
  locationDetails?: {
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    parking?: boolean;
    accessibility?: boolean;
    directions?: string;
  };
  onlineDetails?: {
    platform?: string;
    meetingLink?: string;
    meetingId?: string;
    password?: string;
    instructions?: string;
  };
  materials?: Array<{
    title: string;
    type: 'document' | 'video' | 'link' | 'other';
    url: string;
    description?: string;
  }>;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  id: {
    type: Schema.Types.Mixed,
    required: false,
    unique: true,
    sparse: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  date: {
    type: String,
    required: false,
    trim: true
  },
  time: {
    type: String,
    required: false,
    trim: true
  },
  location: {
    type: String,
    required: false,
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
    required: false,
    trim: true
  },
  registrationLink: {
    type: String,
    required: false,
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
  seatsRemaining: { type: Number, default: 0, min: 0 },
  // Enhanced event information
  eventType: {
    type: String,
    enum: ['workshop', 'seminar', 'conference', 'webinar', 'fair', 'exhibition', 'networking', 'other'],
    default: 'other'
  },
  category: {
    type: String,
    enum: ['education', 'career', 'networking', 'training', 'information', 'other'],
    default: 'education'
  },
  targetAudience: [{ type: String }],
  organizer: { type: String, trim: true },
  organizerEmail: { type: String, trim: true, lowercase: true },
  organizerPhone: { type: String, trim: true },
  price: { type: Number, min: 0, default: 0 },
  currency: { type: String, default: 'USD' },
  isFree: { type: Boolean, default: true },
  registrationDeadline: { type: Date },
  maxAttendees: { type: Number, min: 1 },
  minAttendees: { type: Number, min: 1, default: 1 },
  requirements: [{ type: String }],
  agenda: [{
    time: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    speaker: { type: String }
  }],
  speakers: [{
    name: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String },
    bio: { type: String },
    image: { type: String },
    socialLinks: {
      linkedin: { type: String },
      twitter: { type: String },
      website: { type: String }
    }
  }],
  tags: [{ type: String }],
  featured: { type: Boolean, default: false },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  locationDetails: {
    address: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    },
    parking: { type: Boolean, default: false },
    accessibility: { type: Boolean, default: false },
    directions: { type: String }
  },
  onlineDetails: {
    platform: { type: String },
    meetingLink: { type: String },
    meetingId: { type: String },
    password: { type: String },
    instructions: { type: String }
  },
  materials: [{
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['document', 'video', 'link', 'other'],
      required: true
    },
    url: { type: String, required: true },
    description: { type: String }
  }],
  socialMedia: {
    facebook: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    instagram: { type: String }
  }
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
EventSchema.index({ eventType: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ featured: 1 });
EventSchema.index({ priority: 1 });
EventSchema.index({ startAt: 1 });
EventSchema.index({ registrationDeadline: 1 });
EventSchema.index({ tags: 1 });
EventSchema.index({ title: 'text', description: 'text', location: 'text', organizer: 'text' });

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

