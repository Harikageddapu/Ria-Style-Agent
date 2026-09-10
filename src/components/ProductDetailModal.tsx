import React, { useState } from 'react';
import { X, Bookmark, ExternalLink, ShieldCheck, MapPin, Sparkles, Check } from 'lucide-react';
import { ZaraProduct, GeoRegion } from '../types';

interface ProductDetailModalProps {
  product: ZaraProduct | null;
  currentRegion: GeoRegion;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (product: ZaraProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currentRegion,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('M');

  if (!isOpen || !product) return null;

  const geoInfo = product.geoAvailability[currentRegion.code] || {
    available: true,
    stockLevel: 'high',
    localPrice: product.price,
    currencySymbol: currentRegion.symbol,
    deliveryDays: '2-3 Business Days',
    featuredStore: `Zara Flagship ${currentRegion.country}`,
    sizes: [
      { size: 'XS', status: 'in_stock' },
      { size: 'S', status: 'in_stock' },
      { size: 'M', status: 'in_stock' },
      { size: 'L', status: 'few_left' },
      { size: 'XL', status: 'out_of_stock' }
    ]
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        id="product-detail-modal"
        className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="md:w-1/2 relative bg-neutral-950 flex items-center justify-center overflow-hidden min-h-[350px]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white font-mono text-xs uppercase tracking-wider border border-white/10">
              {product.matchScore}% Match
            </span>
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
                {product.collection} • {product.reference}
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-neutral-100 font-medium tracking-tight mt-1">
                {product.name}
              </h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-neutral-100">
                  {geoInfo.currencySymbol}{geoInfo.localPrice}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  VAT included ({currentRegion.name})
                </span>
              </div>
            </div>

            {/* Match Reasoning Box */}
            <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs text-neutral-300 leading-relaxed">
              <span className="font-semibold text-neutral-100 block mb-1">
                Zara Stylist Match Notes:
              </span>
              {product.matchReason}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono uppercase text-neutral-400">Available Sizes</span>
                <span className="text-neutral-400 text-[11px]">Check store inventory</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {geoInfo.sizes.map((s) => (
                  <button
                    key={s.size}
                    disabled={s.status === 'out_of_stock'}
                    onClick={() => setSelectedSize(s.size)}
                    className={`py-2 px-3.5 rounded-lg border text-xs font-mono font-medium transition-colors ${
                      selectedSize === s.size
                        ? 'bg-white text-neutral-950 border-white'
                        : s.status === 'out_of_stock'
                        ? 'bg-neutral-950 border-neutral-800/80 text-neutral-600 line-through cursor-not-allowed'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:border-neutral-500'
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Composition & Fit details */}
            <div className="space-y-1.5 pt-3 border-t border-neutral-800 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Color:</span>
                <span className="text-neutral-200">{product.color}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Composition:</span>
                <span className="text-neutral-200 text-right max-w-[65%]">{product.composition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Fit & Cut:</span>
                <span className="text-neutral-200 text-right max-w-[65%]">{product.fit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Care:</span>
                <span className="text-neutral-200 text-right max-w-[65%]">{product.care}</span>
              </div>
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="pt-4 border-t border-neutral-800 flex items-center gap-3">
            <button
              onClick={() => onToggleSave(product)}
              className={`flex-1 py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors ${
                isSaved
                  ? 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                  : 'bg-white text-neutral-950 hover:bg-neutral-200'
              }`}
            >
              <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? 'Saved in Lookbook' : 'Add to Lookbook'}
            </button>

            <a
              href={product.zaraUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors"
            >
              Zara.com <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
