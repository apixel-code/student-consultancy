import mongoose from 'mongoose';

export const DOCUMENT_TYPES = [
  'passport',
  'national_id',
  'photo',
  'transcript',
  'english_test',
  'offer_letter',
  'visa_application',
  'visa_approval',
  'bank_statement',
  'other',
];

export const DOCUMENT_STATUS = ['pending', 'verified', 'rejected'];

// Types that carry an expiry date
export const EXPIRY_TYPES = ['passport', 'english_test', 'visa_approval'];

const documentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      default: null,
    },
    documentType: {
      type: String,
      enum: DOCUMENT_TYPES,
      required: [true, 'Document type is required'],
    },
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    cloudinaryPublicId: {
      type: String,
      default: '',
    },
    mimeType: {
      type: String,
      default: '',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    // Verification workflow
    status: {
      type: String,
      enum: DOCUMENT_STATUS,
      default: 'pending',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: '',
      maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
    },
    // Expiry tracking (passport, visa, english test)
    expiryDate: {
      type: Date,
      default: null,
    },
    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    deletedAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  { timestamps: true }
);

documentSchema.index({ student: 1, documentType: 1 });
documentSchema.index({ student: 1, status: 1 });
documentSchema.index({ application: 1 });

export default mongoose.model('Document', documentSchema);
