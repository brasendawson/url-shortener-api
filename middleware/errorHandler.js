import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
    logger.error('Unhandled error', {
        error: err.message,
        stack: err.stack,
        endpoint: req.originalUrl,
        method: req.method,
        username: req.user?.username,
        event: 'unhandled_error'
    });

    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
};