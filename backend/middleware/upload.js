import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../config/cloudinary.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const studentId =
      req.user.role === 'student'
        ? String(req.user._id)
        : req.body.student || String(req.user._id);

    const docType = req.body.documentType || 'other';

    return {
      folder: `consultancy/${studentId}/${docType}`,
      resource_type: 'auto',
      allowed_formats: ['pdf', 'jpg', 'jpeg', 'png'],
      // unique filename: timestamp + sanitised original name
      public_id: `${Date.now()}-${file.originalname
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_.-]/g, '')
        .split('.')[0]}`,
    };
  },
});

export const documentUpload = multer({
  storage: documentStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type "${file.mimetype}". Only PDF, JPG, and PNG are allowed.`
        ),
        false
      );
    }
  },
});
