import Submission from '../models/Submission.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

// @route POST /api/submissions
export const createSubmission = async (req, res) => {
  try {
    const { taskId, submissionUrl, notes } = req.body;

    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Only students can submit work' });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Check if already submitted
    const existingSubmission = await Submission.findOne({ taskId, studentId: req.user.userId });
    if (existingSubmission) {
      return res.status(400).json({ message: 'You have already submitted work for this task' });
    }

    const submission = new Submission({
      taskId,
      studentId: req.user.userId,
      submissionUrl,
      notes
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route GET /api/submissions/task/:taskId
export const getSubmissionsForTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.recruiterId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view these submissions' });
    }

    const submissions = await Submission.find({ taskId: req.params.taskId })
      .populate('studentId', 'name email skills averageRating completedTasks');
      
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route PATCH /api/submissions/:id/evaluate
export const evaluateSubmission = async (req, res) => {
  try {
    const { status, rating, feedback } = req.body;
    
    if (req.user.role !== 'RECRUITER') {
      return res.status(403).json({ message: 'Only recruiters can evaluate' });
    }

    const submission = await Submission.findById(req.params.id).populate('taskId');
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    if (submission.taskId.recruiterId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to evaluate this submission' });
    }

    submission.status = status;
    submission.rating = rating;
    submission.feedback = feedback;
    await submission.save();

    // If approved, update student profile
    if (status === 'APPROVED') {
      const student = await User.findById(submission.studentId);
      student.completedTasks += 1;
      
      // Calculate new average
      const currentTotal = student.averageRating * (student.completedTasks - 1);
      student.averageRating = (currentTotal + rating) / student.completedTasks;
      
      await student.save();
    }

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route GET /api/submissions/student/me
export const getSubmissionsByStudent = async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Only students can view their submissions' });
    }

    const submissions = await Submission.find({ studentId: req.user.userId })
      .populate({
        path: 'taskId',
        select: 'title bountyAmount status recruiterId',
        populate: {
          path: 'recruiterId',
          select: 'companyName name'
        }
      })
      .sort({ createdAt: -1 });
      
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
