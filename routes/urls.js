import express from 'express';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import Url from '../models/Urls.js';
import { validateUrl } from '../utils/utils.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create short URL (protected route)
router.post('/shorten', auth, async (req, res) => {
  const { origUrl, customSlug } = req.body;
  const base = process.env.BASE;

  if (!validateUrl(origUrl)) {
    return res.status(400).json('Invalid URL');
  }

  try {
    // Use custom slug or generate urlId
    const urlId = customSlug || nanoid(8);
    const shortUrl = `${base}/${urlId}`;

    // Generate QR code
    const qrCode = await QRCode.toDataURL(shortUrl);

    // Save URL
    const url = await Url.create({
      urlId,
      origUrl,
      shortUrl,
      customSlug,
      qrCode,
      username: req.user.username,  // Changed from userId to username
      date: new Date()
    });

    res.json(url);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json('Custom slug already taken');
    }
    console.error(err);
    res.status(500).json('Server Error');
  }
});

// Get user's URLs
router.get('/my-urls', auth, async (req, res) => {
  try {
    const urls = await Url.findAll({
      where: { username: req.user.username },  // Changed from userId to username
      attributes: ['urlId', 'origUrl', 'shortUrl', 'clicks', 'created_at']
    });
    res.json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
});

// Get URL statistics
router.get('/stats/:urlId', async (req, res) => {
  try {
    const url = await Url.findOne({
      where: { urlId: req.params.urlId }
    });

    if (url) {
      return res.json({
        urlId: url.urlId,
        clicks: url.clicks,
        created_at: url.created_at,
        qrCode: url.qrCode
      });
    }
    res.status(404).json('URL not found');
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
});

export default router;