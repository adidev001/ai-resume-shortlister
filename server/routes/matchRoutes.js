import { Router } from 'express';
import { matchCandidates } from '../controllers/matchController.js';
import { matchValidation } from '../middleware/validate.js';

const router = Router();

// POST /api/match — Rule-based matching
router.post('/', matchValidation, matchCandidates);

export default router;
