import express from 'express';
import { register, login, getMe, updateProfile, getLeaderboard } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.patch('/profile', verifyToken, updateProfile);
router.get('/leaderboard', getLeaderboard);

export default router;
