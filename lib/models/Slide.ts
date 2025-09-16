import mongoose, { Document, Schema } from 'mongoose';

// Interface for button actions
export interface IButtonAction {
  label: string;
  href?: string;
  isModal?: boolean;
}

// Interface for Slide document
export interface ISlide extends Document {
  image: string;
  headline: string;
  sub: string;
  primary: IButtonAction;
  secondary: IButtonAction;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Button Action Schema
const ButtonActionSchema = new Schema<IButtonAction>({
  label: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  href: {
    type: String,
    trim: true,
    maxlength: 500
  },
  isModal: {
    type: Boolean,
    default: false
  }
}, {
  _id: false
});

// Slide Schema
const SlideSchema = new Schema<ISlide>({
  image: {
    type: String,
    required: true,
    trim: true
  },
  headline: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  sub: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  primary: {
    type: ButtonActionSchema,
    required: true
  },
  secondary: {
    type: ButtonActionSchema,
    required: true
  },
  order: {
    type: Number,
    required: true,
    default: 0,
    index: true
  },
  active: {
    type: Boolean,
    required: true,
    default: true
  }
}, {
  timestamps: true,
  collection: 'slides'
});

// Validation: Either href or isModal should be set for button actions
SlideSchema.pre('save', function(next) {
  const validateButton = (button: IButtonAction) => {
    if (!button.href && !button.isModal) {
      throw new Error('Button action must have either href or isModal set to true');
    }
    if (button.href && button.isModal) {
      throw new Error('Button action cannot have both href and isModal set');
    }
  };
  
  validateButton(this.primary);
  validateButton(this.secondary);
  next();
});

// Indexes
SlideSchema.index({ order: 1 });
SlideSchema.index({ active: 1 });
SlideSchema.index({ headline: 'text', sub: 'text' });

// Ensure virtual fields are serialized
SlideSchema.set('toJSON', {
  virtuals: true
});

const Slide = mongoose.models.Slide || mongoose.model<ISlide>('Slide', SlideSchema);

export default Slide;