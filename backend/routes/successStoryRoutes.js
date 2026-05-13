import { Router } from 'express';
import {
  createSuccessStory,
  getAllSuccessStories,
  updateSuccessStory,
  deleteSuccessStory,
} from '../controllers/successStoryController.js';
import { protect, authorizeRoles, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public — guests see only active; logged-in staff see all
router.get('/', optionalAuth, getAllSuccessStories);

// Staff only
router.use(protect, authorizeRoles('admin', 'counselor'));
router.post('/', createSuccessStory);
router.put('/:id', updateSuccessStory);
router.delete('/:id', deleteSuccessStory);

export default router;
