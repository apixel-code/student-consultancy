import { Router } from 'express';
import {
  uploadDocument,
  getMyDocuments,
  getDocumentsByStudent,
  getDocumentById,
  verifyDocument,
  rejectDocument,
  deleteDocument,
  getDownloadUrl,
} from '../controllers/documentController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { documentUpload } from '../middleware/upload.js';

const router = Router();

router.use(protect);

// Student: upload + view own docs
router.post('/', documentUpload.single('file'), uploadDocument);
router.get('/my', authorizeRoles('student'), getMyDocuments);

// Staff: view any student's docs
router.get('/student/:studentId', authorizeRoles('admin', 'counselor'), getDocumentsByStudent);

// All authenticated: get single doc + download URL (ownership checked inside)
router.get('/:id', getDocumentById);
router.get('/:id/download', getDownloadUrl);

// Staff only: verify / reject
router.patch('/:id/verify', authorizeRoles('admin', 'counselor'), verifyDocument);
router.patch('/:id/reject', authorizeRoles('admin', 'counselor'), rejectDocument);

// Delete (student owns it, or staff)
router.delete('/:id', deleteDocument);

export default router;
