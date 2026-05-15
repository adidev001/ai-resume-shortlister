import candidateService from '../services/candidateService.js';

/**
 * Candidate Controller
 * Handles HTTP request/response for candidate CRUD operations.
 */

/**
 * POST /api/candidates
 * Create a new candidate.
 */
export const createCandidate = async (req, res, next) => {
  try {
    const candidate = await candidateService.create(req.body);
    res.status(201).json({
      success: true,
      data: candidate,
      message: 'Candidate created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/candidates
 * Get all candidates with optional search, filter, and pagination.
 * Query params: search, skills, minExp, maxExp, page, limit
 */
export const getCandidates = async (req, res, next) => {
  try {
    const result = await candidateService.getAll(req.query);
    res.status(200).json({
      success: true,
      data: result.candidates,
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/candidates/:id
 * Get a single candidate by ID.
 */
export const getCandidateById = async (req, res, next) => {
  try {
    const candidate = await candidateService.getById(req.params.id);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found',
      });
    }
    res.status(200).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/candidates/:id
 * Update a candidate by ID.
 */
export const updateCandidate = async (req, res, next) => {
  try {
    const candidate = await candidateService.update(req.params.id, req.body);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found',
      });
    }
    res.status(200).json({
      success: true,
      data: candidate,
      message: 'Candidate updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/candidates/:id
 * Delete a candidate by ID.
 */
export const deleteCandidate = async (req, res, next) => {
  try {
    const candidate = await candidateService.delete(req.params.id);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Candidate deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/candidates/stats/count
 * Get total candidate count (for dashboard).
 */
export const getCandidateCount = async (req, res, next) => {
  try {
    const count = await candidateService.getCount();
    res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (error) {
    next(error);
  }
};
