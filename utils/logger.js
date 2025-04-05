import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Check if we're in a writable (local) environment
const isLocal = process.env.VERCEL !== '1'; // Vercel sets this env var to "1"

let transports = [];

// Console transport (always used)
transports.push(new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  )
}));

// If running locally, add file logging
if (isLocal) {
  const logDir = path.resolve('logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
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
  transports
});

// Add custom logging methods
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
