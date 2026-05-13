import { Router } from 'express';
import { getStats, getActivityLog } from '../controllers/dashboardController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect, authorizeRoles('admin'));

router.get('/stats', getStats);
router.get('/activity', getActivityLog);

export default router;
