import Candidate from '../models/Candidate.js';

/**
 * Match Service
 * Performs rule-based candidate matching against job requirements.
 *
 * Scoring Formula:
 *   requiredScore  = (matchedRequired / totalRequired) * 70
 *   preferredScore = (matchedPreferred / totalPreferred) * 20
 *   experienceScore = meetsMinimum ? 10 : (candidateExp / minExp) * 10
 *   totalScore = requiredScore + preferredScore + experienceScore
 *
 * Match Levels:
 *   >= 75 → High Match
 *   >= 50 → Medium Match
 *   <  50 → Low Match
 */
class MatchService {
  /**
   * Match all candidates against given job requirements.
   * @param {Object} requirements - { requiredSkills, preferredSkills, minExperience }
   * @returns {Array} Sorted array of match results
   */
  async matchCandidates({ requiredSkills = [], preferredSkills = [], minExperience = 0 }) {
    const candidates = await Candidate.find();

    const normalizedRequired = requiredSkills.map((s) => s.toLowerCase().trim());
    const normalizedPreferred = preferredSkills.map((s) => s.toLowerCase().trim());

    const results = candidates.map((candidate) => {
      const candidateSkills = candidate.skills.map((s) => s.toLowerCase().trim());

      // Required skills match
      const matchedRequired = normalizedRequired.filter((skill) =>
        candidateSkills.includes(skill)
      );
      const requiredScore =
        normalizedRequired.length > 0
          ? (matchedRequired.length / normalizedRequired.length) * 70
          : 70;

      // Preferred skills match
      const matchedPreferred = normalizedPreferred.filter((skill) =>
        candidateSkills.includes(skill)
      );
      const preferredScore =
        normalizedPreferred.length > 0
          ? (matchedPreferred.length / normalizedPreferred.length) * 20
          : 0;

      // Experience score
      let experienceScore = 0;
      if (minExperience > 0) {
        if (candidate.experience >= minExperience) {
          experienceScore = 10;
        } else {
          experienceScore = (candidate.experience / minExperience) * 10;
        }
      } else {
        experienceScore = 10;
      }

      const totalScore = Math.round(requiredScore + preferredScore + experienceScore);

      // Determine match level
      let matchLevel;
      if (totalScore >= 75) matchLevel = 'High';
      else if (totalScore >= 50) matchLevel = 'Medium';
      else matchLevel = 'Low';

      // Identify missing required skills
      const missingSkills = normalizedRequired.filter(
        (skill) => !candidateSkills.includes(skill)
      );

      return {
        candidate: {
          _id: candidate._id,
          name: candidate.name,
          email: candidate.email,
          skills: candidate.skills,
          experience: candidate.experience,
          bio: candidate.bio,
        },
        matchScore: totalScore,
        matchedSkills: matchedRequired.map(
          (s) => requiredSkills.find((rs) => rs.toLowerCase().trim() === s) || s
        ),
        matchedPreferredSkills: matchedPreferred.map(
          (s) => preferredSkills.find((ps) => ps.toLowerCase().trim() === s) || s
        ),
        missingSkills,
        meetsExperience: candidate.experience >= minExperience,
        matchLevel,
      };
    });

    // Sort by score descending
    results.sort((a, b) => b.matchScore - a.matchScore);

    return results;
  }
}

export default new MatchService();
