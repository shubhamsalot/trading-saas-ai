'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ChartCanvasOverlay from '@/components/ChartCanvasOverlay';
import { ChartAnalysisRecord, ChartAnalysisResult } from '@/types/analysis';
import { SAMPLE_CHARTS } from '@/lib/sampleCharts';
import {
  ArrowLeft,
  Calendar,
  Layers,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Code2,
  Copy,
  Check,
  Target,
  Compass,
} from 'lucide-react';

export default function AnalysisDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<ChartAnalysisRecord | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'zones' | 'scenarios' | 'json'>('zones');
  const [copiedJson, setCopiedJson] = useState(false);

  useEffect(() => {
    async function loadAnalysis() {
      if (!id) return;
      setLoading(true);

      try {
        if (id.startsWith('demo-')) {
          const sample = SAMPLE_CHARTS[0];
          const mockResult: any = {
            id: id,
            upload_id: 'demo-upload',
            user_id: 'demo-user',
            trend_summary: 'Bullish ascending compression on the 15M timeframe with successive higher lows printing above the key demand zone.',
            demand_zones: [
              {
                low: '64,120.00',
                high: '64,850.00',
                strength: 'strong',
                note: 'Primary 15M institutional order block with strong buyer absorption on dips.',
                overlay_box: { top_percent: 68.0, bottom_percent: 78.5 },
              },
            ],
            supply_zones: [
              {
                low: '66,800.00',
                high: '67,450.00',
                strength: 'moderate',
                note: 'Overhead liquidity cluster with previous swing rejections.',
                overlay_box: { top_percent: 18.5, bottom_percent: 28.0 },
              },
            ],
            confidence: 'high',
            created_at: new Date().toISOString(),
            raw_model_response: {
              ticker_guess: 'BTC/USDT',
              timeframe: '15m',
              trend_summary: 'Bullish ascending compression on the 15M timeframe.',
              market_structure: {
                bias: 'bullish',
                current_phase: 'Markup & Liquidity Expansion',
                key_observation: 'Sustained buying volume on intraday tests of the 64,120 base.',
              },
              trade_scenarios: {
                bullish_scenario: 'Retest into 64,120 demand with continuation towards 67,400 supply.',
                bearish_scenario: 'Breakdown below 63,800 invalidates bullish setup.',
                invalidation_level: '63,800',
              },
              disclaimer: 'Informational analysis only, not financial advice — estimates are approximate.',
            },
            chart_uploads: {
              id: 'demo-upload',
              storage_path: '',
              ticker_guess: 'BTC/USDT',
              timeframe: '15m',
              created_at: new Date().toISOString(),
            },
          };

          setAnalysisData(mockResult);
          setImageUrl(sample.generateDataUrl());
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('chart_analyses')
          .select(`
            id,
            upload_id,
            user_id,
            trend_summary,
            demand_zones,
            supply_zones,
            confidence,
            raw_model_response,
            created_at,
            chart_uploads (
              id,
              storage_path,
              ticker_guess,
              timeframe,
              created_at
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) {
          setAnalysisData(data as any);

          const storagePath = (data as any).chart_uploads?.storage_path;
          if (storagePath) {
            const { data: signedData } = await supabase.storage
              .from('chart-images')
              .createSignedUrl(storagePath, 60 * 60 * 24);
            setImageUrl(signedData?.signedUrl || '');
          }
        }
      } catch (err) {
        console.error('Error loading analysis details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalysis();
  }, [id]);

  const handleCopyJson = () => {
    if (!analysisData?.raw_model_response) return;
    navigator.clipboard.writeText(JSON.stringify(analysisData.raw_model_response, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
        <p className="font-mono text-sm text-slate-600">Loading analysis data and signed image asset...</p>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Analysis Not Found</h2>
        <p className="text-sm text-slate-600">The requested chart analysis does not exist or you lack permission to view it.</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-2xl text-white text-xs font-bold shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const raw = analysisData.raw_model_response as ChartAnalysisResult;
  const ticker = analysisData.chart_uploads?.ticker_guess || raw?.ticker_guess || 'ASSET';
  const timeframe = analysisData.chart_uploads?.timeframe || raw?.timeframe || '1h';
  const demandZones = analysisData.demand_zones || raw?.demand_zones || [];
  const supplyZones = analysisData.supply_zones || raw?.supply_zones || [];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-2xl text-slate-700 hover:text-slate-900 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black text-slate-900 font-mono">
                  {ticker}
                </h1>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-mono font-bold uppercase">
                  {timeframe} Timeframe
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-mono font-bold uppercase">
                  {analysisData.confidence || 'MODERATE'} Confidence
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Analyzed on {new Date(analysisData.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Action Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab('zones')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'zones'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Supply & Demand Zones
            </button>
            <button
              onClick={() => setActiveTab('scenarios')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'scenarios'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Trade Scenarios
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'json'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Raw JSON Audit
            </button>
          </div>
        </div>

        {/* Main Analysis Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Interactive Visual Canvas Overlay (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Annotated Chart Canvas (Supply / Demand Bounding)
                </h2>
                <span className="text-xs font-mono text-blue-600 font-bold">Interactive Overlay</span>
              </div>

              {imageUrl ? (
                <ChartCanvasOverlay
                  imageUrl={imageUrl}
                  demandZones={demandZones}
                  supplyZones={supplyZones}
                  ticker={ticker}
                  timeframe={timeframe}
                />
              ) : (
                <div className="p-12 text-center text-slate-400 font-mono text-xs border border-slate-200 rounded-2xl bg-slate-50">
                  No image preview available for this historical record.
                </div>
              )}

              {/* Disclaimer Alert */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-slate-900">Mandatory Disclaimer:</strong> Informational and educational analysis only, not financial advice. Zone prices and levels are visual pixel estimates derived by Neural AI Vision from screenshot coordinates.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Structured Insights, Zones, Scenarios (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Trend & Market Structure Summary Card */}
            <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-600" />
                Structure & Trend Analysis ({timeframe.toUpperCase()})
              </h3>

              <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 font-medium">
                {analysisData.trend_summary}
              </p>

              {raw?.market_structure && (
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">
                      Market Bias
                    </span>
                    <span className={`font-mono font-bold capitalize flex items-center gap-1.5 ${
                      raw.market_structure.bias === 'bullish' ? 'text-emerald-600' : raw.market_structure.bias === 'bearish' ? 'text-rose-600' : 'text-amber-600'
                    }`}>
                      {raw.market_structure.bias === 'bullish' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {raw.market_structure.bias}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">
                      Current Phase
                    </span>
                    <span className="font-mono font-bold text-blue-700 truncate block">
                      {raw.market_structure.current_phase || 'Markup Phase'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Tab Content */}
            {activeTab === 'zones' && (
              <div className="space-y-4">
                {/* Demand Zones List */}
                <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Demand Zones (Buying Pressure)
                    </h4>
                    <span className="text-xs font-mono text-emerald-700 font-bold">
                      {demandZones.length} Zones
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {demandZones.map((zone: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-sm text-emerald-900">
                            {zone.low} — {zone.high}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {zone.strength} strength
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {zone.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supply Zones List */}
                <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      Supply Zones (Selling Pressure)
                    </h4>
                    <span className="text-xs font-mono text-rose-700 font-bold">
                      {supplyZones.length} Zones
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {supplyZones.map((zone: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-sm text-rose-900">
                            {zone.low} — {zone.high}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            {zone.strength} strength
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {zone.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'scenarios' && (
              <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-xl">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  Hypothetical Trade Scenarios & Invalidation
                </h4>

                <div className="space-y-3 text-xs">
                  {raw?.trade_scenarios?.bullish_scenario && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                      <strong className="text-emerald-800 block font-mono text-xs font-bold">
                        ▲ Bullish Continuation Path
                      </strong>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {raw.trade_scenarios.bullish_scenario}
                      </p>
                    </div>
                  )}

                  {raw?.trade_scenarios?.bearish_scenario && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                      <strong className="text-rose-800 block font-mono text-xs font-bold">
                        ▼ Bearish Rejection Path
                      </strong>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {raw.trade_scenarios.bearish_scenario}
                      </p>
                    </div>
                  )}

                  {raw?.trade_scenarios?.invalidation_level && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                      <strong className="text-amber-800 block font-mono text-xs font-bold">
                        ◆ Setup Invalidation Threshold
                      </strong>
                      <p className="text-slate-700 font-mono text-xs font-semibold">
                        {raw.trade_scenarios.invalidation_level}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'json' && (
              <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-600" />
                    Full Model Payload Audit
                  </h4>
                  <button
                    onClick={handleCopyJson}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 font-semibold"
                  >
                    {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedJson ? 'Copied' : 'Copy JSON'}
                  </button>
                </div>

                <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-96 leading-relaxed">
                  {JSON.stringify(analysisData.raw_model_response, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
