import { body, validationResult } from 'express-validator';

/**
 * Middleware that checks validation results from express-validator.
 * Returns 400 with error details if validation fails.
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errors.array().map((e) => e.msg),
    });
  }
  next();
};

/**
 * Validation rules for creating/updating a candidate.
 */
export const candidateValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('skills')
    .isArray({ min: 1 })
    .withMessage('At least one skill is required'),
  body('skills.*')
    .trim()
    .notEmpty()
    .withMessage('Skill cannot be empty'),
  body('experience')
    .isFloat({ min: 0, max: 50 })
    .withMessage('Experience must be between 0 and 50 years'),
  body('bio')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Bio cannot exceed 2000 characters'),
  handleValidationErrors,
];

/**
 * Validation rules for the match endpoint.
 */
export const matchValidation = [
  body('requiredSkills')
    .isArray({ min: 1 })
    .withMessage('At least one required skill is needed'),
  body('requiredSkills.*')
    .trim()
    .notEmpty()
    .withMessage('Required skill cannot be empty'),
  body('preferredSkills')
    .optional()
    .isArray()
    .withMessage('Preferred skills must be an array'),
  body('minExperience')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum experience must be a non-negative number'),
  handleValidationErrors,
];

/**
 * Validation rules for the AI shortlist endpoint.
 */
export const aiShortlistValidation = [
  body('requiredSkills')
    .isArray({ min: 1 })
    .withMessage('At least one required skill is needed'),
  body('jobDescription')
    .optional()
    .isString()
    .withMessage('Job description must be a string'),
  body('minExperience')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum experience must be a non-negative number'),
  handleValidationErrors,
];
