'use client';

import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { createClient } from '@/lib/supabase/client';
import {
  User as UserIcon,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Check,
  Edit3,
  X,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function UserProfileDropdown() {
  const { user, signOut, refreshUser } = useAuth();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Profile Edit State
  const initialUsername =
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Trader';
  const initialTradingStyle = user?.user_metadata?.trading_style || 'Intraday Scalper';

  const [username, setUsername] = useState(initialUsername);
  const [tradingStyle, setTradingStyle] = useState(initialTradingStyle);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!user) return null;

  const userAvatar = user.user_metadata?.avatar_url;
  const displayName = user.user_metadata?.username || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Trader';
  const initialLetter = displayName.charAt(0).toUpperCase();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          username: username.trim(),
          trading_style: tradingStyle,
        },
      });

      if (error) throw error;
      await refreshUser();
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setShowModal(false);
      }, 800);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all shadow-sm"
        >
          {/* Avatar */}
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={displayName}
              className="w-7 h-7 rounded-full object-cover border border-white/40"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs border border-white/40 shadow-inner">
              {initialLetter}
            </div>
          )}

          <div className="flex flex-col text-left">
            <span className="text-xs font-bold font-mono tracking-tight truncate max-w-[110px]">
              @{displayName}
            </span>
          </div>

          <ChevronDown className={`w-3.5 h-3.5 text-white/70 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 mt-2 w-72 rounded-3xl bg-white border border-slate-200 shadow-2xl z-50 p-4 space-y-3 text-slate-900 animate-in fade-in slide-in-from-top-2 duration-150">
              
              {/* User Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={displayName}
                    className="w-11 h-11 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-blue-500/25">
                    {initialLetter}
                  </div>
                )}
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-900 truncate">@{displayName}</span>
                    <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-blue-100 text-blue-700 font-mono">
                      PRO
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono truncate block">{user.email}</span>
                </div>
              </div>

              {/* Account Status Pill */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                  Plan Status
                </span>
                <span className="font-bold font-mono text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Active Pro
                </span>
              </div>

              {/* Action Links */}
              <div className="space-y-1 pt-1 text-xs font-semibold">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowModal(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-blue-600" />
                  <span>Edit Profile & Username</span>
                </button>

                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <Zap className="w-4 h-4 text-yellow-600" />
                  <span>AI Trading Workspace</span>
                </Link>
              </div>

              {/* Sign Out Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={async () => {
                    setIsOpen(false);
                    await signOut();
                    window.location.href = '/login';
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition-colors text-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Profile & Username Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                Edit Profile & Trader ID
              </h3>
              <p className="text-xs text-slate-500">
                Customize your trading handle and default market parameters.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                  Trader Username
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm font-bold">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="satoshi_trader"
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-mono font-bold text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                  Trading Style / Strategy
                </label>
                <select
                  value={tradingStyle}
                  onChange={(e) => setTradingStyle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
                >
                  <option value="Intraday Scalper">Intraday Scalper (5m - 15m)</option>
                  <option value="Structure Day Trader">Structure Day Trader (15m - 1h)</option>
                  <option value="Order Block Swing Trader">Order Block Swing Trader (4h - 1d)</option>
                  <option value="Macro Institutional">Macro Institutional (1d - 1w)</option>
                  <option value="Prediction Markets Trader">Prediction Markets Trader</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                  Registered Email
                </label>
                <input
                  type="text"
                  disabled
                  value={user.email || ''}
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 font-mono text-xs cursor-not-allowed"
                />
              </div>

              {savedSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Profile updated successfully!
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {saving ? 'Saving changes...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
