import matchService from '../services/matchService.js';

/**
 * Match Controller
 * Handles HTTP request/response for rule-based candidate matching.
 */

/**
 * POST /api/match
 * Perform rule-based matching against job requirements.
 */
export const matchCandidates = async (req, res, next) => {
  try {
    const { requiredSkills, preferredSkills, minExperience } = req.body;

    const results = await matchService.matchCandidates({
      requiredSkills,
      preferredSkills: preferredSkills || [],
      minExperience: minExperience || 0,
    });

    // Compute summary stats
    const summary = {
      totalCandidates: results.length,
      highMatch: results.filter((r) => r.matchLevel === 'High').length,
      mediumMatch: results.filter((r) => r.matchLevel === 'Medium').length,
      lowMatch: results.filter((r) => r.matchLevel === 'Low').length,
    };

    res.status(200).json({
      success: true,
      data: results,
      summary,
    });
  } catch (error) {
    next(error);
  }
};
