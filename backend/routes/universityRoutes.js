import { Router } from 'express';
import {
  createUniversity,
  getAllUniversities,
  getUniversityById,
  updateUniversity,
  deleteUniversity,
} from '../controllers/universityController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = Router();

router.get('/', getAllUniversities);
router.get('/:id', getUniversityById);

router.use(protect, authorizeRoles('admin'));
router.post('/', upload.single('logo'), createUniversity);
router.put('/:id', upload.single('logo'), updateUniversity);
router.delete('/:id', deleteUniversity);

export default router;
