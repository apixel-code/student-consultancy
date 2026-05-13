import { Router } from 'express';
import {
  getAllStudents,
  getStudentById,
  getMyProfile,
  getMyCounselor,
} from '../controllers/studentController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/me/profile', authorizeRoles('student'), getMyProfile);
router.get('/me/counselor', authorizeRoles('student'), getMyCounselor);
router.get('/', authorizeRoles('admin', 'counselor'), getAllStudents);
router.get('/:id', authorizeRoles('admin', 'counselor'), getStudentById);

export default router;
