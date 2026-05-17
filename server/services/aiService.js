import axios from 'axios';
import Candidate from '../models/Candidate.js';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Fallback Groq models to try if the primary model is rate-limited.
 * Ordered by quality/reliability.
 */
const FALLBACK_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768',
  'gemma2-9b-it',
];

/**
 * AI Service
 * Integrates with Groq API for intelligent candidate ranking,
 * suitability explanations, and interview question generation.
 * Includes automatic model fallback on rate limits.
 */
class AIService {
  /**
   * Build the Groq request headers.
   */
  _getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    };
  }

  /**
   * Send a prompt to Groq with automatic model fallback.
   * If the primary model returns 429, tries fallback models.
   * @param {string} prompt - The user prompt
   * @param {string} systemPrompt - The system prompt
   * @returns {string} AI response text
   */
  async _callGroq(prompt, systemPrompt = '') {
    const primaryModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

    // Build list: primary model first, then fallbacks (skip duplicates)
    const modelsToTry = [primaryModel, ...FALLBACK_MODELS.filter((m) => m !== primaryModel)];

    let lastError = null;

    for (const model of modelsToTry) {
      try {
        console.log(`🤖 Trying model: ${model}`);
        const response = await axios.post(
          GROQ_URL,
          {
            model,
            messages: [
              ...(systemPrompt
                ? [{ role: 'system', content: systemPrompt }]
                : []),
              { role: 'user', content: prompt },
            ],
            temperature: 0.3,
            max_tokens: 3000,
          },
          { headers: this._getHeaders(), timeout: 60000 }
        );

        const content = response.data?.choices?.[0]?.message?.content;
        if (!content) {
          console.log(`⚠️  Empty response from ${model}, trying next...`);
          continue;
        }

        console.log(`✅ Success with model: ${model}`);
        return content;
      } catch (error) {
        const status = error.response?.status;
        const msg = error.response?.data?.error?.message || error.message;

        // If rate-limited (429), server error (5xx), or network timeout (undefined), try the next model
        if (!status || status === 429 || status >= 500) {
          console.log(`⚠️  ${model} returned ${status || 'timeout'}, trying next model...`);
          lastError = new Error(`${model}: ${msg}`);
          continue;
        }

        // For other errors (401, 400, etc.), don't retry — it won't help
        throw new Error(`Groq API error (${status}): ${msg}`);
      }
    }

    // All models failed
    throw new Error(
      `All AI models are currently rate-limited. Please try again in a few minutes. Last error: ${lastError?.message || 'Unknown'}`
    );
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

    const systemPrompt = `You are an expert technical recruiter AI. Analyze candidates and provide rankings based on job requirements. Always respond in valid JSON format only — no markdown, no explanation outside the JSON.`;

    const userPrompt = `Rank the following candidates for a job with these requirements:

Required Skills: ${requiredSkills.join(', ')}
${preferredSkills.length > 0 ? `Preferred Skills: ${preferredSkills.join(', ')}` : ''}
Minimum Experience: ${minExperience} years
${jobDescription ? `Job Description: ${this._sanitize(jobDescription)}` : ''}

Candidates:
${candidateSummaries}

You MUST respond ONLY with a valid JSON object. No markdown code fences. No text before or after the JSON. Use this exact structure:
{"rankings":[{"candidateName":"Name","rank":1,"score":85,"suitability":"High","explanation":"Why suitable","missingSkills":["skill1"],"recommendation":"Strongly Recommend","interviewFocus":["topic1"]}],"summary":"Pool summary"}`;

    const aiResponse = await this._callGroq(userPrompt, systemPrompt);

    // Parse JSON from AI response
    try {
      // Try to extract JSON from the response (handle possible markdown wrapping)
      let jsonStr = aiResponse;

      // Remove markdown code fences if present
      jsonStr = jsonStr.replace(/```json\s*/gi, '').replace(/```\s*/g, '');

      // Extract the JSON object
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
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
      console.error('❌ JSON parse error:', parseError.message);
      console.error('Raw AI response:', aiResponse.substring(0, 500));
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

    const systemPrompt = `You are an expert technical interviewer. Generate relevant interview questions. Always respond in valid JSON format only — no markdown, no explanation outside the JSON.`;

    const userPrompt = `Generate interview questions for this candidate:

Candidate: ${this._sanitize(candidate.name)}
Skills: ${candidate.skills.join(', ')}
Experience: ${candidate.experience} years
Bio: ${this._sanitize(candidate.bio)}

Job Requirements:
Required Skills: ${requiredSkills.join(', ')}
${jobDescription ? `Job Description: ${this._sanitize(jobDescription)}` : ''}

You MUST respond ONLY with a valid JSON object. No markdown code fences. No text before or after the JSON. Use this exact structure:
{"technicalQuestions":[{"question":"...","difficulty":"Easy/Medium/Hard","skill":"relevant skill"}],"behavioralQuestions":[{"question":"...","purpose":"what this assesses"}],"skillGapQuestions":[{"question":"...","missingSkill":"skill to assess"}]}`;

    const aiResponse = await this._callGroq(userPrompt, systemPrompt);

    try {
      let jsonStr = aiResponse;
      jsonStr = jsonStr.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
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
