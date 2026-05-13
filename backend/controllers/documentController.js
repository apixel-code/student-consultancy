import Document, { DOCUMENT_TYPES } from '../models/Document.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { cloudinary } from '../config/cloudinary.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const activeFilter = (extra = {}) => ({ isDeleted: false, ...extra });

const POPULATE_UPLOADED_BY = { path: 'uploadedBy', select: 'name role' };
const POPULATE_VERIFIED_BY  = { path: 'verifiedBy', select: 'name role' };

// Group an array of documents by documentType
const groupByType = (docs) =>
  DOCUMENT_TYPES.reduce((acc, type) => {
    acc[type] = docs.filter((d) => d.documentType === type);
    return acc;
  }, {});

// ─── Upload ───────────────────────────────────────────────────────────────────

export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');

  const { documentType, title, application, expiryDate } = req.body;

  if (!documentType || !DOCUMENT_TYPES.includes(documentType)) {
    throw new ApiError(400, `documentType must be one of: ${DOCUMENT_TYPES.join(', ')}`);
  }
  if (!title?.trim()) {
    throw new ApiError(400, 'Document title is required');
  }

  const studentId =
    req.user.role === 'student' ? req.user._id : req.body.student || req.user._id;

  const document = await Document.create({
    student: studentId,
    application: application || null,
    documentType,
    title: title.trim(),
    fileUrl: req.file.path,
    cloudinaryPublicId: req.file.filename,
    mimeType: req.file.mimetype,
    fileSize: req.file.size || 0,
    uploadedBy: req.user._id,
    expiryDate: expiryDate ? new Date(expiryDate) : null,
  });

  await document.populate([POPULATE_UPLOADED_BY]);
  res.status(201).json(new ApiResponse(201, document, 'Document uploaded successfully'));
});

// ─── Fetch ────────────────────────────────────────────────────────────────────

export const getMyDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find(activeFilter({ student: req.user._id }))
    .populate(POPULATE_UPLOADED_BY)
    .populate(POPULATE_VERIFIED_BY)
    .populate('application', 'status university')
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, { documents, grouped: groupByType(documents) }, 'Documents fetched'));
});

export const getDocumentsByStudent = asyncHandler(async (req, res) => {
  const documents = await Document.find(activeFilter({ student: req.params.studentId }))
    .populate(POPULATE_UPLOADED_BY)
    .populate(POPULATE_VERIFIED_BY)
    .populate('application', 'status university')
    .sort({ documentType: 1, createdAt: -1 });

  res.json(new ApiResponse(200, { documents, grouped: groupByType(documents) }, 'Documents fetched'));
});

export const getDocumentById = asyncHandler(async (req, res) => {
  const document = await Document.findOne(activeFilter({ _id: req.params.id }))
    .populate(POPULATE_UPLOADED_BY)
    .populate(POPULATE_VERIFIED_BY);

  if (!document) throw new ApiError(404, 'Document not found');

  const isOwner = document.student.toString() === req.user._id.toString();
  if (req.user.role === 'student' && !isOwner) {
    throw new ApiError(403, 'Not authorized to access this document');
  }

  res.json(new ApiResponse(200, document, 'Document fetched'));
});

// ─── Verification ─────────────────────────────────────────────────────────────

export const verifyDocument = asyncHandler(async (req, res) => {
  const document = await Document.findOne(activeFilter({ _id: req.params.id }));
  if (!document) throw new ApiError(404, 'Document not found');

  if (document.status === 'verified') {
    throw new ApiError(400, 'Document is already verified');
  }

  document.status = 'verified';
  document.verifiedBy = req.user._id;
  document.verifiedAt = new Date();
  document.rejectionReason = '';
  await document.save();

  await document.populate([POPULATE_UPLOADED_BY, POPULATE_VERIFIED_BY]);
  res.json(new ApiResponse(200, document, 'Document verified'));
});

export const rejectDocument = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  if (!reason?.trim()) {
    throw new ApiError(400, 'Rejection reason is required');
  }

  const document = await Document.findOne(activeFilter({ _id: req.params.id }));
  if (!document) throw new ApiError(404, 'Document not found');

  document.status = 'rejected';
  document.rejectionReason = reason.trim();
  document.verifiedBy = req.user._id;
  document.verifiedAt = new Date();
  await document.save();

  await document.populate([POPULATE_UPLOADED_BY, POPULATE_VERIFIED_BY]);
  res.json(new ApiResponse(200, document, 'Document rejected'));
});

// ─── Delete (soft) ────────────────────────────────────────────────────────────

export const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findOne(activeFilter({ _id: req.params.id })).select(
    '+isDeleted +deletedAt'
  );
  if (!document) throw new ApiError(404, 'Document not found');

  const isOwner = document.student.toString() === req.user._id.toString();
  if (req.user.role === 'student' && !isOwner) {
    throw new ApiError(403, 'You are not authorized to delete this document');
  }

  // Remove from Cloudinary only if admin/counselor hard-deletes, otherwise soft-delete
  if (req.user.role !== 'student' && req.query.hard === 'true') {
    if (document.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(document.cloudinaryPublicId, {
        resource_type: 'auto',
      });
    }
    await document.deleteOne();
    return res.json(new ApiResponse(200, {}, 'Document permanently deleted'));
  }

  document.isDeleted = true;
  document.deletedAt = new Date();
  await document.save({ validateBeforeSave: false });

  res.json(new ApiResponse(200, {}, 'Document deleted'));
});

// ─── Download URL ─────────────────────────────────────────────────────────────

export const getDownloadUrl = asyncHandler(async (req, res) => {
  const document = await Document.findOne(activeFilter({ _id: req.params.id }));
  if (!document) throw new ApiError(404, 'Document not found');

  const isOwner = document.student.toString() === req.user._id.toString();
  if (req.user.role === 'student' && !isOwner) {
    throw new ApiError(403, 'Not authorized');
  }

  // Generate a Cloudinary URL with fl_attachment to force download
  let downloadUrl = document.fileUrl;
  if (document.cloudinaryPublicId) {
    downloadUrl = cloudinary.url(document.cloudinaryPublicId, {
      flags: 'attachment',
      resource_type: 'auto',
      secure: true,
    });
  }

  res.json(new ApiResponse(200, { downloadUrl, fileUrl: document.fileUrl }, 'Download URL generated'));
});
