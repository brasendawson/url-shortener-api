import express from 'express';
import { sequelize } from '../config/db.js';

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: API health check
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                 uptime:
 *                   type: number
 */

const router = express.Router();

// Change from '/health' to '/'
router.get('/', async (req, res) => {
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