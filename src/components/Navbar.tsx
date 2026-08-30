'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import UserProfileDropdown from './UserProfileDropdown';
import { TrendingUp, ArrowRight, BarChart2, User, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0d3eb8]/95 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-white text-blue-700 flex items-center justify-center font-black shadow-md shadow-black/20 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5 text-blue-700" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white flex items-center">
              Patternify<span className="text-blue-300 font-mono text-sm font-medium">.io</span>
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="/#features"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="/#how-it-works"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              How It Works
            </a>
            <a
              href="/#faqs"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              FAQs
            </a>
            <a
              href="/#pricing"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              Pricing
            </a>
            <Link
              href="/dashboard"
              className="text-yellow-300 hover:text-yellow-200 text-sm font-semibold flex items-center gap-1.5 transition-colors"
            >
              <BarChart2 className="w-4 h-4" />
              Live Terminal
            </Link>
          </nav>
        </div>

        {/* User Auth Actions (Desktop) */}
        <div className="hidden sm:flex items-center gap-3">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <UserProfileDropdown />
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link
                    href="/login"
                    className="text-white/90 hover:text-white text-sm font-medium px-3 py-1.5 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-lg shadow-black/15 transition-all hover:scale-105 flex items-center gap-1.5"
                  >
                    <span>Get My Winning Edge</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Toggle & Actions */}
        <div className="flex sm:hidden items-center gap-2">
          {!loading && user && <UserProfileDropdown />}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-white/10 bg-[#0d3eb8] px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-white/90">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl bg-white/10 text-yellow-300 font-bold flex items-center gap-2"
            >
              <BarChart2 className="w-4 h-4" />
              Live Terminal
            </Link>
            <a
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-white/10"
            >
              Features
            </a>
            <a
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-white/10"
            >
              How It Works
            </a>
            <a
              href="/#faqs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-white/10"
            >
              FAQs
            </a>
            <a
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-white/10"
            >
              Pricing
            </a>
          </nav>

          {!loading && !user && (
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-white/20 text-white text-sm font-semibold"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-white text-blue-700 text-sm font-bold shadow-md"
              >
                Create Free Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

