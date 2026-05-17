import axios from 'axios';

/**
 * Axios instance configured with the backend API base URL.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// ── Candidate API ────────────────────────────────────────────

export const candidateAPI = {
  /**
   * Get all candidates with optional query params.
   * @param {Object} params - { search, skills, minExp, maxExp, page, limit }
   */
  getAll: (params = {}) => api.get('/candidates', { params }),

  /**
   * Get a single candidate by ID.
   */
  getById: (id) => api.get(`/candidates/${id}`),

  /**
   * Create a new candidate.
   */
  create: (data) => api.post('/candidates', data),

  /**
   * Update a candidate.
   */
  update: (id, data) => api.put(`/candidates/${id}`, data),

  /**
   * Delete a candidate.
   */
  delete: (id) => api.delete(`/candidates/${id}`),

  /**
   * Get candidate count (for dashboard).
   */
  getCount: () => api.get('/candidates/stats/count'),
};

// ── Match API ────────────────────────────────────────────────

export const matchAPI = {
  /**
   * Perform rule-based matching.
   * @param {Object} data - { requiredSkills, preferredSkills, minExperience }
   */
  ruleBasedMatch: (data) => api.post('/match', data),
};

// ── AI API ───────────────────────────────────────────────────

export const aiAPI = {
  /**
   * AI-powered shortlisting.
   * @param {Object} data - { requiredSkills, preferredSkills, minExperience, jobDescription }
   */
  shortlist: (data) => api.post('/ai/shortlist', data),

  /**
   * Generate interview questions.
   * @param {Object} data - { candidateId, requiredSkills, jobDescription }
   */
  interviewQuestions: (data) => api.post('/ai/interview-questions', data),
};

export default api;
