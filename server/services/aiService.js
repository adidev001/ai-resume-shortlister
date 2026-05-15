import axios from 'axios';
import Candidate from '../models/Candidate.js';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * AI Service
 * Integrates with OpenRouter API for intelligent candidate ranking,
 * suitability explanations, and interview question generation.
 */
class AIService {
  /**
   * Build the OpenRouter request headers.
   */
  _getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
      'X-Title': 'Candidate Shortlister',
    };
  }

  /**
   * Send a prompt to OpenRouter and return the parsed response.
   * @param {string} prompt - The user prompt
   * @param {string} systemPrompt - The system prompt
   * @returns {string} AI response text
   */
  async _callOpenRouter(prompt, systemPrompt = '') {
    const model = process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo';

    try {
      const response = await axios.post(
        OPENROUTER_URL,
        {
          model,
          messages: [
            ...(systemPrompt
              ? [{ role: 'system', content: systemPrompt }]
              : []),
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        },
        { headers: this._getHeaders(), timeout: 30000 }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from AI model');
      }
      return content;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const msg = error.response.data?.error?.message || error.message;
        throw new Error(`OpenRouter API error (${status}): ${msg}`);
      }
      throw new Error(`AI Service error: ${error.message}`);
    }
  }

  /**
   * Sanitize text to prevent prompt injection.
   * @param {string} text - Input text
   * @returns {string} Sanitized text
   */
  _sanitize(text) {
    if (!text) return '';
    return text
      .replace(/[<>{}]/g, '')
      .replace(/```/g, '')
      .substring(0, 1000);
  }

  /**
   * AI-powered candidate shortlisting.
   * @param {Object} params - { requiredSkills, preferredSkills, minExperience, jobDescription }
   * @returns {Object} Ranked candidates with AI explanations
   */
  async shortlistCandidates({
    requiredSkills = [],
    preferredSkills = [],
    minExperience = 0,
    jobDescription = '',
  }) {
    const candidates = await Candidate.find();

    if (candidates.length === 0) {
      return {
        rankings: [],
        summary: 'No candidates found in the database.',
      };
    }

    // Build candidate summaries for the prompt
    const candidateSummaries = candidates
      .map(
        (c, i) =>
          `${i + 1}. Name: ${this._sanitize(c.name)}
   Email: ${c.email}
   Skills: ${c.skills.join(', ')}
   Experience: ${c.experience} years
   Bio: ${this._sanitize(c.bio)}`
      )
      .join('\n\n');

    const systemPrompt = `You are an expert technical recruiter AI. Analyze candidates and provide rankings based on job requirements. Always respond in valid JSON format.`;

    const userPrompt = `Rank the following candidates for a job with these requirements:

Required Skills: ${requiredSkills.join(', ')}
${preferredSkills.length > 0 ? `Preferred Skills: ${preferredSkills.join(', ')}` : ''}
Minimum Experience: ${minExperience} years
${jobDescription ? `Job Description: ${this._sanitize(jobDescription)}` : ''}

Candidates:
${candidateSummaries}

Respond ONLY with a valid JSON object in this exact format (no markdown, no code fences):
{
  "rankings": [
    {
      "candidateName": "Name",
      "rank": 1,
      "score": 85,
      "suitability": "High/Medium/Low",
      "explanation": "Brief explanation of why this candidate is suitable",
      "missingSkills": ["skill1"],
      "recommendation": "Strongly Recommend / Recommend / Consider / Not Recommended",
      "interviewFocus": ["topic1", "topic2"]
    }
  ],
  "summary": "Overall summary of the candidate pool"
}`;

    const aiResponse = await this._callOpenRouter(userPrompt, systemPrompt);

    // Parse JSON from AI response
    try {
      // Try to extract JSON from the response (handle possible markdown wrapping)
      let jsonStr = aiResponse;
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      const parsed = JSON.parse(jsonStr);

      // Attach candidate IDs to rankings
      if (parsed.rankings) {
        parsed.rankings = parsed.rankings.map((ranking) => {
          const matchedCandidate = candidates.find(
            (c) =>
              c.name.toLowerCase() === ranking.candidateName?.toLowerCase()
          );
          return {
            ...ranking,
            candidateId: matchedCandidate?._id || null,
          };
        });
      }

      return parsed;
    } catch (parseError) {
      // If JSON parsing fails, return a structured fallback
      return {
        rankings: [],
        summary: 'AI analysis completed but response format was unexpected.',
        rawResponse: aiResponse,
      };
    }
  }

  /**
   * Generate interview questions for a candidate based on a job.
   * @param {Object} params - { candidateId, requiredSkills, jobDescription }
   * @returns {Object} Generated interview questions
   */
  async generateInterviewQuestions({
    candidateId,
    requiredSkills = [],
    jobDescription = '',
  }) {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      throw new Error('Candidate not found');
    }

    const systemPrompt = `You are an expert technical interviewer. Generate relevant interview questions. Always respond in valid JSON format.`;

    const userPrompt = `Generate interview questions for this candidate:

Candidate: ${this._sanitize(candidate.name)}
Skills: ${candidate.skills.join(', ')}
Experience: ${candidate.experience} years
Bio: ${this._sanitize(candidate.bio)}

Job Requirements:
Required Skills: ${requiredSkills.join(', ')}
${jobDescription ? `Job Description: ${this._sanitize(jobDescription)}` : ''}

Respond ONLY with a valid JSON object in this exact format (no markdown, no code fences):
{
  "technicalQuestions": [
    { "question": "...", "difficulty": "Easy/Medium/Hard", "skill": "relevant skill" }
  ],
  "behavioralQuestions": [
    { "question": "...", "purpose": "what this assesses" }
  ],
  "skillGapQuestions": [
    { "question": "...", "missingSkill": "skill to assess" }
  ]
}`;

    const aiResponse = await this._callOpenRouter(userPrompt, systemPrompt);

    try {
      let jsonStr = aiResponse;
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      return JSON.parse(jsonStr);
    } catch {
      return {
        technicalQuestions: [],
        behavioralQuestions: [],
        skillGapQuestions: [],
        rawResponse: aiResponse,
      };
    }
  }
}

export default new AIService();
