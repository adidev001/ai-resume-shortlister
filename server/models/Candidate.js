import mongoose from 'mongoose';

/**
 * Candidate Schema
 * Represents a job candidate with their profile information.
 */
const CandidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one skill is required',
      },
    },
    experience: {
      type: Number,
      required: [true, 'Experience is required'],
      min: [0, 'Experience cannot be negative'],
      max: [50, 'Experience seems unrealistic'],
    },
    bio: {
      type: String,
      default: '',
      maxlength: [2000, 'Bio cannot exceed 2000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
CandidateSchema.index({ skills: 1 });
CandidateSchema.index({ experience: 1 });
CandidateSchema.index({ name: 'text', bio: 'text' });

const Candidate = mongoose.model('Candidate', CandidateSchema);

export default Candidate;
