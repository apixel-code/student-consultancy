import { Router } from 'express';
import {
  createCourse,
  getAllCourses,
  getCoursesByUniversity,
  getCourseById,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getAllCourses);
router.get('/university/:universityId', getCoursesByUniversity);
router.get('/:id', getCourseById);

router.use(protect, authorizeRoles('admin'));
router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;
