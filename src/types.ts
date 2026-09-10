export interface VisionAnalysis {
  garmentType: string;
  category: 'tops' | 'bottoms' | 'outerwear' | 'dresses' | 'shoes' | 'accessories' | 'full-look';
  color: {
    primary: string;
    palette: string[];
    hex: string;
    undertone: string;
  };
  style: string;
  occasion: string;
  material: string;
  fit: string;
  details: string[];
  detectedItems: Array<{
    name: string;
    type: string;
    color: string;
    prominence: 'primary' | 'secondary' | 'accent';
  }>;
  summary: string;
  confidenceScore?: number;
}

export interface StylePairing {
  category: string;
  item: string;
  whyItWorks: string;
  colorHarmony: string;
  silhouetteBalance: string;
}

export interface OccasionScenario {
  title: string;
  setting: string;
  vibe: string;
  stylingNote: string;
}

export interface StyleRecommendations {
  concept: string;
  aestheticTagline: string;
  stylingTips: string[];
  pairings: StylePairing[];
  accessoryAdvice: {
    shoes: string;
    bag: string;
    jewelry: string;
    eyewearOrBelt?: string;
  };
  occasions: OccasionScenario[];
  dayToNight: {
    day: string;
    nightTransition: string;
  };
  colorPaletteAdvice: string[];
}

export interface GeoAvailabilityInfo {
  available: boolean;
  stockLevel: 'high' | 'medium' | 'low' | 'sold_out';
  localPrice: number;
  currency: string;
  currencySymbol: string;
  deliveryDays: string;
  storesWithStock: number;
  featuredStore: string;
  sizes: Array<{
    size: string;
    status: 'in_stock' | 'few_left' | 'out_of_stock';
  }>;
}

export interface ZaraProduct {
  id: string;
  name: string;
  reference: string; // e.g. "REF. 2753/114/800"
  category: string;
  collection: string; // e.g. "ZARA WOMAN COLLECTION", "ZARA MAN ORIGINS", "ZARA STUDIO"
  price: number;
  currency: string;
  currencySymbol: string;
  image: string;
  galleryImages?: string[];
  description: string;
  matchScore: number; // 0 - 100
  matchReason: string;
  color: string;
  composition: string;
  fit: string;
  care: string;
  zaraUrl: string;
  tags: string[];
  geoAvailability: Record<string, GeoAvailabilityInfo>;
}

export interface GeoRegion {
  code: string;
  name: string;
  country: string;
  currency: string;
  symbol: string;
  flag: string;
  exchangeRateFromEUR: number;
}
