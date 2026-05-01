import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  submissionUrl: { type: String, required: true },
  notes: { type: String },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  rating: { type: Number, min: 1, max: 5 },
  feedback: { type: String }
}, { timestamps: true });

export default mongoose.model('Submission', submissionSchema);
