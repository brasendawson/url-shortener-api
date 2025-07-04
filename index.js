import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import urlRoutes from './routes/urls.js';
import urlShortener from './routes/urls.js';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import './models/User.js';
import './models/Urls.js';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import { limiter } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import cors from "cors";
import favicon from 'serve-favicon'; 
import path from 'path'; 
import { fileURLToPath } from 'url';
import { injectSpeedInsights } from '@vercel/speed-insights';

injectSpeedInsights();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: './config/.env' });

const app = express();
app.set('trust proxy', 1);
app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Connect to database
connectDB();

// Rate Limiting
app.use(limiter);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/url', urlShortener);
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
    logger.info('Server started', {
        event: 'server_start',
        port: PORT,
        timestamp: new Date().toISOString()
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception', {
        error: err.message,
        stack: err.stack,
        event: 'uncaught_exception'
    });
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection', {
        error: err.message,
        stack: err.stack,
        event: 'unhandled_rejection'
    });
    process.exit(1);
});

export default app;