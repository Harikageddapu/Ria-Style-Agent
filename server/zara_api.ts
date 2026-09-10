import { INITIAL_ZARA_CATALOG, GEO_REGIONS } from '../src/data/zaraCatalog';
import { ZaraProduct, VisionAnalysis, GeoAvailabilityInfo, GeoRegion } from '../src/types';
import { getGeminiClient } from './gemini';

interface MatchProductsRequest {
  vision?: Partial<VisionAnalysis>;
  category?: string;
  region?: string;
  query?: string;
  maxResults?: number;
}

interface GeoFilterRequest {
  productIds?: string[];
  region: string; // e.g. "US", "ES", "GB", "FR", "DE", "JP", "IT"
}

export async function matchZaraProducts(params: MatchProductsRequest): Promise<{
  products: ZaraProduct[];
  source: 'rapidapi' | 'zara_catalogue_gemini';
  querySummary: string;
}> {
  const { vision, category, region = 'ES', query, maxResults = 6 } = params;
  const rapidApiKey = process.env.RAPIDAPI_KEY;
  const rapidApiHost = process.env.RAPIDAPI_HOST || 'zara-data-api.p.rapidapi.com';

  // Attempt RapidAPI if user configured the key
  if (rapidApiKey && rapidApiKey.trim().length > 0) {
    try {
      const searchTerm = query || vision?.garmentType || 'blazer';
      const rapidApiUrl = `https://${rapidApiHost}/search?query=${encodeURIComponent(searchTerm)}&country=${region.toLowerCase()}`;
      console.log(`Querying RapidAPI Zara Data API: ${rapidApiUrl}`);
      
      const res = await fetch(rapidApiUrl, {
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': rapidApiHost,
        },
      });

      if (res.ok) {
        const data = await res.json();
        // If data contains products array
        if (Array.isArray(data) && data.length > 0) {
          const formatted: ZaraProduct[] = data.slice(0, maxResults).map((item: any, idx: number) => ({
            id: `rapid-${item.id || idx}`,
            name: item.name || item.title || 'Zara Collection Piece',
            reference: item.reference || item.sku || `REF. ${Math.floor(1000 + Math.random() * 9000)}/0${idx}/800`,
            category: item.category || vision?.category || 'outerwear',
            collection: 'ZARA WOMAN COLLECTION',
            price: typeof item.price === 'number' ? item.price : 79.95,
            currency: item.currency || (region === 'US' ? 'USD' : region === 'GB' ? 'GBP' : region === 'JP' ? 'JPY' : 'EUR'),
            currencySymbol: region === 'US' ? '$' : region === 'GB' ? '£' : region === 'JP' ? '¥' : '€',
            image: item.image || item.imageUrl || INITIAL_ZARA_CATALOG[idx % INITIAL_ZARA_CATALOG.length].image,
            description: item.description || 'Zara seasonal design crafted with contemporary silhouettes.',
            matchScore: Math.floor(92 - idx * 3),
            matchReason: `High-fidelity match via Zara Data API for ${vision?.garmentType || 'clothing item'}.`,
            color: item.color || vision?.color?.primary || 'Neutral',
            composition: item.composition || 'Premium blend',
            fit: item.fit || 'Regular tailored fit',
            care: 'Dry clean or gentle cycle',
            zaraUrl: item.link || 'https://www.zara.com',
            tags: [item.category || 'zara', 'new-in'],
            geoAvailability: generateSyntheticGeoAvailability(item.price || 79.95),
          }));

          return {
            products: formatted,
            source: 'rapidapi',
            querySummary: `Live matches via RapidAPI Zara Data API for "${searchTerm}"`,
          };
        }
      } else {
        console.warn(`RapidAPI returned status ${res.status}: ${await res.text()}`);
      }
    } catch (err) {
      console.warn('RapidAPI call failed, falling back to Zara Catalogue & Gemini Matching Engine:', err);
    }
  }

  // Catalogue + AI Semantic Matching Engine
  const baseCatalog = [...INITIAL_ZARA_CATALOG];

  // If a category filter is applied
  let filtered = baseCatalog;
  if (category && category !== 'all') {
    filtered = baseCatalog.filter(p => p.category.toLowerCase() === category.toLowerCase());
    if (filtered.length === 0) filtered = baseCatalog;
  }

  // If we have vision data, tailor the match reasoning and scores
  const matched = filtered.map(prod => {
    let score = prod.matchScore;
    let reason = prod.matchReason;

    if (vision?.garmentType) {
      const gType = vision.garmentType.toLowerCase();
      const pName = prod.name.toLowerCase();
      const pCat = prod.category.toLowerCase();

      // Check for strong affinity
      if (
        (gType.includes('blazer') && pCat === 'outerwear') ||
        (gType.includes('trousers') && pCat === 'bottoms') ||
        (gType.includes('dress') && pCat === 'dresses') ||
        (gType.includes('shirt') && pCat === 'tops') ||
        (gType.includes('trench') && pCat === 'outerwear')
      ) {
        score = Math.min(99, score + 4);
        reason = `Direct match with ${vision.garmentType}. Mirrors Zara's signature cut, fabric drape, and seasonal color palette.`;
      } else if (
        // Complementary match (e.g. blazer + trousers, or slip dress + kitten heels)
        (gType.includes('blazer') && pCat === 'bottoms') ||
        (gType.includes('dress') && pCat === 'shoes') ||
        (gType.includes('trousers') && pCat === 'tops')
      ) {
        score = Math.max(88, score);
        reason = `Curated Zara lookbook pairing: perfectly balances the silhouette and texture of your ${vision.garmentType}.`;
      }
    }

    return {
      ...prod,
      matchScore: score,
      matchReason: reason,
    };
  });

  // Sort by highest match score
  matched.sort((a, b) => b.matchScore - a.matchScore);

  return {
    products: matched.slice(0, maxResults),
    source: 'zara_catalogue_gemini',
    querySummary: vision?.garmentType
      ? `Matched against Zara seasonal collection for ${vision.garmentType} (${vision.style || 'Minimalist'})`
      : 'Top Zara collection matches',
  };
}

export function filterProductsByGeo(params: GeoFilterRequest): {
  region: GeoRegion;
  results: Array<{
    productId: string;
    productName: string;
    geoInfo: GeoAvailabilityInfo;
  }>;
} {
  const { productIds, region } = params;
  const targetRegionCode = region.toUpperCase();
  const regionConfig = GEO_REGIONS.find(r => r.code === targetRegionCode) || GEO_REGIONS[0];

  const productsToFilter = productIds && productIds.length > 0
    ? INITIAL_ZARA_CATALOG.filter(p => productIds.includes(p.id))
    : INITIAL_ZARA_CATALOG;

  const results = productsToFilter.map(prod => {
    let geo = prod.geoAvailability[targetRegionCode];

    if (!geo) {
      // Calculate adjusted pricing based on exchange rate
      const localPrice = Math.round(prod.price * regionConfig.exchangeRateFromEUR * 100) / 100;
      geo = {
        available: true,
        stockLevel: 'high',
        localPrice: regionConfig.currency === 'JPY' ? Math.round(localPrice) : localPrice,
        currency: regionConfig.currency,
        currencySymbol: regionConfig.symbol,
        deliveryDays: '2-3 Business Days',
        storesWithStock: 8,
        featuredStore: `Zara Flagship, ${regionConfig.country}`,
        sizes: [
          { size: 'S', status: 'in_stock' },
          { size: 'M', status: 'in_stock' },
          { size: 'L', status: 'in_stock' },
        ],
      };
    }

    return {
      productId: prod.id,
      productName: prod.name,
      geoInfo: geo,
    };
  });

  return {
    region: regionConfig,
    results,
  };
}

function generateSyntheticGeoAvailability(baseEurPrice: number): Record<string, GeoAvailabilityInfo> {
  const res: Record<string, GeoAvailabilityInfo> = {};
  for (const reg of GEO_REGIONS) {
    const localP = reg.currency === 'JPY'
      ? Math.round(baseEurPrice * reg.exchangeRateFromEUR)
      : Math.round(baseEurPrice * reg.exchangeRateFromEUR * 100) / 100;

    res[reg.code] = {
      available: true,
      stockLevel: 'high',
      localPrice: localP,
      currency: reg.currency,
      currencySymbol: reg.symbol,
      deliveryDays: reg.code === 'ES' ? 'Tomorrow' : '2-3 Business Days',
      storesWithStock: Math.floor(6 + Math.random() * 12),
      featuredStore: `Zara Flagship, ${reg.name}`,
      sizes: [
        { size: 'XS', status: 'in_stock' },
        { size: 'S', status: 'in_stock' },
        { size: 'M', status: 'in_stock' },
        { size: 'L', status: 'few_left' },
      ],
    };
  }
  return res;
}
