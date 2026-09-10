import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { VisionAnalysisCard } from './components/VisionAnalysisCard';
import { StyleRecommendationsSection } from './components/StyleRecommendationsSection';
import { ZaraMatchesSection } from './components/ZaraMatchesSection';
import { GeoAvailabilitySection } from './components/GeoAvailabilitySection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SavedLookbookDrawer } from './components/SavedLookbookDrawer';
import { GEO_REGIONS, INITIAL_ZARA_CATALOG, SAMPLE_LOOKS } from './data/zaraCatalog';
import { VisionAnalysis, StyleRecommendations, ZaraProduct, GeoRegion } from './types';
import { Sparkles, Eye, Shirt, Compass, Globe, AlertTriangle, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentRegion, setCurrentRegion] = useState<GeoRegion>(GEO_REGIONS[0]); // Default to Spain (Zara HQ)
  const [availableRegions, setAvailableRegions] = useState<GeoRegion[]>(GEO_REGIONS);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeStepText, setActiveStepText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Agent State
  const [visionAnalysis, setVisionAnalysis] = useState<VisionAnalysis | null>(null);
  const [styleRecommendations, setStyleRecommendations] = useState<StyleRecommendations | null>(null);
  const [matchedProducts, setMatchedProducts] = useState<ZaraProduct[]>(INITIAL_ZARA_CATALOG.slice(0, 6));
  const [querySummary, setQuerySummary] = useState<string>('');

  // Active view tab
  const [activeTab, setActiveTab] = useState<'matches' | 'vision' | 'style' | 'geo'>('matches');

  // Modal and drawer state
  const [selectedProductForModal, setSelectedProductForModal] = useState<ZaraProduct | null>(null);
  const [isLookbookOpen, setIsLookbookOpen] = useState<boolean>(false);
  const [savedProducts, setSavedProducts] = useState<ZaraProduct[]>(() => {
    try {
      const stored = localStorage.getItem('zara_saved_lookbook');
      return stored ? JSON.parse(stored) : [INITIAL_ZARA_CATALOG[0]];
    } catch {
      return [INITIAL_ZARA_CATALOG[0]];
    }
  });

  // Sync saved products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zara_saved_lookbook', JSON.stringify(savedProducts));
    } catch (e) {
      console.error('Error saving lookbook to localStorage:', e);
    }
  }, [savedProducts]);

  // Fetch available regions from server on mount
  useEffect(() => {
    fetch('/api/regions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAvailableRegions(data);
        }
      })
      .catch(err => console.log('Using local regions:', err));
  }, []);

  // Main Pipeline: Vision -> Style Recommendations -> Product Matching
  const analyzeImagePipeline = async (imageData: string, sampleInfo?: any) => {
    setSelectedImage(imageData);
    setLoading(true);
    setError(null);

    try {
      // Step 1: POST /api/vision
      setActiveStepText('Vision Agent: Extracting garment silhouette, palette & material...');
      const visionRes = await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          sampleId: sampleInfo?.id,
        }),
      });

      if (!visionRes.ok) {
        throw new Error(`Vision analysis failed with status: ${visionRes.status}`);
      }

      const visionData: VisionAnalysis = await visionRes.json();
      setVisionAnalysis(visionData);

      // Step 2: POST /api/style
      setActiveStepText('Style Agent: Formulating Ria editorial directives & pairings...');
      const styleRes = await fetch('/api/style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garmentType: visionData.garmentType,
          category: visionData.category,
          color: visionData.color,
          style: visionData.style,
          occasion: visionData.occasion,
          material: visionData.material,
          fit: visionData.fit,
          details: visionData.details,
        }),
      });

      if (styleRes.ok) {
        const styleData: StyleRecommendations = await styleRes.json();
        setStyleRecommendations(styleData);
      }

      // Step 3: POST /api/products/match
      setActiveStepText('Matching Engine: Querying collection catalog & stock availability...');
      const matchRes = await fetch('/api/products/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vision: visionData,
          region: currentRegion.code,
          maxResults: 6,
        }),
      });

      if (matchRes.ok) {
        const matchData = await matchRes.json();
        if (matchData.products && matchData.products.length > 0) {
          setMatchedProducts(matchData.products);
          setQuerySummary(matchData.querySummary || '');
        }
      }

      setActiveTab('matches');
    } catch (err: any) {
      console.error('Pipeline error:', err);
      setError(err.message || 'An error occurred while analyzing the clothing item.');
    } finally {
      setLoading(false);
      setActiveStepText('');
    }
  };

  // Region switcher handler
  const handleSelectRegion = async (region: GeoRegion) => {
    setCurrentRegion(region);

    // Call POST /api/products/geo to refresh regional status
    try {
      const prodIds = matchedProducts.map(p => p.id);
      await fetch('/api/products/geo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: prodIds,
          region: region.code,
        }),
      });
    } catch (e) {
      console.error('Geo update error:', e);
    }
  };

  const handleToggleSave = (product: ZaraProduct) => {
    setSavedProducts(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleReset = () => {
    setSelectedImage(null);
    setVisionAnalysis(null);
    setStyleRecommendations(null);
    setError(null);
    setMatchedProducts(INITIAL_ZARA_CATALOG.slice(0, 6));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-neutral-200 selection:text-neutral-950">
      {/* Top Header */}
      <Header
        currentRegion={currentRegion}
        availableRegions={availableRegions}
        onSelectRegion={handleSelectRegion}
        savedCount={savedProducts.length}
        onOpenLookbook={() => setIsLookbookOpen(true)}
        onReset={handleReset}
        loading={loading}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Editorial Sub-hero Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <span className="text-xs font-mono tracking-[0.2em] text-neutral-400 uppercase block mb-1">
              Zara Studio • Autumn/Winter Editorial Intelligence
            </span>
            <h1 className="font-editorial text-3xl sm:text-5xl font-normal tracking-tight text-neutral-100">
              AI Vision & Wardrobe Matcher
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md font-sans leading-relaxed">
            Deconstruct silhouettes, analyze chromatic undertones, and discover exact Zara seasonal collection matches with global store inventory.
          </p>
        </div>

        {/* Error Alert if any */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="px-3 py-1 rounded bg-rose-900/50 hover:bg-rose-900 text-white transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Clothing Image Uploader / Scanner Area */}
        <section id="uploader-section">
          <ImageUploader
            onImageSelected={analyzeImagePipeline}
            selectedImage={selectedImage}
            loading={loading}
          />
        </section>

        {/* Processing Indicator */}
        {loading && (
          <div className="rounded-xl p-6 bg-neutral-900/60 border border-neutral-800 text-center space-y-3 animate-pulse">
            <div className="w-8 h-8 border-2 border-neutral-200 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-editorial tracking-widest uppercase text-neutral-200">
              {activeStepText || 'Processing Fashion Intelligence...'}
            </p>
          </div>
        )}

        {/* Results Area */}
        {(visionAnalysis || matchedProducts.length > 0) && (
          <section id="results-section" className="space-y-6 pt-4">
            {/* View Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2 overflow-x-auto">
              <div className="flex items-center gap-2">
                <button
                  id="tab-matches"
                  onClick={() => setActiveTab('matches')}
                  className={`flex items-center gap-2 py-2 px-4 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                    activeTab === 'matches'
                      ? 'bg-neutral-100 text-neutral-950 font-bold shadow'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                  }`}
                >
                  <Shirt className="w-3.5 h-3.5" />
                  Curated Matches ({matchedProducts.length})
                </button>

                {visionAnalysis && (
                  <button
                    id="tab-vision"
                    onClick={() => setActiveTab('vision')}
                    className={`flex items-center gap-2 py-2 px-4 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                      activeTab === 'vision'
                        ? 'bg-neutral-100 text-neutral-950 font-bold shadow'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Vision Deconstruction
                  </button>
                )}

                {styleRecommendations && (
                  <button
                    id="tab-style"
                    onClick={() => setActiveTab('style')}
                    className={`flex items-center gap-2 py-2 px-4 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                      activeTab === 'style'
                        ? 'bg-neutral-100 text-neutral-950 font-bold shadow'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    Editorial Styling
                  </button>
                )}

                <button
                  id="tab-geo"
                  onClick={() => setActiveTab('geo')}
                  className={`flex items-center gap-2 py-2 px-4 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                    activeTab === 'geo'
                      ? 'bg-neutral-100 text-neutral-950 font-bold shadow'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  Geographic Stock ({currentRegion.code})
                </button>
              </div>
            </div>

            {/* Tab Panes */}
            <div>
              {activeTab === 'matches' && (
                <ZaraMatchesSection
                  products={matchedProducts}
                  currentRegion={currentRegion}
                  onSelectProduct={(p) => setSelectedProductForModal(p)}
                  savedProductIds={savedProducts.map(p => p.id)}
                  onToggleSave={handleToggleSave}
                  querySummary={querySummary}
                />
              )}

              {activeTab === 'vision' && visionAnalysis && (
                <VisionAnalysisCard analysis={visionAnalysis} />
              )}

              {activeTab === 'style' && styleRecommendations && (
                <StyleRecommendationsSection recommendations={styleRecommendations} />
              )}

              {activeTab === 'geo' && (
                <GeoAvailabilitySection
                  products={matchedProducts}
                  currentRegion={currentRegion}
                  availableRegions={availableRegions}
                  onSelectRegion={handleSelectRegion}
                  onSelectProduct={(p) => setSelectedProductForModal(p)}
                />
              )}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-8 bg-neutral-950 text-neutral-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-brand text-lg text-neutral-300">RIA</span>
            <span>Style Agent Architecture • Endpoints: /api/vision, /api/style, /api/products/match, /api/products/geo</span>
          </div>
          <div>
            <span>Active Region: {currentRegion.name} ({currentRegion.currency})</span>
          </div>
        </div>
      </footer>

      {/* Product Details Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        currentRegion={currentRegion}
        isOpen={!!selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        isSaved={selectedProductForModal ? savedProducts.some(p => p.id === selectedProductForModal.id) : false}
        onToggleSave={handleToggleSave}
      />

      {/* Saved Lookbook Drawer */}
      <SavedLookbookDrawer
        isOpen={isLookbookOpen}
        onClose={() => setIsLookbookOpen(false)}
        savedProducts={savedProducts}
        currentRegion={currentRegion}
        onRemove={(id) => setSavedProducts(prev => prev.filter(p => p.id !== id))}
        onSelectProduct={(p) => {
          setIsLookbookOpen(false);
          setSelectedProductForModal(p);
        }}
      />
    </div>
  );
}
