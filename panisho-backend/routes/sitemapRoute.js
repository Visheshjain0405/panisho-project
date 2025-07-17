const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // adjust if model path is different

router.get('/sitemap.xml', async (req, res) => {
  try {
    const products = await Product.find({}, 'slug updatedAt');

    const urls = products.map(p => `
      <url>
        <loc>https://panisho.in/product/${p.slug}</loc>
        <lastmod>${new Date(p.updatedAt).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `).join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://panisho.in/</loc>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
        ${urls}
      </urlset>
    `;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;
