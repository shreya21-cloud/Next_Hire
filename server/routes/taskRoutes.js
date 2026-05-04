import express from 'express';
import { createTask, getTasks, getTaskById, getTasksByRecruiter } from '../controllers/taskController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createTask);
router.get('/recruiter/me', verifyToken, getTasksByRecruiter);
router.get('/', getTasks);
router.get('/:id', getTaskById);

export default router;
