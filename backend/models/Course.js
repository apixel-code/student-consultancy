import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: [true, 'University is required'],
    },
    level: {
      type: String,
      enum: ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate'],
      required: [true, 'Level is required'],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    tuitionFee: {
      amount: { type: Number, min: 0 },
      currency: { type: String, default: 'USD', uppercase: true },
    },
    requirements: {
      ielts: { type: Number, min: 0, max: 9 },
      toefl: { type: Number, min: 0, max: 120 },
      gpa: { type: Number, min: 0, max: 4 },
      other: { type: String, default: '' },
    },
    // Available intake months (1 = January … 12 = December)
    intakes: {
      type: [{ type: Number, min: 1, max: 12 }],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

courseSchema.index({ university: 1, name: 1 });

export default mongoose.model('Course', courseSchema);
