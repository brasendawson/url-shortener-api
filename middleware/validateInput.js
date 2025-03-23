import { body, validationResult } from 'express-validator';
import logger from '../utils/logger.js';

export const validateRegistration = [
    body('username')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long')
        .trim()
        .escape(),
    
    body('email')
        .isEmail()
        .withMessage('Must be a valid email address')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[^A-Za-z0-9]/)
        .withMessage('Password must contain at least one special character'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Log validation errors
            logger.error('Validation failed', {
                endpoint: req.originalUrl,
                event: 'validation_error',
                username: req.body.username,
                errors: errors.array().map(err => ({
                    field: err.path,
                    message: err.msg
                }))
            });

            return res.status(400).json({
                status: 'error',
                errors: errors.array().map(err => ({
                    field: err.path,
                    message: err.msg
                }))
            });
        }
        next();
    }
];