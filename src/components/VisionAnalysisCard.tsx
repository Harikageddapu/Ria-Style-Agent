import React from 'react';
import { Eye, Palette, Scissors, Sparkles, Layers, Tag, CheckCircle2 } from 'lucide-react';
import { VisionAnalysis } from '../types';

interface VisionAnalysisCardProps {
  analysis: VisionAnalysis;
}

export const VisionAnalysisCard: React.FC<VisionAnalysisCardProps> = ({ analysis }) => {
  return (
    <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header with Garment Type and Category */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono text-[11px] uppercase tracking-wider border border-neutral-700">
              <Eye className="w-3 h-3 text-neutral-400" />
              Vision Agent Deconstruction
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono text-[11px] uppercase tracking-wider">
              {analysis.category}
            </span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl text-neutral-100 font-medium tracking-wide">
            {analysis.garmentType}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs px-3 py-1 rounded-full bg-neutral-800/80 border border-neutral-700 text-neutral-300">
            {analysis.style}
          </span>
        </div>
      </div>

      {/* Editorial Summary */}
      <div className="bg-neutral-950/60 rounded-xl p-4 border border-neutral-800/80">
        <p className="text-xs uppercase tracking-widest font-mono text-neutral-400 mb-1">
          Lookbook Analysis
        </p>
        <p className="text-sm text-neutral-200 leading-relaxed font-sans italic">
          "{analysis.summary}"
        </p>
      </div>

      {/* Color Palette & Undertones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-neutral-950/40 p-4 border border-neutral-800/60">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-neutral-300" /> Chromatic Palette
            </span>
            <span className="text-xs text-neutral-300 font-medium">
              {analysis.color.primary}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {analysis.color.palette.map((hex, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5 group">
                <div
                  className="w-10 h-10 rounded-lg shadow-inner border border-white/20 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
                <span className="font-mono text-[10px] text-neutral-400">
                  {hex}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
            <span className="text-neutral-400">Tonal Undertone</span>
            <span className="text-neutral-200 font-medium">{analysis.color.undertone}</span>
          </div>
        </div>

        {/* Silhouette, Cut, & Material */}
        <div className="rounded-xl bg-neutral-950/40 p-4 border border-neutral-800/60 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Scissors className="w-3.5 h-3.5 text-neutral-300" /> Fabric & Tailoring
          </span>

          <div className="space-y-2 text-xs">
            <div className="flex items-start justify-between">
              <span className="text-neutral-400">Silhouette Fit:</span>
              <span className="text-neutral-200 font-medium text-right max-w-[65%]">{analysis.fit}</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-neutral-400">Material Composition:</span>
              <span className="text-neutral-200 font-medium text-right max-w-[65%]">{analysis.material}</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-neutral-400">Best Suited Occasion:</span>
              <span className="text-neutral-200 font-medium text-right max-w-[65%]">{analysis.occasion}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Structural Details Chips */}
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-2">
          Key Construction Details
        </span>
        <div className="flex flex-wrap gap-2">
          {analysis.details.map((detail, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-lg bg-neutral-800/60 border border-neutral-700/60 text-xs text-neutral-300 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3 h-3 text-neutral-400" />
              {detail}
            </span>
          ))}
        </div>
      </div>

      {/* Detected Components in the Outfit */}
      {analysis.detectedItems && analysis.detectedItems.length > 0 && (
        <div className="pt-2 border-t border-neutral-800">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-2">
            Identified Garment Layering
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {analysis.detectedItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950/30 border border-neutral-800/50 text-xs"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-neutral-200 font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-400 font-mono">{item.color}</span>
                  <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-300 uppercase">
                    {item.prominence}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
