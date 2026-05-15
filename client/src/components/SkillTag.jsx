/**
 * Reusable skill badge component.
 * @param {string} skill - Skill name
 * @param {boolean} matched - Whether this skill was matched
 * @param {boolean} missing - Whether this is a missing skill
 * @param {function} onRemove - Optional remove handler
 */
export default function SkillTag({ skill, matched, missing, onRemove }) {
  let classes = 'skill-badge transition-all duration-300';

  if (matched) {
    classes =
      'inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-success-500/15 text-success-400 border border-success-500/20 transition-all duration-300';
  } else if (missing) {
    classes =
      'inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-danger-500/15 text-danger-400 border border-danger-500/20 transition-all duration-300';
  }

  return (
    <span className={classes}>
      {skill}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(skill)}
          className="ml-2 text-current opacity-50 hover:opacity-100 transition-opacity"
          aria-label={`Remove ${skill}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
