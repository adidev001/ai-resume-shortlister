import { Router } from 'express';
import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  getCandidateCount,
} from '../controllers/candidateController.js';
import { candidateValidation } from '../middleware/validate.js';

const router = Router();

// GET /api/candidates/stats/count — must be before /:id to avoid conflict
router.get('/stats/count', getCandidateCount);

// CRUD routes
router.post('/', candidateValidation, createCandidate);
router.get('/', getCandidates);
router.get('/:id', getCandidateById);
router.put('/:id', candidateValidation, updateCandidate);
router.delete('/:id', deleteCandidate);

export default router;
