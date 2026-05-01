import express from 'express';
import { createSubmission, getSubmissionsForTask, evaluateSubmission } from '../controllers/submissionController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createSubmission);
router.get('/task/:taskId', verifyToken, getSubmissionsForTask);
router.patch('/:id/evaluate', verifyToken, evaluateSubmission);

export default router;
