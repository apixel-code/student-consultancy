import mongoose from 'mongoose';

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'University name is required'],
      unique: true,
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    ranking: {
      type: Number,
      min: [1, 'Ranking must be at least 1'],
    },
    logo: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

universitySchema.index({ name: 'text', country: 1 });

export default mongoose.model('University', universitySchema);
