import { useState } from 'react';
import { ChevronDown, ChevronUp, Brain, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

/**
 * Expandable accordion for AI-generated explanations and recommendations.
 * @param {Object} ranking - AI ranking data for a candidate
 */
export default function AIExplanation({ ranking }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!ranking) return null;

  const getRecommendationStyle = (rec) => {
    const r = rec?.toLowerCase() || '';
    if (r.includes('strongly')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (r.includes('recommend')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (r.includes('consider')) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="glass-card overflow-hidden transition-all duration-500">
      {/* Header - always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-surface-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-surface-100">
                {ranking.candidateName}
              </h4>
              <span className="text-xs font-bold text-primary-400">
                #{ranking.rank}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-surface-400">
                AI Score: <span className="text-surface-200 font-semibold">{ranking.score}%</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${getRecommendationStyle(
                  ranking.recommendation
                )}`}
              >
                {ranking.recommendation}
              </span>
            </div>
          </div>
        </div>

        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-surface-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-surface-400" />
        )}
      </button>

      {/* Expandable content */}
      {isOpen && (
        <div className="px-5 pb-5 space-y-4 animate-slide-up border-t border-surface-700/30">
          {/* Explanation */}
          {ranking.explanation && (
            <div className="pt-4">
              <div className="flex items-center gap-2 text-sm font-medium text-surface-300 mb-2">
                <CheckCircle className="w-4 h-4 text-primary-400" />
                AI Analysis
              </div>
              <p className="text-sm text-surface-400 leading-relaxed pl-6">
                {ranking.explanation}
              </p>
            </div>
          )}

          {/* Missing Skills */}
          {ranking.missingSkills?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-surface-300 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Missing Skills
              </div>
              <div className="flex flex-wrap gap-2 pl-6">
                {ranking.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interview Focus */}
          {ranking.interviewFocus?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-surface-300 mb-2">
                <HelpCircle className="w-4 h-4 text-violet-400" />
                Interview Focus Areas
              </div>
              <ul className="space-y-1 pl-6">
                {ranking.interviewFocus.map((topic, i) => (
                  <li
                    key={i}
                    className="text-sm text-surface-400 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
