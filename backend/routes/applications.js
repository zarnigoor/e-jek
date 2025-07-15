import express from 'express';
import { submitApplication, getUserApplications, changeApplicationStatus } from '../controllers/applicationController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isAdmin, isUser } from '../middlewares/roleMiddleware.js';
import { validateApplication, validateStatusChange } from '../utils/validation.js';

const router = express.Router();

router.route('/')
  .post(protect, isUser, submitApplication)
  .get(protect, isUser, getUserApplications);

router.route('/:id/status')
  .patch(protect, isUser, validateStatusChange, changeApplicationStatus);

export default router;
