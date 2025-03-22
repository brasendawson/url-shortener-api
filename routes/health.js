import express from 'express';
import { sequelize } from '../config/db.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await sequelize.authenticate();
    
    const healthCheck = {
      status: 'UP',
      timestamp: new Date(),
      service: 'URL Shortener API',
      database: 'Connected',
      uptime: process.uptime()
    };
    
    res.json(healthCheck);
  } catch (error) {
    const healthCheck = {
      status: 'DOWN',
      timestamp: new Date(),
      service: 'URL Shortener API',
      database: 'Disconnected',
      error: error.message
    };
    
    res.status(503).json(healthCheck);
  }
});

export default router;