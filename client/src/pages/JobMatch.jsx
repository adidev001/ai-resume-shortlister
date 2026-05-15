import { useState } from 'react';
import { Target, Sparkles, BarChart3, Brain } from 'lucide-react';
import SkillsInput from '../components/SkillsInput';
import MatchScoreBar from '../components/MatchScoreBar';
import CandidateCard from '../components/CandidateCard';
import AIExplanation from '../components/AIExplanation';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SkillTag from '../components/SkillTag';
import { useMatch } from '../hooks/useMatch';

/**
 * Job Matching page — enter requirements, view rule-based + AI results.
 */
export default function JobMatch() {
  const {
    ruleResults,
    aiResults,
    summary,
    loading,
    aiLoading,
    error,
    runRuleMatch,
    runAIShortlist,
    resetResults,
    setError,
  } = useMatch();

  const [requirements, setRequirements] = useState({
    requiredSkills: [],
    preferredSkills: [],
    minExperience: '',
    jobDescription: '',
  });

  const [activeTab, setActiveTab] = useState('rules');

  const handleRuleMatch = async (e) => {
    e.preventDefault();
    if (requirements.requiredSkills.length === 0) {
      setError('Please add at least one required skill');
      return;
    }
    try {
      await runRuleMatch({
        requiredSkills: requirements.requiredSkills,
        preferredSkills: requirements.preferredSkills,
        minExperience: Number(requirements.minExperience) || 0,
      });
      setActiveTab('rules');
    } catch (err) {
      // handled by hook
    }
  };

  const handleAIShortlist = async () => {
    if (requirements.requiredSkills.length === 0) {
      setError('Please add at least one required skill');
      return;
    }
    try {
      await runAIShortlist({
        requiredSkills: requirements.requiredSkills,
        preferredSkills: requirements.preferredSkills,
        minExperience: Number(requirements.minExperience) || 0,
        jobDescription: requirements.jobDescription,
      });
      setActiveTab('ai');
    } catch (err) {
      // handled by hook
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Requirements Form */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-surface-100">
              Job Requirements
            </h2>
            <p className="text-sm text-surface-400">
              Define what you're looking for in a candidate
            </p>
          </div>
        </div>

        <form onSubmit={handleRuleMatch} className="space-y-5">
          {/* Required Skills */}
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">
              Required Skills <span className="text-danger-400">*</span>
            </label>
            <SkillsInput
              skills={requirements.requiredSkills}
              onChange={(skills) =>
                setRequirements((prev) => ({ ...prev, requiredSkills: skills }))
              }
              placeholder="e.g. React, Node.js, MongoDB..."
            />
          </div>

          {/* Preferred Skills */}
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">
              Preferred Skills{' '}
              <span className="text-surface-500 text-xs">(optional)</span>
            </label>
            <SkillsInput
              skills={requirements.preferredSkills}
              onChange={(skills) =>
                setRequirements((prev) => ({
                  ...prev,
                  preferredSkills: skills,
                }))
              }
              placeholder="e.g. TypeScript, Docker..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Min Experience */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">
                Minimum Experience (years)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={requirements.minExperience}
                onChange={(e) =>
                  setRequirements((prev) => ({
                    ...prev,
                    minExperience: e.target.value,
                  }))
                }
                placeholder="e.g. 2"
                className="input-field"
              />
            </div>

            {/* Job Description (for AI) */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">
                Job Description{' '}
                <span className="text-surface-500 text-xs">(for AI)</span>
              </label>
              <input
                type="text"
                value={requirements.jobDescription}
                onChange={(e) =>
                  setRequirements((prev) => ({
                    ...prev,
                    jobDescription: e.target.value,
                  }))
                }
                placeholder="e.g. Senior Full-Stack Developer"
                className="input-field"
              />
            </div>
          </div>

          {error && (
            <ErrorMessage
              message={error}
              onDismiss={() => setError(null)}
            />
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 flex-1"
            >
              {loading ? (
                <LoadingSpinner size="sm" message="" />
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  Rule-Based Match
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleAIShortlist}
              disabled={aiLoading}
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {aiLoading ? (
                <LoadingSpinner size="sm" message="" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  AI Shortlist
                </>
              )}
            </button>

            {(ruleResults || aiResults) && (
              <button
                type="button"
                onClick={resetResults}
                className="btn-secondary px-4"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results */}
      {(ruleResults || aiResults) && (
        <div className="space-y-6">
          {/* Tab Switcher */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('rules')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'rules'
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'text-surface-400 hover:bg-surface-800/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Rule-Based ({ruleResults?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'ai'
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'text-surface-400 hover:bg-surface-800/50'
              }`}
            >
              <Brain className="w-4 h-4" />
              AI Results ({aiResults?.rankings?.length || 0})
            </button>
          </div>

          {/* Summary Stats */}
          {activeTab === 'rules' && summary && (
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">
                  {summary.highMatch}
                </p>
                <p className="text-xs text-surface-500 mt-1">High Match</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-amber-400">
                  {summary.mediumMatch}
                </p>
                <p className="text-xs text-surface-500 mt-1">Medium Match</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-red-400">
                  {summary.lowMatch}
                </p>
                <p className="text-xs text-surface-500 mt-1">Low Match</p>
              </div>
            </div>
          )}

          {/* AI Summary */}
          {activeTab === 'ai' && aiResults?.summary && (
            <div className="glass-card p-5 border-l-4 border-violet-500">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-violet-400" />
                <h4 className="text-sm font-semibold text-surface-200">
                  AI Summary
                </h4>
              </div>
              <p className="text-sm text-surface-400">{aiResults.summary}</p>
            </div>
          )}

          {/* Rule-Based Results */}
          {activeTab === 'rules' && ruleResults && (
            <div className="space-y-4">
              {ruleResults.map((result, index) => (
                <div
                  key={result.candidate._id}
                  className="glass-card p-6 animate-slide-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Candidate Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg">
                          {result.candidate.name?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-surface-100">
                            {result.candidate.name}
                          </h3>
                          <p className="text-sm text-surface-400">
                            {result.candidate.experience} years experience ·{' '}
                            {result.candidate.email}
                          </p>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {result.candidate.skills?.map((skill) => (
                          <SkillTag
                            key={skill}
                            skill={skill}
                            matched={result.matchedSkills
                              ?.map((s) => s.toLowerCase())
                              .includes(skill.toLowerCase())}
                            missing={result.missingSkills
                              ?.map((s) => s.toLowerCase())
                              .includes(skill.toLowerCase())}
                          />
                        ))}
                      </div>

                      {/* Missing Skills */}
                      {result.missingSkills?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs text-surface-500 mr-1 self-center">
                            Missing:
                          </span>
                          {result.missingSkills.map((skill) => (
                            <SkillTag key={skill} skill={skill} missing />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Score */}
                    <div>
                      <MatchScoreBar
                        score={result.matchScore}
                        level={result.matchLevel}
                      />
                      <div className="mt-3 text-xs text-surface-500 space-y-1">
                        <div className="flex justify-between">
                          <span>Experience</span>
                          <span
                            className={
                              result.meetsExperience
                                ? 'text-emerald-400'
                                : 'text-amber-400'
                            }
                          >
                            {result.meetsExperience
                              ? '✓ Meets requirement'
                              : '✗ Below minimum'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI Results */}
          {activeTab === 'ai' && aiResults?.rankings && (
            <div className="space-y-3">
              {aiResults.rankings.map((ranking, index) => (
                <div
                  key={index}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <AIExplanation ranking={ranking} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
