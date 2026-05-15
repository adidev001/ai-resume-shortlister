/**
 * Animated match score progress bar.
 * @param {number} score - Match score (0-100)
 * @param {string} level - Match level (High, Medium, Low)
 * @param {boolean} animated - Whether to animate on mount
 */
export default function MatchScoreBar({ score = 0, level, animated = true }) {
  const getBarColor = () => {
    if (score >= 75) return 'from-emerald-500 to-emerald-400';
    if (score >= 50) return 'from-amber-500 to-amber-400';
    return 'from-red-500 to-red-400';
  };

  const getGlowColor = () => {
    if (score >= 75) return 'shadow-emerald-500/30';
    if (score >= 50) return 'shadow-amber-500/30';
    return 'shadow-red-500/30';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-surface-300">
          Match Score
        </span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-surface-100">{score}%</span>
          {level && (
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-semibold
                ${
                  level === 'High'
                    ? 'match-high'
                    : level === 'Medium'
                    ? 'match-medium'
                    : 'match-low'
                }`}
            >
              {level}
            </span>
          )}
        </div>
      </div>

      <div className="w-full h-3 bg-surface-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getBarColor()} shadow-lg ${getGlowColor()} transition-all duration-1000 ease-out`}
          style={{
            width: animated ? `${score}%` : '0%',
            transition: animated ? 'width 1s ease-out' : 'none',
          }}
        />
      </div>
    </div>
  );
}
