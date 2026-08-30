'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, X } from 'lucide-react';

const NOTIFICATIONS = [
  { name: 'Emma R.', location: 'Miami, FL', action: 'spotted +$1,420 Demand Bounce', time: '2 mins ago', ticker: 'BTC/USDT 15M' },
  { name: 'David K.', location: 'Austin, TX', action: 'won +$3,850 on 1H Order Block', time: '4 mins ago', ticker: 'ETH/USD 1H' },
  { name: 'Marcus L.', location: 'London, UK', action: 'gained +$940 on 4H Supply Rejection', time: '6 mins ago', ticker: 'SOL/USDT 4H' },
  { name: 'Sarah T.', location: 'Singapore', action: 'locked +$2,100 Daily Gap Fill', time: '8 mins ago', ticker: 'NVDA 1D' },
  { name: 'Alex M.', location: 'Toronto, CA', action: 'analyzed 5M Scalp breakout', time: '11 mins ago', ticker: 'EUR/USD 5M' },
];

export default function SocialProofToast() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (closed) return;

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % NOTIFICATIONS.length);
        setVisible(true);
      }, 600);
    }, 7000);

    return () => clearInterval(interval);
  }, [closed]);

  if (closed) return null;

  const item = NOTIFICATIONS[index];

  return (
    <div
      className={`fixed bottom-5 left-5 z-50 max-w-sm transition-all duration-500 ease-out transform ${
        visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md text-slate-900 px-4 py-3 rounded-2xl shadow-2xl border border-slate-200/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 shrink-0 font-bold text-xs">
          <TrendingUp className="w-4 h-4 text-blue-600" />
        </div>

        <div className="text-xs flex-1 pr-1">
          <p className="font-semibold text-slate-900 leading-tight">
            {item.name} <span className="font-normal text-slate-500 text-[11px]">from {item.location}</span>
          </p>
          <p className="text-emerald-700 font-semibold text-[11px] mt-0.5">
            {item.action}
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-600 mt-0.5 font-medium">
            <span className="font-mono bg-slate-100 px-1 py-0.2 rounded text-slate-700">{item.ticker}</span>
            <span>• {item.time}</span>
          </div>
        </div>

        <button
          onClick={() => setClosed(true)}
          className="text-slate-500 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
