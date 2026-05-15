import { useState, useCallback } from 'react';
import { matchAPI, aiAPI } from '../services/api';

/**
 * Custom hook for rule-based and AI-powered matching.
 */
export function useMatch() {
  const [ruleResults, setRuleResults] = useState(null);
  const [aiResults, setAiResults] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Perform rule-based matching.
   */
  const runRuleMatch = useCallback(async (requirements) => {
    setLoading(true);
    setError(null);
    setRuleResults(null);
    try {
      const res = await matchAPI.ruleBasedMatch(requirements);
      setRuleResults(res.data.data);
      setSummary(res.data.summary);
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.details
        ? err.response.data.details.join(', ')
        : err.response?.data?.error || err.message;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Perform AI-powered shortlisting.
   */
  const runAIShortlist = useCallback(async (requirements) => {
    setAiLoading(true);
    setError(null);
    setAiResults(null);
    try {
      const res = await aiAPI.shortlist(requirements);
      setAiResults(res.data.data);
      return res.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setAiLoading(false);
    }
  }, []);

  /**
   * Reset all matching results.
   */
  const resetResults = useCallback(() => {
    setRuleResults(null);
    setAiResults(null);
    setSummary(null);
    setError(null);
  }, []);

  return {
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
  };
}
