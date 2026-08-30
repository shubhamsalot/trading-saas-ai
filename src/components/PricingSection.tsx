'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <section id="pricing" className="py-16 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Transparent Pricing
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
          Simple, High-Yield Plans
        </h2>
        <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto">
          Start for just $1 today. Cancel anytime with 1 click.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className="w-12 h-6 bg-blue-600 rounded-full p-1 transition-colors relative"
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${billingCycle === 'annual' ? 'translate-x-6' : ''}`} />
          </button>
          <span className={`text-xs font-semibold ${billingCycle === 'annual' ? 'text-slate-900' : 'text-slate-400'} flex items-center gap-1`}>
            Annual <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">Save 35%</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        {/* Tier 1: 7-Day Trial Offer ($1 Promo) */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-blue-900 to-indigo-950 text-white border-2 border-yellow-400 shadow-2xl relative flex flex-col justify-between space-y-6">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-slate-950 text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
            Most Popular • Offer Ends Tonight
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <span className="text-xs uppercase font-mono text-yellow-300 font-bold tracking-wider">
                Special Intro Offer
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">7-Day All-Access Pass</h3>
              <p className="text-xs text-blue-200 mt-1">
                Full unlimited access to Neural AI Vision chart analysis.
              </p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black font-mono text-white">$1</span>
              <span className="text-xs text-blue-200">first 7 days, then $19/mo</span>
            </div>

            <ul className="space-y-2.5 text-xs text-blue-100 pt-2 border-t border-blue-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>Unlimited chart screenshot uploads</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>All 6 timeframes (5m, 15m, 1h, 4h, 1d, 1w)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>Interactive canvas supply/demand overlay</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>Encrypted Supabase history storage</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>Hypothetical trade scenarios & invalidations</span>
              </li>
            </ul>
          </div>

          <Link
            href="/dashboard"
            className="w-full py-3.5 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-sm text-center shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>Get Started for $1</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Tier 2: Pro Annual Pass */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase font-mono text-blue-600 font-bold tracking-wider">
                Serious Traders
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">Pro Membership</h3>
              <p className="text-xs text-slate-500 mt-1">
                For active day traders & swing portfolio managers.
              </p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black font-mono text-slate-900">
                {billingCycle === 'annual' ? '$14' : '$29'}
              </span>
              <span className="text-xs text-slate-500">/ month {billingCycle === 'annual' ? '(billed yearly)' : ''}</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Everything in Intro Pass</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Multi-timeframe zone confluence checks</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Priority AI Vision inference speed</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Export analysis reports to PDF / JSON</span>
              </li>
            </ul>
          </div>

          <Link
            href="/dashboard"
            className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm text-center shadow-sm transition-all"
          >
            Choose Pro Plan
          </Link>
        </div>

        {/* Tier 3: Founder Lifetime */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase font-mono text-purple-600 font-bold tracking-wider">
                Founder Tier
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">Lifetime Edge</h3>
              <p className="text-xs text-slate-500 mt-1">
                Pay once, use forever. Includes future v2 live price feed updates.
              </p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black font-mono text-slate-900">$149</span>
              <span className="text-xs text-slate-500">one-time payment</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Lifetime unlimited AI chart scans</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Early access to live-feed WebSocket charts (v2)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>VIP Discord private alpha community</span>
              </li>
            </ul>
          </div>

          <Link
            href="/dashboard"
            className="w-full py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm text-center shadow-md transition-all"
          >
            Get Lifetime Access
          </Link>
        </div>
      </div>
    </section>
  );
}
