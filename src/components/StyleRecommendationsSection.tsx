import React from 'react';
import { Sparkles, Compass, Lightbulb, Moon, Sun, ArrowRight, Check, Heart } from 'lucide-react';
import { StyleRecommendations } from '../types';

interface StyleRecommendationsSectionProps {
  recommendations: StyleRecommendations;
}

export const StyleRecommendationsSection: React.FC<StyleRecommendationsSectionProps> = ({
  recommendations,
}) => {
  return (
    <div className="space-y-8">
      {/* Aesthetic Concept Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-neutral-200 text-xs font-mono uppercase tracking-widest mb-3">
            <Compass className="w-3.5 h-3.5" /> Zara Styling Philosophy
          </span>
          <h3 className="font-editorial text-2xl sm:text-4xl text-neutral-100 font-medium tracking-tight mb-2">
            {recommendations.aestheticTagline}
          </h3>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
            {recommendations.concept}
          </p>
        </div>
      </div>

      {/* 4 Core Styling Tips */}
      <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-6">
        <h4 className="font-editorial text-xl text-neutral-100 mb-4 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          Stylist's Directives
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.stylingTips.map((tip, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800/80 flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 text-xs font-mono text-neutral-300">
                0{idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Wardrobe Pairings Breakdown */}
      <div>
        <h4 className="font-editorial text-2xl text-neutral-100 mb-4">
          Curated Ensemble Pairings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.pairings.map((pairing, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-neutral-900/80 border border-neutral-800 p-5 space-y-3 hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  {pairing.category}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                  Harmonized
                </span>
              </div>

              <h5 className="text-base font-medium text-neutral-100 font-sans">
                {pairing.item}
              </h5>

              <p className="text-xs text-neutral-300 leading-relaxed">
                {pairing.whyItWorks}
              </p>

              <div className="pt-2 border-t border-neutral-800/80 space-y-1.5 text-[11px]">
                <div className="flex items-start justify-between">
                  <span className="text-neutral-400">Color Resonance:</span>
                  <span className="text-neutral-300 text-right max-w-[65%]">{pairing.colorHarmony}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-neutral-400">Silhouette Proportion:</span>
                  <span className="text-neutral-300 text-right max-w-[65%]">{pairing.silhouetteBalance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Day to Night Transformation & Accessories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Day to Night Transition */}
        <div className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-6 space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
            Temporal Versatility
          </span>
          <h4 className="font-editorial text-xl text-neutral-100">
            Day-to-Night Metamorphosis
          </h4>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-medium text-amber-300">
                <Sun className="w-4 h-4" /> AM Styling (Metropolis Day)
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {recommendations.dayToNight.day}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-medium text-indigo-300">
                <Moon className="w-4 h-4" /> PM Styling (Soirée Nocturne)
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {recommendations.dayToNight.nightTransition}
              </p>
            </div>
          </div>
        </div>

        {/* Essential Accessories */}
        <div className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-6 space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
            Accoutrements
          </span>
          <h4 className="font-editorial text-xl text-neutral-100">
            Footwear & Hardware Pairings
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-neutral-950/50 border border-neutral-800">
              <span className="text-neutral-400 font-mono block mb-1">Footwear:</span>
              <span className="text-neutral-200">{recommendations.accessoryAdvice.shoes}</span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-950/50 border border-neutral-800">
              <span className="text-neutral-400 font-mono block mb-1">Handbag:</span>
              <span className="text-neutral-200">{recommendations.accessoryAdvice.bag}</span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-950/50 border border-neutral-800">
              <span className="text-neutral-400 font-mono block mb-1">Jewelry & Hardware:</span>
              <span className="text-neutral-200">{recommendations.accessoryAdvice.jewelry}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Curated High-Fashion Occasions */}
      <div>
        <h4 className="font-editorial text-2xl text-neutral-100 mb-4">
          Curated Occasions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recommendations.occasions.map((occ, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-neutral-900/60 border border-neutral-800 p-4 space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                  Scenario 0{idx + 1}
                </span>
                <h5 className="font-medium text-sm text-neutral-100 mt-1">
                  {occ.title}
                </h5>
                <p className="text-xs text-neutral-400 mt-1">
                  {occ.setting}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-800/80">
                <p className="text-xs text-neutral-300 italic">
                  "{occ.stylingNote}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
