'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle,
  TrendingUp,
  Layers,
  Check,
  Zap,
} from 'lucide-react';
import TopBanner from '@/components/TopBanner';
import SocialProofToast from '@/components/SocialProofToast';
import InteractiveHowItWorks from '@/components/InteractiveHowItWorks';
import PricingSection from '@/components/PricingSection';
import FaqSection from '@/components/FaqSection';
import { SAMPLE_CHARTS } from '@/lib/sampleCharts';

export default function HomePage() {
  const [activeSample, setActiveSample] = useState(SAMPLE_CHARTS[0]);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Countdown Bar */}
      <TopBanner />

      {/* Floating Social Proof Toast */}
      <SocialProofToast />

      {/* HERO SECTION — Exact match of royal blue starry gradient */}
      <section className="relative hero-star-bg text-white pt-12 pb-36 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-400/20 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          
          {/* Social Proof Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full hero-pill text-xs font-semibold shadow-lg shadow-black/10 hover:scale-105 transition-transform cursor-default">
            <div className="flex -space-x-2 overflow-hidden items-center">
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white/50 bg-gradient-to-tr from-amber-400 to-orange-500 text-[10px] font-bold text-black flex items-center justify-center">
                AK
              </div>
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white/50 bg-gradient-to-tr from-emerald-400 to-cyan-500 text-[10px] font-bold text-black flex items-center justify-center">
                ER
              </div>
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white/50 bg-gradient-to-tr from-purple-400 to-pink-500 text-[10px] font-bold text-black flex items-center justify-center">
                MT
              </div>
            </div>

            <span className="text-white font-bold font-mono tracking-tight text-xs sm:text-sm">
              $8,777,095+
            </span>
            <span className="text-blue-100 font-normal">won by people like you</span>
            <CheckCircle className="w-3.5 h-3.5 text-blue-300 ml-0.5" />
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] glow-text">
            The #1 AI Analyzer To <br />
            <span className="italic underline decoration-blue-300/60 decoration-wavy underline-offset-8">
              Beat
            </span>{' '}
            Prediction Markets
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed font-normal">
            Patternify is your all in one platform for making money on prediction markets and trading charts with the power of AI.
          </p>

          {/* High-Converting Glossy CTA Button */}
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-base sm:text-lg shadow-2xl shadow-blue-950/40 transition-all hover:scale-105 hover:shadow-white/20 active:scale-95 group"
            >
              <span>Get My Winning Edge</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-blue-700" />
            </Link>
          </div>

          {/* Social Proof Star Rating */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold">
              <div className="flex text-emerald-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                ))}
              </div>
              <span className="text-white font-mono font-bold">4.9/5</span>
              <span className="text-blue-300">|</span>
              <span className="text-blue-100 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" /> verified by Proof
              </span>
            </div>

            <p className="text-[11px] text-blue-200/80 max-w-md mx-auto">
              *Works with Polymarket, Kalshi, TradingView, Binance & more. Patternify never touches your money or wallet.
            </p>
          </div>

        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 -mt-24 relative z-20">
        
        {/* Clean, Sleek, Intuitive Live Chart Preview Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase text-blue-600">
                  AI Pattern Recognition
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Institutional Supply & Demand Mapping
              </h3>
            </div>

            {/* Clean Sample Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {SAMPLE_CHARTS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => setActiveSample(sample)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                    activeSample.id === sample.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sample.ticker} ({sample.timeframe.toUpperCase()})
                </button>
              ))}
            </div>
          </div>

          {/* Clean High-Resolution Chart Mockup */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#080c14] shadow-inner">
            <img
              src={activeSample.generateDataUrl()}
              alt={activeSample.name}
              className="w-full h-auto max-h-[460px] object-contain block mx-auto"
            />

            {/* Clean Supply Zone Overlay */}
            <div
              className="absolute left-0 right-0 border-y border-red-500/80 bg-red-500/25 flex items-center justify-between px-4"
              style={{ top: '20%', height: '11%' }}
            >
              <span className="bg-black/90 text-red-400 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded border border-red-500/50 shadow">
                SUPPLY ZONE (Overhead Liquidity)
              </span>
              <span className="text-[10px] text-red-200 bg-black/70 px-2 py-0.5 rounded font-mono hidden sm:inline">
                High Sell-Pressure Pivot
              </span>
            </div>

            {/* Clean Demand Zone Overlay */}
            <div
              className="absolute left-0 right-0 border-y border-emerald-500/80 bg-emerald-500/25 flex items-center justify-between px-4"
              style={{ top: '68%', height: '11%' }}
            >
              <span className="bg-black/90 text-emerald-400 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded border border-emerald-500/50 shadow">
                DEMAND ZONE (Institutional Order Block)
              </span>
              <span className="text-[10px] text-emerald-200 bg-black/70 px-2 py-0.5 rounded font-mono hidden sm:inline">
                Heavy Buyer Absorption
              </span>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <Check className="w-4 h-4 text-emerald-500" /> Mandatory Asset Symbol
              </span>
              <span className="flex items-center gap-1 font-semibold text-blue-600">
                <Check className="w-4 h-4 text-blue-500" /> 6 Timeframes (5m-1w)
              </span>
            </div>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <span>Analyze Your Chart Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Section: Screenshot. Analyze. Win. */}
        <InteractiveHowItWorks />

        {/* Section: Transparent Pricing */}
        <PricingSection />

        {/* Section: FAQs */}
        <FaqSection />

        {/* Bottom CTA Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          
          <h3 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto">
            Ready to Beat The Markets With AI?
          </h3>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Join thousands of traders spotting institutional supply & demand zones before the crowd moves.
          </p>

          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-base shadow-xl transition-all hover:scale-105"
            >
              <span>Get Started For $1 Today</span>
              <ArrowRight className="w-4 h-4 text-blue-700" />
            </Link>
          </div>

          <p className="text-xs text-blue-200">
            Instant 7-day all-access trial. Cancel anytime with 1 click.
          </p>
        </div>

      </div>
    </div>
  );
}
