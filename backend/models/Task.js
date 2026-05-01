import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  bountyAmount: { type: Number, required: true },
  skillsRequired: [{ type: String }],
  status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'COMPLETED'], default: 'OPEN' }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
