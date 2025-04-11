import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';

// Constants
const WINDOW_MS = 15 * 60 * 1000; 
const MAX_REQUESTS = 100;

export const limiter = rateLimit({
    windowMs: WINDOW_MS,
    max: MAX_REQUESTS,
    handler: (req, res) => {
        // Log rate limit exceeded
        logger.error('Rate limit exceeded', {
            ip: req.ip,
            endpoint: req.originalUrl,
            event: 'rate_limit_exceeded',
            remainingTime: Math.ceil(WINDOW_MS / 1000 / 60),
            timestamp: new Date().toISOString()
        });

        return res.status(429).json({
            status: 'error',
            message: `Too many requests. Try again in ${Math.ceil(WINDOW_MS / 1000 / 60)} minutes`,
            retryAfter: WINDOW_MS / 1000
        });
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: false,
    skipSuccessfulRequests: false
});