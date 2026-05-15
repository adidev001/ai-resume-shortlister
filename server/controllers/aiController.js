import aiService from '../services/aiService.js';

/**
 * AI Controller
 * Handles HTTP request/response for AI-powered candidate operations.
 */

/**
 * POST /api/ai/shortlist
 * AI-powered candidate shortlisting using OpenRouter.
 */
export const aiShortlist = async (req, res, next) => {
  try {
    const { requiredSkills, preferredSkills, minExperience, jobDescription } =
      req.body;

    const result = await aiService.shortlistCandidates({
      requiredSkills,
      preferredSkills: preferredSkills || [],
      minExperience: minExperience || 0,
      jobDescription: jobDescription || '',
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/ai/interview-questions
 * Generate interview questions for a candidate.
 */
export const generateInterviewQuestions = async (req, res, next) => {
  try {
    const { candidateId, requiredSkills, jobDescription } = req.body;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        error: 'candidateId is required',
      });
    }

    const result = await aiService.generateInterviewQuestions({
      candidateId,
      requiredSkills: requiredSkills || [],
      jobDescription: jobDescription || '',
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
