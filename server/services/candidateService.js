import Candidate from '../models/Candidate.js';

/**
 * Candidate Service
 * Handles all database operations for candidates.
 */
class CandidateService {
  /**
   * Create a new candidate.
   * @param {Object} data - Candidate data
   * @returns {Object} Created candidate
   */
  async create(data) {
    // Normalize skills to trimmed, capitalized format
    if (data.skills) {
      data.skills = data.skills.map((s) => s.trim());
    }
    const candidate = await Candidate.create(data);
    return candidate;
  }

  /**
   * Get all candidates with optional search and filter.
   * @param {Object} query - Query parameters (search, skills, minExp, maxExp, page, limit)
   * @returns {Object} { candidates, total, page, totalPages }
   */
  async getAll(query = {}) {
    const {
      search = '',
      skills = '',
      minExp = '',
      maxExp = '',
      page = 1,
      limit = 10,
    } = query;

    const filter = {};

    // Text search on name and bio
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by skills (comma-separated)
    if (skills) {
      const skillArray = skills.split(',').map((s) => s.trim());
      filter.skills = { $in: skillArray };
    }

    // Filter by experience range
    if (minExp || maxExp) {
      filter.experience = {};
      if (minExp) filter.experience.$gte = Number(minExp);
      if (maxExp) filter.experience.$lte = Number(maxExp);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [candidates, total] = await Promise.all([
      Candidate.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Candidate.countDocuments(filter),
    ]);

    return {
      candidates,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  /**
   * Get a single candidate by ID.
   * @param {string} id - Candidate ID
   * @returns {Object|null} Candidate or null
   */
  async getById(id) {
    const candidate = await Candidate.findById(id);
    return candidate;
  }

  /**
   * Update a candidate by ID.
   * @param {string} id - Candidate ID
   * @param {Object} data - Updated data
   * @returns {Object|null} Updated candidate or null
   */
  async update(id, data) {
    if (data.skills) {
      data.skills = data.skills.map((s) => s.trim());
    }
    const candidate = await Candidate.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return candidate;
  }

  /**
   * Delete a candidate by ID.
   * @param {string} id - Candidate ID
   * @returns {Object|null} Deleted candidate or null
   */
  async delete(id) {
    const candidate = await Candidate.findByIdAndDelete(id);
    return candidate;
  }

  /**
   * Get total count of candidates.
   * @returns {number} Total candidate count
   */
  async getCount() {
    return await Candidate.countDocuments();
  }
}

export default new CandidateService();
