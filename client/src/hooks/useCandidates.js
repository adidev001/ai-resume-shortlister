import { useState, useEffect, useCallback } from 'react';
import { candidateAPI } from '../services/api';

/**
 * Custom hook for candidate CRUD operations with loading/error states.
 */
export function useCandidates(initialParams = {}) {
  const [candidates, setCandidates] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch candidates with optional query params.
   */
  const fetchCandidates = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await candidateAPI.getAll(params);
      setCandidates(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new candidate.
   */
  const createCandidate = useCallback(async (data) => {
    setError(null);
    try {
      const res = await candidateAPI.create(data);
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.details
        ? err.response.data.details.join(', ')
        : err.response?.data?.error || err.message;
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  /**
   * Delete a candidate.
   */
  const deleteCandidate = useCallback(async (id) => {
    setError(null);
    try {
      await candidateAPI.delete(id);
      setCandidates((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchCandidates(initialParams);
  }, []);

  return {
    candidates,
    pagination,
    loading,
    error,
    fetchCandidates,
    createCandidate,
    deleteCandidate,
    setError,
  };
}
