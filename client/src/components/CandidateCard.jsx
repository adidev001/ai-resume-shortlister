import { Mail, Briefcase, Trash2 } from 'lucide-react';
import SkillTag from './SkillTag';

/**
 * Candidate profile card with glassmorphism design.
 * @param {Object} candidate - Candidate data
 * @param {function} onDelete - Delete callback
 * @param {Array} matchedSkills - Skills that matched (for highlighting)
 */
export default function CandidateCard({
  candidate,
  onDelete,
  matchedSkills = [],
}) {
  const matchedSet = new Set(matchedSkills.map((s) => s.toLowerCase()));

  return (
    <div className="glass-card p-6 hover:border-primary-500/30 hover:shadow-glow transition-all duration-500 animate-slide-up group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/20">
            {candidate.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-surface-100 group-hover:text-primary-300 transition-colors">
              {candidate.name}
            </h3>
            <div className="flex items-center gap-1 text-surface-400 text-sm">
              <Mail className="w-3.5 h-3.5" />
              {candidate.email}
            </div>
          </div>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(candidate._id)}
            className="p-2 rounded-lg text-surface-500 hover:text-danger-400 hover:bg-danger-500/10 transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Delete candidate"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Experience */}
      <div className="flex items-center gap-2 text-sm text-surface-400 mb-3">
        <Briefcase className="w-4 h-4 text-primary-400" />
        <span>
          {candidate.experience} {candidate.experience === 1 ? 'year' : 'years'}{' '}
          experience
        </span>
      </div>

      {/* Bio */}
      {candidate.bio && (
        <p className="text-sm text-surface-400 mb-4 line-clamp-2">
          {candidate.bio}
        </p>
      )}

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {candidate.skills?.map((skill) => (
          <SkillTag
            key={skill}
            skill={skill}
            matched={matchedSet.has(skill.toLowerCase())}
          />
        ))}
      </div>
    </div>
  );
}
