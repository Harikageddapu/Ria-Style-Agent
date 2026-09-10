import React, { useState } from 'react';
import { Globe, MapPin, Truck, Store, Check, AlertCircle, Clock } from 'lucide-react';
import { ZaraProduct, GeoRegion } from '../types';

interface GeoAvailabilitySectionProps {
  products: ZaraProduct[];
  currentRegion: GeoRegion;
  availableRegions: GeoRegion[];
  onSelectRegion: (region: GeoRegion) => void;
  onSelectProduct: (product: ZaraProduct) => void;
}

export const GeoAvailabilitySection: React.FC<GeoAvailabilitySectionProps> = ({
  products,
  currentRegion,
  availableRegions,
  onSelectRegion,
  onSelectProduct,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');

  const activeProduct = products.find(p => p.id === selectedProductId) || products[0];
  const geoInfo = activeProduct?.geoAvailability[currentRegion.code] || {
    available: true,
    stockLevel: 'high',
    localPrice: activeProduct?.price || 79.95,
    currency: currentRegion.currency,
    currencySymbol: currentRegion.symbol,
    deliveryDays: '2-3 Days',
    storesWithStock: 6,
    featuredStore: `Zara Flagship ${currentRegion.country}`,
    sizes: [
      { size: 'S', status: 'in_stock' },
      { size: 'M', status: 'in_stock' },
      { size: 'L', status: 'in_stock' }
    ]
  };

  return (
    <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header and Region Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-neutral-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              POST /api/products/geo
            </span>
          </div>
          <h3 className="font-editorial text-2xl sm:text-3xl text-neutral-100 font-medium tracking-tight">
            Geographic Inventory & Logistics
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Verify real-time stock levels, local pricing, and store availability by market.
          </p>
        </div>

        {/* Region Switcher Pills */}
        <div className="flex flex-wrap gap-1.5">
          {availableRegions.map(reg => (
            <button
              key={reg.code}
              onClick={() => onSelectRegion(reg)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                reg.code === currentRegion.code
                  ? 'bg-white text-neutral-950 shadow-md font-semibold'
                  : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300'
              }`}
            >
              <span>{reg.flag}</span>
              <span>{reg.code}</span>
              <span className="font-mono text-[11px] opacity-70">({reg.currency})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main product selector bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {products.map(prod => (
          <button
            key={prod.id}
            onClick={() => setSelectedProductId(prod.id)}
            className={`flex items-center gap-3 p-2 pr-4 rounded-xl border text-left shrink-0 transition-all ${
              prod.id === activeProduct?.id
                ? 'bg-neutral-800 border-neutral-600 shadow-md'
                : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700'
            }`}
          >
            <img
              src={prod.image}
              alt={prod.name}
              className="w-10 h-12 object-cover rounded-lg"
            />
            <div>
              <p className="text-xs font-medium text-neutral-200 line-clamp-1 max-w-[150px]">
                {prod.name}
              </p>
              <p className="text-[10px] font-mono text-neutral-400">
                {prod.reference}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Active Product Geographic Breakdown Card */}
      {activeProduct && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Product Overview Column */}
          <div className="rounded-xl bg-neutral-950/60 border border-neutral-800 p-5 space-y-4">
            <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-neutral-900">
              <img
                src={activeProduct.image}
                alt={activeProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                {activeProduct.reference}
              </span>
              <h4 className="font-medium text-base text-neutral-100 mt-0.5">
                {activeProduct.name}
              </h4>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xs text-neutral-400">Regional Price:</span>
                <span className="text-xl font-mono font-bold text-neutral-100">
                  {geoInfo.currencySymbol}{geoInfo.localPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Logistics & Stock Status */}
          <div className="lg:col-span-2 space-y-4">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono uppercase mb-1">
                  <Truck className="w-3.5 h-3.5 text-neutral-300" /> Standard Delivery
                </div>
                <p className="text-sm font-semibold text-neutral-100">
                  {geoInfo.deliveryDays}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Direct from distribution hub</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono uppercase mb-1">
                  <Store className="w-3.5 h-3.5 text-neutral-300" /> Physical Stores
                </div>
                <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> {geoInfo.storesWithStock} Flagships
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
                  {geoInfo.featuredStore}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono uppercase mb-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-300" /> Click & Collect
                </div>
                <p className="text-sm font-semibold text-neutral-100">
                  Ready in 2 Hours
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Complimentary store pickup</p>
              </div>
            </div>

            {/* Sizes & Availability Matrix */}
            <div className="p-5 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                  Size Availability in {currentRegion.name}
                </span>
                <span className="text-[11px] text-emerald-400 font-medium">
                  {geoInfo.available ? 'In Stock Online & Stores' : 'Sold Out'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {geoInfo.sizes.map((s, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-center ${
                      s.status === 'in_stock'
                        ? 'bg-neutral-900 border-neutral-700 text-neutral-100'
                        : s.status === 'few_left'
                        ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-600 opacity-60'
                    }`}
                  >
                    <span className="text-sm font-bold block font-mono">
                      {s.size}
                    </span>
                    <span className="text-[10px] uppercase font-mono block mt-1">
                      {s.status === 'in_stock' ? 'In Stock' : s.status === 'few_left' ? 'Few Left' : 'Sold Out'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Global Market Price Comparison */}
            <div className="p-4 rounded-xl bg-neutral-950/40 border border-neutral-800/80">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                Comparative Global Pricing for Reference
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                {availableRegions.map(r => {
                  const regPrice = activeProduct.geoAvailability[r.code]?.localPrice || Math.round(activeProduct.price * r.exchangeRateFromEUR);
                  return (
                    <div
                      key={r.code}
                      className={`p-2 rounded-lg border ${
                        r.code === currentRegion.code
                          ? 'bg-neutral-800 border-neutral-600 font-bold'
                          : 'bg-neutral-900/50 border-neutral-800/50 text-neutral-400'
                      }`}
                    >
                      <div className="text-sm">{r.flag}</div>
                      <div className="text-[10px] font-mono mt-0.5">{r.code}</div>
                      <div className="font-mono text-neutral-200 mt-0.5">
                        {r.symbol}{regPrice}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
