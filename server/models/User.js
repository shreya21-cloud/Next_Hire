import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['STUDENT', 'RECRUITER'], required: true },
  companyName: { type: String }, // For recruiters
  skills: [{ type: String }], // For students
  bio: { type: String, default: '' },
  averageRating: { type: Number, default: 0 },
  completedTasks: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
