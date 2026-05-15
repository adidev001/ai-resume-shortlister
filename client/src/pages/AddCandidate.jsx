import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle } from 'lucide-react';
import SkillsInput from '../components/SkillsInput';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCandidates } from '../hooks/useCandidates';

/**
 * Add Candidate page with form validation and skills tag input.
 */
export default function AddCandidate() {
  const navigate = useNavigate();
  const { createCandidate, error, setError } = useCandidates();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: [],
    experience: '',
    bio: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = 'Invalid email format';
    if (formData.skills.length === 0)
      newErrors.skills = 'At least one skill is required';
    if (formData.experience === '' || formData.experience < 0)
      newErrors.experience = 'Valid experience is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    setError(null);

    try {
      await createCandidate({
        ...formData,
        experience: Number(formData.experience),
      });
      setSuccess(true);
      setTimeout(() => navigate('/candidates'), 1500);
    } catch (err) {
      // Error is set via the hook
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-success-500/20 flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-success-400" />
        </div>
        <h2 className="text-2xl font-bold text-surface-100 mb-2">
          Candidate Added!
        </h2>
        <p className="text-surface-400">Redirecting to candidates list...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="glass-card p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-surface-100">
              Add New Candidate
            </h2>
            <p className="text-sm text-surface-400">
              Fill in the candidate's profile information
            </p>
          </div>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">
              Full Name <span className="text-danger-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className={`input-field ${errors.name ? 'border-danger-500/50' : ''}`}
            />
            {errors.name && (
              <p className="text-xs text-danger-400 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">
              Email Address <span className="text-danger-400">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="e.g. rahul@gmail.com"
              className={`input-field ${errors.email ? 'border-danger-500/50' : ''}`}
            />
            {errors.email && (
              <p className="text-xs text-danger-400 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">
              Skills <span className="text-danger-400">*</span>
            </label>
            <SkillsInput
              skills={formData.skills}
              onChange={(skills) => handleChange('skills', skills)}
              placeholder="Type a skill and press Enter..."
            />
            {errors.skills && (
              <p className="text-xs text-danger-400 mt-1">{errors.skills}</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">
              Years of Experience <span className="text-danger-400">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={formData.experience}
              onChange={(e) => handleChange('experience', e.target.value)}
              placeholder="e.g. 3"
              className={`input-field ${errors.experience ? 'border-danger-500/50' : ''}`}
            />
            {errors.experience && (
              <p className="text-xs text-danger-400 mt-1">
                {errors.experience}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">
              Bio / Projects
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Brief description of experience, notable projects, achievements..."
              rows={4}
              className="input-field resize-none"
              maxLength={2000}
            />
            <p className="text-xs text-surface-600 mt-1 text-right">
              {formData.bio.length}/2000
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {submitting ? (
              <LoadingSpinner size="sm" message="" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Add Candidate
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
