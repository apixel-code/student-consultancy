import { Router } from 'express';
import {
  createSuccessStory,
  getAllSuccessStories,
  updateSuccessStory,
  deleteSuccessStory,
} from '../controllers/successStoryController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Public — returns only active stories; staff see all (handled in controller)
router.get('/', protect, getAllSuccessStories);

// Staff only
router.use(protect, authorizeRoles('admin', 'counselor'));
router.post('/', createSuccessStory);
router.put('/:id', updateSuccessStory);
router.delete('/:id', deleteSuccessStory);

export default router;
