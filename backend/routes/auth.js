import express from 'express';
import { login, logout, getProfile } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateLogin } from '../utils/validation.js';

const router = express.Router();

router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.get('/profile', protect, getProfile);

export default router;
