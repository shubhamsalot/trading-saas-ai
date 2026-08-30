'use client';

import React, { useState } from 'react';
import { ZoneLevel } from '@/types/analysis';
import { Eye, EyeOff, Layers, ZoomIn, ZoomOut, Maximize2, Sparkles } from 'lucide-react';

interface ChartCanvasOverlayProps {
  imageUrl: string;
  demandZones: ZoneLevel[];
  supplyZones: ZoneLevel[];
  ticker?: string;
  timeframe?: string;
}

export default function ChartCanvasOverlay({
  imageUrl,
  demandZones,
  supplyZones,
  ticker,
  timeframe,
}: ChartCanvasOverlayProps) {
  const [showDemand, setShowDemand] = useState(true);
  const [showSupply, setShowSupply] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [opacity, setOpacity] = useState(0.45);
  const [hoveredZone, setHoveredZone] = useState<{ zone: ZoneLevel; type: 'demand' | 'supply' } | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-surface-100/90 border border-surface-border rounded-xl">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">Zone Overlays</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-200 text-slate-400 border border-surface-border">
            {timeframe?.toUpperCase() || '1H'} TIMEFRAME
          </span>
        </div>

        {/* Overlay Switches */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Demand Toggle */}
          <button
            type="button"
            onClick={() => setShowDemand(!showDemand)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              showDemand
                ? 'bg-demand/15 border-demand/50 text-demand font-semibold'
                : 'bg-surface-200 border-surface-border text-slate-500 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-demand" />
            Demand Zones ({demandZones?.length || 0})
          </button>

          {/* Supply Toggle */}
          <button
            type="button"
            onClick={() => setShowSupply(!showSupply)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              showSupply
                ? 'bg-supply/15 border-supply/50 text-supply font-semibold'
                : 'bg-surface-200 border-surface-border text-slate-500 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-supply" />
            Supply Zones ({supplyZones?.length || 0})
          </button>

          {/* Price Labels Toggle */}
          <button
            type="button"
            onClick={() => setShowLabels(!showLabels)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              showLabels
                ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300'
                : 'bg-surface-200 border-surface-border text-slate-500'
            }`}
          >
            {showLabels ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            Labels
          </button>

          {/* Opacity Control */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-200 rounded-lg border border-surface-border text-xs text-slate-300">
            <span className="text-[10px] text-slate-400 uppercase">Alpha</span>
            <input
              type="range"
              min="0.15"
              max="0.85"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-16 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Zoom Toggle */}
          <button
            type="button"
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-1.5 bg-surface-200 hover:bg-surface-50 text-slate-300 rounded-lg border border-surface-border transition-colors"
            title={isZoomed ? 'Reset Zoom' : 'Zoom Chart'}
          >
            {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Chart Canvas & Visual Overlay Container */}
      <div className={`relative overflow-hidden rounded-xl border border-surface-border bg-black transition-all ${
        isZoomed ? 'scale-105 shadow-2xl z-20' : ''
      }`}>
        {/* The Base Chart Screenshot */}
        <div className="relative w-full max-h-[650px] min-h-[350px] flex items-center justify-center bg-slate-950/90 select-none">
          <img
            src={imageUrl}
            alt={ticker ? `${ticker} Chart Screenshot` : 'Trading Chart Screenshot'}
            className="w-full h-auto max-h-[650px] object-contain block mx-auto pointer-events-none"
          />

          {/* SVG & DIV Overlay Layer */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Render Demand Zones (Green) */}
            {showDemand && demandZones?.map((zone, idx) => {
              const top = zone.overlay_box?.top_percent ?? (65 + idx * 8);
              const bottom = zone.overlay_box?.bottom_percent ?? (top + 6);
              const height = Math.max(3, bottom - top);

              return (
                <div
                  key={`demand-${idx}`}
                  onMouseEnter={() => setHoveredZone({ zone, type: 'demand' })}
                  onMouseLeave={() => setHoveredZone(null)}
                  className="absolute left-0 right-0 pointer-events-auto cursor-pointer transition-all border-y border-demand/80 flex items-center justify-between px-3 group"
                  style={{
                    top: `${top}%`,
                    height: `${height}%`,
                    backgroundColor: `rgba(16, 185, 129, ${opacity})`,
                    boxShadow: '0 0 12px rgba(16, 185, 129, 0.25)',
                  }}
                >
                  {showLabels && (
                    <>
                      <div className="flex items-center gap-1.5 bg-slate-950/90 text-demand font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded border border-demand/50 shadow">
                        <span className="w-1.5 h-1.5 rounded-full bg-demand animate-pulse" />
                        DEMAND: {zone.low} - {zone.high}
                        <span className="uppercase text-[9px] px-1 bg-demand/20 rounded font-semibold">
                          {zone.strength}
                        </span>
                      </div>

                      <div className="hidden sm:block text-[10px] text-emerald-200 bg-slate-950/80 px-1.5 py-0.5 rounded border border-demand/30 truncate max-w-xs">
                        {zone.note}
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {/* Render Supply Zones (Red/Rose) */}
            {showSupply && supplyZones?.map((zone, idx) => {
              const top = zone.overlay_box?.top_percent ?? (15 + idx * 10);
              const bottom = zone.overlay_box?.bottom_percent ?? (top + 7);
              const height = Math.max(3, bottom - top);

              return (
                <div
                  key={`supply-${idx}`}
                  onMouseEnter={() => setHoveredZone({ zone, type: 'supply' })}
                  onMouseLeave={() => setHoveredZone(null)}
                  className="absolute left-0 right-0 pointer-events-auto cursor-pointer transition-all border-y border-supply/80 flex items-center justify-between px-3 group"
                  style={{
                    top: `${top}%`,
                    height: `${height}%`,
                    backgroundColor: `rgba(244, 63, 94, ${opacity})`,
                    boxShadow: '0 0 12px rgba(244, 63, 94, 0.25)',
                  }}
                >
                  {showLabels && (
                    <>
                      <div className="flex items-center gap-1.5 bg-slate-950/90 text-supply font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded border border-supply/50 shadow">
                        <span className="w-1.5 h-1.5 rounded-full bg-supply animate-pulse" />
                        SUPPLY: {zone.low} - {zone.high}
                        <span className="uppercase text-[9px] px-1 bg-supply/20 rounded font-semibold">
                          {zone.strength}
                        </span>
                      </div>

                      <div className="hidden sm:block text-[10px] text-rose-200 bg-slate-950/80 px-1.5 py-0.5 rounded border border-supply/30 truncate max-w-xs">
                        {zone.note}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Hovered Zone Details Banner */}
        {hoveredZone && (
          <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-lg bg-surface-100/95 backdrop-blur-md border border-cyan-500/40 text-xs flex items-center justify-between z-30 shadow-xl">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded font-mono font-bold uppercase text-[10px] ${
                hoveredZone.type === 'demand' ? 'bg-demand/20 text-demand border border-demand/40' : 'bg-supply/20 text-supply border border-supply/40'
              }`}>
                {hoveredZone.type} Zone ({hoveredZone.zone.strength})
              </span>
              <span className="font-mono text-slate-200 font-bold">
                {hoveredZone.zone.low} - {hoveredZone.zone.high}
              </span>
            </div>
            <p className="text-slate-300 text-xs truncate max-w-md hidden md:block">
              {hoveredZone.zone.note}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
