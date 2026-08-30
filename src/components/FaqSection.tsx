'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Patternify AI analyze charts from screenshots?',
      a: 'Patternify sends your uploaded screenshot along with your chosen timeframe (5m, 15m, 1h, 4h, 1d, 1w) and asset symbol to our advanced Neural AI Vision engine. The model identifies candle wick absorption, liquidity sweep patterns, and order block origin points, calculating pixel-accurate supply & demand bounding coordinates.',
    },
    {
      q: 'Do I need to connect my exchange API keys or wallet?',
      a: 'No! Patternify is purely an image and vision analysis platform. We never ask for, touch, or connect to your exchange accounts, broker logins, or crypto wallets. You simply screenshot and analyze.',
    },
    {
      q: 'Why is the Asset Name (Ticker) required?',
      a: 'Specifying the asset (e.g. BTC/USDT, AAPL, EUR/USD) allows the AI to benchmark the chart against expected market session volatility, tick structures, and typical institutional order block behaviors for that specific asset class.',
    },
    {
      q: 'Does it work with prediction markets like Polymarket & Kalshi?',
      a: 'Yes! Prediction market probability charts exhibit identical supply and demand mechanics (consolidation zones, breakout triggers, and probability order blocks). Simply take a screenshot of any market curve.',
    },
    {
      q: 'Can I cancel the $1 trial easily?',
      a: 'Yes, you can cancel anytime with 1 click from your dashboard settings. No hidden fees or cumbersome processes.',
    },
  ];

  return (
    <section id="faqs" className="py-16 space-y-10 max-w-4xl mx-auto">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          Got Questions?
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-slate-500">
          Everything you need to know about our AI vision trading analyzer.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-blue-600 transition-colors"
              >
                <span className="text-sm sm:text-base">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
