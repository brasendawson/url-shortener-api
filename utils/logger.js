import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logDir = path.resolve('logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const customFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        return JSON.stringify({
            timestamp,
            level,
            message,
            ...(stack && { stack }),
            ...meta
        }, null, 2);
    })
);

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: customFormat,
    transports: [
        // Error log file
        new winston.transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Combined log file
        new winston.transports.File({
            filename: path.join('logs', 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Console output in development
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Add logging methods for URL shortener specific events
logger.urlCreated = (urlId, username) => {
    logger.info('URL shortened', { urlId, username, event: 'url_created' });
};

logger.urlAccessed = (urlId, clicks) => {
    logger.info('URL accessed', { urlId, clicks, event: 'url_accessed' });
};

logger.userActivity = (username, action) => {
    logger.info('User activity', { username, action, event: 'user_activity' });
};

export default logger;