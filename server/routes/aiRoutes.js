import { Router } from 'express';
import {
  aiShortlist,
  generateInterviewQuestions,
} from '../controllers/aiController.js';
import { aiShortlistValidation } from '../middleware/validate.js';

const router = Router();

// POST /api/ai/shortlist — AI-powered ranking
router.post('/shortlist', aiShortlistValidation, aiShortlist);

// POST /api/ai/interview-questions — AI-generated questions
router.post('/interview-questions', generateInterviewQuestions);

export default router;
