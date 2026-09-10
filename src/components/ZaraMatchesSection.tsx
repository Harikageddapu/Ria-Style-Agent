import React, { useState } from 'react';
import { Sparkles, Bookmark, ExternalLink, Info, Filter, Check, ShoppingBag, MapPin } from 'lucide-react';
import { ZaraProduct, GeoRegion } from '../types';

interface ZaraMatchesSectionProps {
  products: ZaraProduct[];
  currentRegion: GeoRegion;
  onSelectProduct: (product: ZaraProduct) => void;
  savedProductIds: string[];
  onToggleSave: (product: ZaraProduct) => void;
  querySummary?: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Matched' },
  { id: 'outerwear', label: 'Outerwear' },
  { id: 'tops', label: 'Tops & Shirts' },
  { id: 'bottoms', label: 'Trousers' },
  { id: 'dresses', label: 'Dresses' },
  { id: 'shoes', label: 'Footwear' },
  { id: 'accessories', label: 'Bags & Accents' },
];

export const ZaraMatchesSection: React.FC<ZaraMatchesSectionProps> = ({
  products,
  currentRegion,
  onSelectProduct,
  savedProductIds,
  onToggleSave,
  querySummary,
}) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Header and Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              Ria Catalog Engine
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <h3 className="font-editorial text-2xl sm:text-3xl text-neutral-100 font-medium tracking-tight">
            Matched Collection Pieces
          </h3>
          {querySummary && (
            <p className="text-xs text-neutral-400 mt-1">
              {querySummary}
            </p>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-neutral-100 text-neutral-950 font-medium'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const isSaved = savedProductIds.includes(product.id);
          const regionalInfo = product.geoAvailability[currentRegion.code] || {
            available: true,
            localPrice: product.price,
            currencySymbol: currentRegion.symbol,
            deliveryDays: '2-3 Business Days',
            featuredStore: `Zara Flagship ${currentRegion.country}`,
          };

          return (
            <div
              key={product.id}
              id={`zara-item-${product.id}`}
              className="group rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div>
                {/* Image Container */}
                <div 
                  className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950 cursor-pointer"
                  onClick={() => onSelectProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white font-mono text-[11px] uppercase tracking-wider border border-white/10">
                      {product.matchScore}% Match
                    </span>

                    <button
                      id={`save-btn-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(product);
                      }}
                      className={`p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
                        isSaved
                          ? 'bg-white text-neutral-950 shadow-md'
                          : 'bg-black/60 text-white hover:bg-black/80'
                      }`}
                      title={isSaved ? 'Remove from Lookbook' : 'Save to Lookbook'}
                    >
                      <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Collection label */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-white/90 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      {product.collection}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider block">
                        {product.reference}
                      </span>
                      <h4 
                        onClick={() => onSelectProduct(product)}
                        className="font-medium text-base text-neutral-100 mt-0.5 hover:text-white cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-base font-semibold text-neutral-100">
                        {regionalInfo.currencySymbol}
                        {regionalInfo.localPrice}
                      </span>
                      <span className="block text-[10px] font-mono text-neutral-400 uppercase">
                        {currentRegion.code} Pricing
                      </span>
                    </div>
                  </div>

                  {/* Match reasoning */}
                  <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800/80">
                    <span className="font-medium text-neutral-200">Matching Analysis: </span>
                    {product.matchReason}
                  </p>

                  {/* Geo store hint */}
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">
                      In Stock: {regionalInfo.featuredStore}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 pt-0 border-t border-neutral-800/80 mt-2 flex items-center gap-2">
                <button
                  id={`view-specs-${product.id}`}
                  onClick={() => onSelectProduct(product)}
                  className="flex-1 py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium uppercase tracking-wider text-center transition-colors"
                >
                  View Details
                </button>
                <a
                  href={product.zaraUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                  title="Open on Zara.com"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
