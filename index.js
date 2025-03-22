import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import urlRoutes from './routes/index.js';
import urlShortener from './routes/urls.js';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import './models/User.js';
import './models/Urls.js';

dotenv.config({ path: './config/.env' });

const app = express();
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/', urlRoutes);
app.use('/api/url', urlShortener);
app.use('/api/auth', authRoutes);
app.use('/api', healthRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});