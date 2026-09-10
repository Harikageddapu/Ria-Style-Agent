import React from 'react';
import { Sparkles, Globe, Bookmark, RefreshCw, Shirt } from 'lucide-react';
import { GeoRegion } from '../types';

interface HeaderProps {
  currentRegion: GeoRegion;
  availableRegions: GeoRegion[];
  onSelectRegion: (region: GeoRegion) => void;
  savedCount: number;
  onOpenLookbook: () => void;
  onReset: () => void;
  loading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentRegion,
  availableRegions,
  onSelectRegion,
  savedCount,
  onOpenLookbook,
  onReset,
  loading,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-neutral-950/90 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={onReset} id="brand-header">
          <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-950 flex items-center justify-center font-bold tracking-tighter text-lg font-brand">
            R
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-brand text-2xl tracking-[0.25em] uppercase font-light text-neutral-100">
                RIA
              </span>
              <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono border border-neutral-700">
                Style Agent
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-sans tracking-wide hidden sm:block">
              Vision Analysis • Catalog Matching • Editorial Styling
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Geo Region Switcher */}
          <div className="relative">
            <button
              id="geo-region-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-sm font-medium transition-colors text-neutral-200"
              title="Change shopping region"
            >
              <Globe className="w-4 h-4 text-neutral-400" />
              <span className="text-base">{currentRegion.flag}</span>
              <span className="font-mono text-xs hidden sm:inline">{currentRegion.code} ({currentRegion.currency})</span>
            </button>

            {dropdownOpen && (
              <div 
                id="geo-dropdown-menu"
                className="absolute right-0 mt-2 w-56 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-2 border-b border-neutral-800 text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  Select Geographic Region
                </div>
                {availableRegions.map((r) => (
                  <button
                    key={r.code}
                    onClick={() => {
                      onSelectRegion(r);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-xs flex items-center justify-between hover:bg-neutral-800 transition-colors ${
                      r.code === currentRegion.code ? 'bg-neutral-800/80 text-white font-medium' : 'text-neutral-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{r.flag}</span>
                      <span>{r.name}</span>
                    </span>
                    <span className="font-mono text-neutral-400">{r.currency}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Saved Lookbook Counter */}
          <button
            id="saved-lookbook-btn"
            onClick={onOpenLookbook}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-sm font-medium text-neutral-200 transition-colors relative"
            title="Saved looks & matched garments"
          >
            <Bookmark className="w-4 h-4 text-neutral-400" />
            <span className="hidden sm:inline text-xs uppercase tracking-wider">Lookbook</span>
            {savedCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-neutral-950 text-[11px] font-bold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* Reset / New Scan */}
          <button
            id="reset-scan-btn"
            onClick={onReset}
            disabled={loading}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-100 transition-colors disabled:opacity-50"
            title="Analyze new garment"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-neutral-200' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
