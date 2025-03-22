import express from 'express';
import { nanoid } from 'nanoid';
import Url from '../models/Urls.js';
import { validateUrl } from '../utils/utils.js';

const router = express.Router();

router.post('/shorten', async (req, res) => {
  const { origUrl } = req.body;
  const base = process.env.BASE;

  // Validate URL
  if (!validateUrl(origUrl)) {
    return res.status(400).json('Invalid URL');
  }

  try {
    // Create URL ID
    const urlId = nanoid(8);
    const shortUrl = `${base}/${urlId}`;

    // Save URL to database
    const url = await Url.create({
      urlId,
      origUrl,
      shortUrl,
      date: new Date()
    });

    res.json(url);
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
});

export default router;