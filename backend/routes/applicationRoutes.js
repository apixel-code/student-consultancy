import { Router } from 'express';
import {
  createApplication,
  getAllApplications,
  getAllApplicationsForKanban,
  getMyApplications,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
  assignCounselor,
  deleteApplication,
  getApplicationStats,
} from '../controllers/applicationController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

// Student routes
router.get('/my', authorizeRoles('student'), getMyApplications);

// Staff routes
router.get('/stats', authorizeRoles('admin', 'counselor'), getApplicationStats);
router.get('/kanban', authorizeRoles('admin', 'counselor'), getAllApplicationsForKanban);
router.get('/', authorizeRoles('admin', 'counselor'), getAllApplications);
router.post('/', authorizeRoles('admin', 'counselor'), createApplication);

// Single application routes (accessible to all authenticated; ownership checked inside)
router.get('/:id', getApplicationById);
router.put('/:id', authorizeRoles('admin', 'counselor'), updateApplication);
router.patch('/:id/status', authorizeRoles('admin', 'counselor'), updateApplicationStatus);
router.patch('/:id/assign-counselor', authorizeRoles('admin'), assignCounselor);
router.delete('/:id', authorizeRoles('admin'), deleteApplication);

export default router;
