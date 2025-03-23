import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import urlRoutes from './routes/index.js';
import urlShortener from './routes/urls.js';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import './models/User.js';
import './models/Urls.js';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import { limiter } from './middleware/rateLimit.js';

dotenv.config({ path: './config/.env' });

const app = express();
app.use(express.json());

// Connect to database
connectDB();

// Rate Limiting
app.use(limiter);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/', urlRoutes);
app.use('/api/url', urlShortener);
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});