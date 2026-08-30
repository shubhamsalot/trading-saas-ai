'use client';

import React from 'react';
import { Clock, Zap, Target, Layers, Globe } from 'lucide-react';

export type TimeframeOption = '5m' | '15m' | '1h' | '4h' | '1d' | '1w';

interface TimeframeSelectorProps {
  value: TimeframeOption;
  onChange: (timeframe: TimeframeOption) => void;
  disabled?: boolean;
}

const TIMEFRAMES: { id: TimeframeOption; label: string; desc: string; icon: React.ElementType }[] = [
  { id: '5m', label: '5M', desc: 'Scalp & Micro Flow', icon: Zap },
  { id: '15m', label: '15M', desc: 'Intraday Liquidity', icon: Zap },
  { id: '1h', label: '1H', desc: 'Hourly Structure', icon: Clock },
  { id: '4h', label: '4H', desc: 'Swing Order Block', icon: Target },
  { id: '1d', label: '1D', desc: 'Daily Institutional', icon: Layers },
  { id: '1w', label: '1W', desc: 'Macro Trend Base', icon: Globe },
];

export default function TimeframeSelector({ value, onChange, disabled }: TimeframeSelectorProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          Select Chart Timeframe <span className="text-rose-600 font-bold">*</span>
        </label>
        <span className="text-[11px] font-mono text-slate-500 font-medium">
          Essential for zone weight & candle meaning
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
        {TIMEFRAMES.map((tf) => {
          const isSelected = value === tf.id;
          const Icon = tf.icon;

          return (
            <button
              key={tf.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(tf.id)}
              className={`relative px-3 py-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-600/30'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 hover:border-slate-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-1.5 font-mono font-bold text-sm sm:text-base">
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-yellow-300' : 'text-blue-600'}`} />
                <span className={isSelected ? 'text-white' : 'text-slate-900'}>{tf.label}</span>
              </div>
              <span className={`text-[10px] leading-tight truncate w-full font-medium ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                {tf.desc}
              </span>
              {isSelected && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
