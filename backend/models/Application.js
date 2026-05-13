import mongoose from 'mongoose';

export const APPLICATION_STATUSES = [
  'Inquiry',
  'Applied',
  'Document Submitted',
  'Offer Received',
  'Visa Applied',
  'Visa Approved',
  'Enrolled',
  'Rejected',
];

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: APPLICATION_STATUSES, required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String, default: '' },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    counselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: [true, 'University is required'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: 'Inquiry',
    },
    intakeYear: {
      type: Number,
      required: [true, 'Intake year is required'],
      min: [2020, 'Intake year must be 2020 or later'],
    },
    intakeMonth: {
      type: Number,
      required: [true, 'Intake month is required'],
      min: [1, 'Month must be between 1 and 12'],
      max: [12, 'Month must be between 1 and 12'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    notes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
      default: '',
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
  },
  { timestamps: true }
);

applicationSchema.index({ student: 1, status: 1 });
applicationSchema.index({ counselor: 1, status: 1 });
applicationSchema.index({ university: 1 });
applicationSchema.index({ createdAt: -1 });

export default mongoose.model('Application', applicationSchema);
