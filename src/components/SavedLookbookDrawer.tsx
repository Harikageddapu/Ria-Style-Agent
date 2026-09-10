import React from 'react';
import { X, Trash2, ExternalLink, Bookmark, Share2, Copy, Check } from 'lucide-react';
import { ZaraProduct, GeoRegion } from '../types';

interface SavedLookbookDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProducts: ZaraProduct[];
  currentRegion: GeoRegion;
  onRemove: (productId: string) => void;
  onSelectProduct: (product: ZaraProduct) => void;
}

export const SavedLookbookDrawer: React.FC<SavedLookbookDrawerProps> = ({
  isOpen,
  onClose,
  savedProducts,
  currentRegion,
  onRemove,
  onSelectProduct,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const totalCost = savedProducts.reduce((sum, item) => {
    const p = item.geoAvailability[currentRegion.code]?.localPrice || item.price;
    return sum + p;
  }, 0);

  const handleCopyLookbook = () => {
    const text = `Zara Style Agent - Curated Lookbook (${currentRegion.name})\n` +
      savedProducts.map(p => `- ${p.name} (${p.reference}): ${currentRegion.symbol}${p.geoAvailability[currentRegion.code]?.localPrice || p.price}`).join('\n') +
      `\nTotal Estimated: ${currentRegion.symbol}${Math.round(totalCost * 100) / 100}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          id="saved-lookbook-drawer"
          className="w-screen max-w-md bg-neutral-950 border-l border-neutral-800 p-6 flex flex-col justify-between shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-neutral-300" />
              <h3 className="font-editorial text-xl text-neutral-100 font-medium">
                Personal Zara Lookbook
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                {savedProducts.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of Saved Items */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {savedProducts.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Bookmark className="w-10 h-10 text-neutral-700 mx-auto mb-3 stroke-[1.5]" />
                <p className="font-editorial text-lg text-neutral-300">Lookbook is Empty</p>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                  Click the bookmark icon on any matched Zara product or pairing to save it to your personal lookbook.
                </p>
              </div>
            ) : (
              savedProducts.map((product) => {
                const regionalPrice = product.geoAvailability[currentRegion.code]?.localPrice || product.price;
                return (
                  <div
                    key={product.id}
                    className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-3 group hover:border-neutral-700 transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      onClick={() => onSelectProduct(product)}
                      className="w-14 h-18 object-cover rounded-lg shrink-0 cursor-pointer"
                    />

                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-[10px] text-neutral-400 block">
                        {product.reference}
                      </span>
                      <h5 
                        onClick={() => onSelectProduct(product)}
                        className="text-xs font-medium text-neutral-200 truncate cursor-pointer hover:text-white"
                      >
                        {product.name}
                      </h5>
                      <span className="font-mono text-xs font-semibold text-neutral-100 block mt-1">
                        {currentRegion.symbol}{regionalPrice}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => onRemove(product.id)}
                        className="p-1.5 rounded hover:bg-neutral-800 text-neutral-500 hover:text-rose-400 transition-colors"
                        title="Remove from Lookbook"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with totals and export */}
          {savedProducts.length > 0 && (
            <div className="pt-4 border-t border-neutral-800 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-mono uppercase text-neutral-400">
                  Total Look Investment:
                </span>
                <span className="text-lg font-mono font-bold text-neutral-100">
                  {currentRegion.symbol}{Math.round(totalCost * 100) / 100}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLookbook}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied Lookbook' : 'Copy Outfit Sheet'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
