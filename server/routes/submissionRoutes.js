import express from 'express';
import { createSubmission, getSubmissionsForTask, evaluateSubmission, getSubmissionsByStudent } from '../controllers/submissionController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createSubmission);
router.get('/student/me', verifyToken, getSubmissionsByStudent);
router.get('/task/:taskId', verifyToken, getSubmissionsForTask);
router.patch('/:id/evaluate', verifyToken, evaluateSubmission);

export default router;
