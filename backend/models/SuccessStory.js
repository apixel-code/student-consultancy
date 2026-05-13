import mongoose from 'mongoose';

const successStorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    student: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    program: {
      type: String,
      required: [true, 'Program is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Year is required'],
      trim: true,
    },
    ytId: {
      type: String,
      required: [true, 'YouTube video ID is required'],
      trim: true,
    },
    initials: {
      type: String,
      required: [true, 'Initials are required'],
      trim: true,
      maxlength: 3,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('SuccessStory', successStorySchema);
