'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Clock, ArrowRight } from 'lucide-react';

export default function TopBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 32, seconds: 22 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 2, minutes: 45, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="w-full bg-[#0a2f96] text-white py-2 px-4 text-center text-xs font-medium border-b border-blue-400/20 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 font-semibold text-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
          First week $1.
        </span>
        <span className="text-white/90">
          Offer ends 11:59pm tonight:
        </span>
        <span className="font-mono bg-black/40 text-yellow-300 px-2 py-0.5 rounded font-bold tracking-wider border border-yellow-400/30 text-xs">
          {format(timeLeft.hours)}:{format(timeLeft.minutes)}:{format(timeLeft.seconds)}
        </span>
        <Link
          href="/dashboard"
          className="ml-2 underline text-blue-200 hover:text-white inline-flex items-center gap-1 font-semibold"
        >
          Claim $1 Access <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
