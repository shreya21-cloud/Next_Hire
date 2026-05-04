import Task from '../models/Task.js';

// @route POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const { title, description, bountyAmount, skillsRequired } = req.body;
    
    // Only recruiters can create tasks
    if (req.user.role !== 'RECRUITER') {
      return res.status(403).json({ message: 'Only recruiters can post tasks' });
    }

    const task = new Task({
      recruiterId: req.user.userId,
      title,
      description,
      bountyAmount,
      skillsRequired
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ status: 'OPEN' })
      .populate('recruiterId', 'name companyName')
      .sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route GET /api/tasks/:id
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('recruiterId', 'name companyName');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route GET /api/tasks/recruiter/me
export const getTasksByRecruiter = async (req, res) => {
  try {
    if (req.user.role !== 'RECRUITER') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const tasks = await Task.find({ recruiterId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
