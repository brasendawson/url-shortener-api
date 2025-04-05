import express from 'express';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import Url from '../models/Urls.js';
import { validateUrl } from '../utils/utils.js';
import { auth } from '../middleware/auth.js';
import logger from '../utils/logger.js';  // Add this import

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: URLs
 *   description: URL shortening operations
 */

/**
 * @swagger
 * /api/url/shorten:
 *   post:
 *     summary: Create a shortened URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - origUrl
 *             properties:
 *               origUrl:
 *                 type: string
 *                 format: uri
 *               customSlug:
 *                 type: string
 *     responses:
 *       200:
 *         description: URL shortened successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 urlId:
 *                   type: string
 *                 origUrl:
 *                   type: string
 *                 shortUrl:
 *                   type: string
 *                 qrCode:
 *                   type: string
 *                 clicks:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid URL
 */
router.post('/shorten', auth, async (req, res) => {
  const { origUrl, customSlug, frontendBase } = req.body;
  const base = process.env.BASE;
  const qrBase = frontendBase || base


  if (!validateUrl(origUrl)) {
    logger.error('Invalid URL submitted', {
      origUrl,
      username: req.user.username,
      event: 'validation_error'
    });
    return res.status(400).json('Invalid URL');
  }

  try {
    const urlId = customSlug || nanoid(8);
    const shortUrl = `${base}/${urlId}`;

    const qrCode = await QRCode.toDataURL(qrBase);

    const url = await Url.create({
      urlId,
      origUrl,
      shortUrl,
      customSlug,
      qrCode,
      username: req.user.username,
      date: new Date()
    });

    logger.info('URL created successfully', {
      urlId,
      username: req.user.username,
      event: 'url_created'
    });
    res.json(url);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      logger.error('Duplicate custom slug', {
        customSlug,
        username: req.user.username,
        event: 'duplicate_slug'
      });
      return res.status(400).json('Custom slug already taken');
    }
    logger.error('URL creation failed', {
      origUrl,
      username: req.user.username,
      error: err.message,
      event: 'url_creation_failed'
    });
    res.status(500).json('Server Error');
  }
});

/**
 * @swagger
 * /api/url/my-urls:
 *   get:
 *     summary: Get all URLs for logged in user
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's URLs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   urlId:
 *                     type: string
 *                   origUrl:
 *                     type: string
 *                   shortUrl:
 *                     type: string
 *                   clicks:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                     format: date-time
 */

// Get user's URLs
router.get('/my-urls', auth, async (req, res) => {
  try {
    const urls = await Url.findAll({
      where: { username: req.user.username },  // Changed from userId to username
      attributes: ['origUrl', 'shortUrl', 'clicks', 'qrCode']
    });
    res.json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
});

/**
 * @swagger
 * /api/url/stats/{urlId}:
 *   get:
 *     summary: Get URL statistics
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: urlId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 urlId:
 *                   type: string
 *                 clicks:
 *                   type: integer
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: URL not found
 */

// Get URL statistics
router.get('/stats/:urlId', auth, async (req, res) => {
  try {
    const url = await Url.findOne({
      where: { urlId: req.params.urlId }
    });

    if (url) {
      return res.json({
        urlId: url.urlId,
        origUrl: url.origUrl,
        shortUrl: url.shortUrl,
        clicks: url.clicks,
        created_at: url.created_at,
        qrCode: url.qrCode

      });
    }
    res.status(404).json('URL not found');
  } catch (err) {
    logger.error('Stats retrieval failed', {
      urlId: req.params.urlId,
      username: req.user.username,
      error: err.message,
      event: 'stats_failed'
    });
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @swagger
 * /api/url/{urlId}:
 *   get:
 *     summary: Redirect to original URL
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: urlId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to original URL
 *       404:
 *         description: URL not found
 */

router.get('/:urlId', async (req, res) => {
  const urlId = req.params.urlId;

  try {
    // Find the URL by urlId
    const url = await Url.findOne({
      where: { urlId }
      // Removed attributes limitation to ensure primary key is included
    });

    if (!url) {
      await logger.error('URL lookup failed - Not Found', {
        urlId,
        event: 'url_lookup_failed',
        reason: 'not_found',
        requestPath: req.originalUrl,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        method: req.method,
        timestamp: new Date().toISOString()
      });

      return res.status(404).json({
        status: 'error',
        message: 'Short URL not found'
      });
    }

    // Increment clicks using the primary key explicitly
    await Url.increment('clicks', {
      where: { urlId }
    });

    // Return JSON with the original URL
    return res.status(200).json({
      status: 'success',
      data: {
        origUrl: url.origUrl,
        clicks: url.clicks + 1 // Reflect the incremented value
      }
    });

  } catch (error) {
    await logger.error('URL lookup failed - Server Error', {
      urlId,
      event: 'url_lookup_failed',
      error: error.message,
      stack: error.stack,
      requestPath: req.originalUrl,
      timestamp: new Date().toISOString()
    });

    console.error('Error in URL lookup:', error.message, error.stack);

    return res.status(500).json({
      status: 'error',
      message: 'Server Error'
    });
  }
});

export default router;