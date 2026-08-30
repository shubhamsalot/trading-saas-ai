'use client';

import React, { useState } from 'react';
import { Camera, Cpu, Trophy, CheckCircle2, Zap } from 'lucide-react';
import { SAMPLE_CHARTS } from '@/lib/sampleCharts';
import Link from 'next/link';

export default function InteractiveHowItWorks() {
  const [activeStep, setActiveStep] = useState(2);

  const steps = [
    {
      step: 1,
      tag: 'Step 01',
      title: 'Screenshot Any Chart',
      desc: 'Grab a clear screenshot from TradingView, Polymarket, Binance, MT4/5, or Robinhood on your selected timeframe.',
      icon: Camera,
      badge: 'Zero API keys required',
    },
    {
      step: 2,
      tag: 'Step 02',
      title: 'Advanced AI Vision Analysis',
      desc: 'Our proprietary neural vision pipeline scans candlestick wicks, volumes, and calculates pixel-accurate supply & demand boxes in seconds.',
      icon: Cpu,
      badge: 'Under 3 seconds',
    },
    {
      step: 3,
      tag: 'Step 03',
      title: 'Win With Mathematical Edge',
      desc: 'Execute your entry inside high-probability order blocks with clear invalidation thresholds and profit targets.',
      icon: Trophy,
      badge: '76% win-rate edge',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 space-y-12">
      {/* Centered Heading */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
          Screenshot. Analyze. Win.
        </h2>
        <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto font-medium">
          In just three simple steps, start making smarter bets & trades.
        </p>
      </div>

      {/* 3 Step Interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((item) => {
          const Icon = item.icon;
          const isActive = activeStep === item.step;

          return (
            <div
              key={item.step}
              onClick={() => setActiveStep(item.step)}
              className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
                isActive
                  ? 'bg-gradient-to-b from-blue-50/90 to-white border-blue-600 shadow-xl shadow-blue-500/10 ring-2 ring-blue-600/20 scale-[1.02]'
                  : 'bg-white hover:bg-slate-50/80 border-slate-200 shadow-sm'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-colors ${
                    isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                    isActive ? 'bg-blue-600/10 text-blue-700 border border-blue-600/20' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.tag}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {item.badge}
                </span>
                <span className={`font-semibold ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                  Step {item.step}/3 →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Interactive Step Simulation Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs text-slate-300 uppercase tracking-wider font-semibold">
              Live Demo: {activeStep === 1 ? '1. Uploading Screenshot & Asset Symbol' : activeStep === 2 ? '2. Neural AI Vision Mapping' : '3. High-Confidence Trade Execution'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Visual Pipeline</span>
          </div>
        </div>

        {/* Step Preview Content */}
        {activeStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3 text-sm text-slate-300">
              <h4 className="text-lg font-bold text-white">Upload Screenshot & Enter Asset Name</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide your asset symbol (e.g. BTC/USDT, AAPL, EUR/USD) and select your exact chart timeframe: 5M, 15M, 1H, 4H, 1D, or 1W.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">✓ Works on Bitcoin, Ethereum, Solana</li>
                <li className="flex items-center gap-2">✓ Works on NVDA, TSLA, SPY, Forex pairs</li>
                <li className="flex items-center gap-2">✓ Works on Polymarket & Prediction outcome curves</li>
              </ul>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-700 bg-black/60 p-2">
              <img
                src={SAMPLE_CHARTS[0].generateDataUrl()}
                alt="Sample Chart"
                className="rounded-xl w-full h-auto object-contain"
              />
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3 text-sm text-slate-300">
              <h4 className="text-lg font-bold text-white">Pixel-Accurate Zone Detection</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our AI Vision engine calculates exact vertical coordinates for demand & supply zones, rating them weak, moderate, or strong.
              </p>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-demand/15 border border-demand/40 text-demand text-xs font-mono">
                  DEMAND ZONE: 64,120.00 — 64,850.00 (STRONG ABSORPTION)
                </div>
                <div className="p-2.5 rounded-xl bg-supply/15 border border-supply/40 text-supply text-xs font-mono">
                  SUPPLY ZONE: 66,800.00 — 67,450.00 (OVERHEAD LIQUIDITY)
                </div>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-black">
              <img
                src={SAMPLE_CHARTS[0].generateDataUrl()}
                alt="AI Overlay"
                className="w-full h-auto object-contain block"
              />
              <div className="absolute top-[20%] left-0 right-0 h-[12%] bg-supply/40 border-y border-supply flex items-center px-3 text-[10px] font-mono text-white font-bold">
                SUPPLY (66,800 - 67,450)
              </div>
              <div className="absolute top-[68%] left-0 right-0 h-[12%] bg-demand/40 border-y border-demand flex items-center px-3 text-[10px] font-mono text-white font-bold">
                DEMAND (64,120 - 64,850)
              </div>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3 text-sm text-slate-300">
              <h4 className="text-lg font-bold text-white">Execute With Full Confidence</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your trade when price sweeps into the demand zone, setting your stop-loss below the structural invalidation level.
              </p>
              <div className="p-3.5 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-200 text-xs">
                <strong className="text-white block font-bold mb-1">Recommended Plan:</strong>
                Long entry at 64,400 Demand test • Take Profit 1 at 66,800 Supply • Invalidation at 63,800 (1:3.2 Risk-Reward).
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-blue-950/60 border border-emerald-500/40 text-center space-y-3">
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto animate-bounce" />
              <h5 className="text-xl font-bold text-white">Trade Completed: +$1,420</h5>
              <p className="text-xs text-emerald-300 font-mono">Target 66,800 hit in 45 minutes</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
