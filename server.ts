import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { analyzeClothingImage } from './server/vision_agent';
import { getStyleRecommendations } from './server/style_agent';
import { matchZaraProducts, filterProductsByGeo } from './server/zara_api';
import { INITIAL_ZARA_CATALOG, GEO_REGIONS } from './src/data/zaraCatalog';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON and URL-encoded body parsers with generous payload limits for images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      agent: 'Ria Style Agent',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      capabilities: ['vision_analysis', 'style_recommendations', 'zara_product_matching', 'geo_filtering'],
      rapidApiConfigured: !!(process.env.RAPIDAPI_KEY && process.env.RAPIDAPI_KEY.trim().length > 0),
    });
  });

  // GET /api/regions - Available geographic fashion regions
  app.get('/api/regions', (req, res) => {
    res.json(GEO_REGIONS);
  });

  // GET /api/catalog - Current seasonal catalogue
  app.get('/api/catalog', (req, res) => {
    res.json(INITIAL_ZARA_CATALOG);
  });

  // 1. POST /api/vision - Analyze uploaded clothing image
  app.post('/api/vision', async (req, res) => {
    try {
      const { image, mimeType, sampleId } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'Image data is required.' });
      }

      console.log('Analyzing clothing image with Vision Agent...');
      const analysis = await analyzeClothingImage({ image, mimeType, sampleId });
      res.json(analysis);
    } catch (err: any) {
      console.error('Error in /api/vision:', err);
      res.status(500).json({
        error: 'Failed to analyze clothing image',
        details: err.message || 'Unknown vision error',
      });
    }
  });

  // 2. POST /api/style - Get style recommendations
  app.post('/api/style', async (req, res) => {
    try {
      const { garmentType, category, color, style, occasion, material, fit, details, userPreferences } = req.body;
      console.log('Generating Ria editorial style recommendations...');
      const recommendations = await getStyleRecommendations({
        garmentType,
        category,
        color,
        style,
        occasion,
        material,
        fit,
        details,
        userPreferences,
      });
      res.json(recommendations);
    } catch (err: any) {
      console.error('Error in /api/style:', err);
      res.status(500).json({
        error: 'Failed to generate style recommendations',
        details: err.message || 'Unknown styling error',
      });
    }
  });

  // 3. POST /api/products/match - Match analyzed items to Zara products
  app.post('/api/products/match', async (req, res) => {
    try {
      const { vision, category, region, query, maxResults } = req.body;
      console.log('Matching against Ria catalogue & collections...');
      const matchResult = await matchZaraProducts({
        vision,
        category,
        region,
        query,
        maxResults: maxResults || 6,
      });
      res.json(matchResult);
    } catch (err: any) {
      console.error('Error in /api/products/match:', err);
      res.status(500).json({
        error: 'Failed to match Zara products',
        details: err.message || 'Unknown matching error',
      });
    }
  });

  // 4. POST /api/products/geo - Filter products by geographic availability
  app.post('/api/products/geo', (req, res) => {
    try {
      const { productIds, region } = req.body;
      if (!region) {
        return res.status(400).json({ error: 'Region code is required (e.g. US, ES, GB, FR, DE, IT, JP).' });
      }

      console.log(`Filtering product availability for region: ${region}`);
      const geoData = filterProductsByGeo({ productIds, region });
      res.json(geoData);
    } catch (err: any) {
      console.error('Error in /api/products/geo:', err);
      res.status(500).json({
        error: 'Failed to filter geographic availability',
        details: err.message || 'Unknown geo filtering error',
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Zara Style Agent server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
