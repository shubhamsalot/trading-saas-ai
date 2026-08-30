'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { createClient } from '@/lib/supabase/client';
import TimeframeSelector, { TimeframeOption } from '@/components/TimeframeSelector';
import ChartCanvasOverlay from '@/components/ChartCanvasOverlay';
import { SAMPLE_CHARTS, SampleChartItem } from '@/lib/sampleCharts';
import { ChartAnalysisResult } from '@/types/analysis';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  Activity,
  Layers,
  ChevronRight,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Zap,
  Eye,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  // Upload Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<TimeframeOption>('1h');
  const [tickerGuess, setTickerGuess] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [currentResult, setCurrentResult] = useState<{
    id: string;
    imageUrl: string;
    analysis: ChartAnalysisResult;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // History State
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTf, setFilterTf] = useState<string>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch History from Supabase
  const fetchHistory = async () => {
    if (!user) {
      setLoadingHistory(false);
      return;
    }

    try {
      setLoadingHistory(true);
      const { data, error } = await supabase
        .from('chart_analyses')
        .select(`
          id,
          upload_id,
          trend_summary,
          demand_zones,
          supply_zones,
          confidence,
          created_at,
          raw_model_response,
          chart_uploads (
            id,
            storage_path,
            ticker_guess,
            timeframe,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (err: any) {
      console.error('Error fetching analysis history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  // Handle Local File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setErrorMsg(null);
    }
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setErrorMsg(null);
    }
  };

  // Quick Load Sample Chart
  const handleLoadSample = (sample: SampleChartItem) => {
    const dataUrl = sample.generateDataUrl();
    setPreviewUrl(dataUrl);
    setTimeframe(sample.timeframe);
    setTickerGuess(sample.ticker);
    setErrorMsg(null);

    // Convert SVG Data URL to File object
    fetch(dataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `${sample.id}-chart.svg`, { type: 'image/svg+xml' });
        setSelectedFile(file);
      });
  };

  // Submit Analysis to API
  const handleAnalyze = async () => {
    if (!selectedFile && !previewUrl) {
      setErrorMsg('Please select or drop a trading chart image first.');
      return;
    }

    if (!tickerGuess || tickerGuess.trim() === '') {
      setErrorMsg('Asset Name / Ticker is required (e.g. BTC/USDT, AAPL, EUR/USD).');
      return;
    }

    setAnalyzing(true);
    setErrorMsg(null);
    setCurrentResult(null);

    try {
      setAnalysisStep('Encoding chart pixels & extracting timeframe context...');
      
      let fileToSend = selectedFile;
      if (!fileToSend && previewUrl) {
        const res = await fetch(previewUrl);
        const blob = await res.blob();
        fileToSend = new File([blob], 'chart.png', { type: blob.type || 'image/png' });
      }

      const formData = new FormData();
      formData.append('file', fileToSend!);
      formData.append('timeframe', timeframe);
      formData.append('tickerGuess', tickerGuess.trim());

      setAnalysisStep('Running Neural AI Vision Analysis...');

      const response = await fetch('/api/analyze-chart', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      setAnalysisStep('Synthesizing institutional supply & demand zones...');
      const data = await response.json();

      setCurrentResult({
        id: data.analysisId,
        imageUrl: data.imageUrl || previewUrl!,
        analysis: data.analysis,
      });

      // Refresh history list
      fetchHistory();
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setErrorMsg(err.message || 'Analysis processing failed. Please try again.');
    } finally {
      setAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const filteredHistory = history.filter((item) => {
    const ticker = item.chart_uploads?.ticker_guess || item.raw_model_response?.ticker_guess || '';
    const tf = item.chart_uploads?.timeframe || '';
    const matchesSearch = ticker.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.trend_summary || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTf = filterTf === 'all' || tf.toLowerCase() === filterTf.toLowerCase();
    return matchesSearch && matchesTf;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="font-mono text-xs text-blue-600 font-bold uppercase tracking-wider">
                Patternify AI Trading Terminal
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              AI Chart Analysis <span className="text-blue-600 font-mono">Workspace</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Upload any stock, crypto, forex, or prediction screenshot for AI supply & demand zone mapping.
            </p>
          </div>

          {/* Quick Sample Selector */}
          <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold px-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Try Samples:
            </span>
            {SAMPLE_CHARTS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleLoadSample(sample)}
                className="px-3 py-1.5 text-xs font-mono font-bold rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white border border-slate-200 text-slate-800 transition-all shadow-sm"
              >
                {sample.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Upload & Config Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Upload Dropzone & Parameters (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-600" />
                  1. Upload Chart Screenshot
                </h2>
                <span className="text-xs text-slate-500 font-mono font-medium">PNG, JPG, WEBP</span>
              </div>

              {/* Dropzone Area */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  previewUrl
                    ? 'border-blue-500 bg-blue-50/40'
                    : 'border-slate-300 hover:border-blue-500 bg-slate-50/80 hover:bg-slate-100/70'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="space-y-4">
                    <div className="relative max-h-64 overflow-hidden rounded-xl border border-slate-300 bg-black flex items-center justify-center">
                      <img
                        src={previewUrl}
                        alt="Uploaded Chart Preview"
                        className="max-h-64 w-auto object-contain mx-auto"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-3">
                        <span className="text-xs font-mono font-bold text-white bg-blue-600 px-3.5 py-1 rounded-full shadow-md">
                          ✓ Screenshot Loaded • Click to change image
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 space-y-3">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-white flex items-center justify-center text-blue-600 border border-slate-200 shadow-md">
                      <ImageIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Drag & Drop chart image here, or <span className="text-blue-600 underline">browse files</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Works with TradingView, MetaTrader, Binance, Polymarket screenshots
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeframe Selector Component */}
              <div className="pt-3 border-t border-slate-100">
                <TimeframeSelector
                  value={timeframe}
                  onChange={setTimeframe}
                  disabled={analyzing}
                />
              </div>

              {/* Mandatory Asset Symbol / Ticker Input */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    Asset Name / Ticker Symbol <span className="text-rose-600 font-bold">* Compulsory</span>
                  </label>
                  <span className="text-[11px] font-mono text-blue-600 font-semibold">
                    Required for market depth analysis
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    value={tickerGuess}
                    onChange={(e) => setTickerGuess(e.target.value)}
                    placeholder="e.g. BTC/USDT, ETH/USD, AAPL, NVDA, EUR/USD"
                    className="w-full px-4 py-3.5 bg-white border-2 border-blue-600 rounded-2xl text-slate-900 placeholder-slate-400 text-base font-mono font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Specifying the exact asset allows our AI to benchmark historical volume liquidity and structural volatility profiles.
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Action Analyze Button */}
              <button
                type="button"
                disabled={analyzing || (!selectedFile && !previewUrl)}
                onClick={handleAnalyze}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wide shadow-xl flex items-center justify-center gap-3 transition-all ${
                  analyzing || (!selectedFile && !previewUrl)
                    ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 cursor-pointer hover:scale-[1.01]'
                }`}
              >
                {analyzing ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="font-mono">{analysisStep || 'Analyzing Chart with AI Vision...'}</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span>RUN SUPPLY & DEMAND AI VISION ANALYSIS ({timeframe.toUpperCase()})</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Live Analysis Result (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {analyzing ? (
              /* Radar / Scanning State */
              <div className="bg-white border border-slate-200 p-8 rounded-3xl flex flex-col items-center justify-center text-center min-h-[420px] space-y-6 shadow-xl">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-blue-600/30 animate-ping" />
                  <div className="absolute inset-2 rounded-full border border-blue-400" />
                  <div className="w-20 h-20 rounded-full bg-blue-50 border-2 border-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <Activity className="w-9 h-9 text-blue-600 animate-pulse" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-blue-600 radar-spinner" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-mono">
                    Neural AI Vision Processing
                  </h3>
                  <p className="text-xs text-blue-600 font-mono mt-1 font-bold">
                    Asset: {tickerGuess.toUpperCase() || 'CHART'} • Timeframe: {timeframe.toUpperCase()}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto">
                    {analysisStep}
                  </p>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full w-2/3 animate-pulse" />
                </div>
              </div>
            ) : currentResult ? (
              /* Instant Result Card */
              <div className="bg-white border-2 border-blue-600 p-6 sm:p-8 rounded-3xl space-y-5 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-slate-900 text-base">
                      {currentResult.analysis.ticker_guess || tickerGuess} Analysis Ready
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-mono font-bold">
                      {timeframe.toUpperCase()}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-mono font-bold">
                      {currentResult.analysis.confidence?.toUpperCase()} CONFIDENCE
                    </span>
                  </div>
                </div>

                {/* Trend Narrative */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Trend & Structure Overview
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 font-medium">
                    {currentResult.analysis.trend_summary}
                  </p>
                </div>

                {/* Quick Zone Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Demand Zones</span>
                      <span className="font-mono text-sm font-black text-emerald-700">
                        {currentResult.analysis.demand_zones?.length || 0}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 block mt-1 font-medium">
                      Order Blocks & Support
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Supply Zones</span>
                      <span className="font-mono text-sm font-black text-rose-700">
                        {currentResult.analysis.supply_zones?.length || 0}
                      </span>
                    </div>
                    <span className="text-[10px] text-rose-600 block mt-1 font-medium">
                      Selling Liquidity & Resistance
                    </span>
                  </div>
                </div>

                {/* Deep Dive Button */}
                <Link
                  href={`/analysis/${currentResult.id}`}
                  className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md group"
                >
                  <span>View Full Annotated Chart Overlay & Deep Dive</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ) : (
              /* Information Panel */
              <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-5 shadow-xl">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  Institutional Vision Pipeline
                </h3>

                <div className="space-y-3.5 text-xs text-slate-700">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-mono flex items-center justify-center shrink-0 text-xs font-bold">
                      01
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900">Compulsory Asset Identification</h4>
                      <p className="text-slate-600 text-xs mt-0.5">
                        Ensures the AI matches known market hours, exchange liquidity depths, and tick sizes.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-mono flex items-center justify-center shrink-0 text-xs font-bold">
                      02
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900">Pixel-Accurate Zone Bounding</h4>
                      <p className="text-slate-600 text-xs mt-0.5">
                        Calculates vertical coordinates for demand & supply bands with interactive canvas overlay.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-800 font-mono flex items-center justify-center shrink-0 text-xs font-bold">
                      03
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900">Private Database & History</h4>
                      <p className="text-slate-600 text-xs mt-0.5">
                        All uploads and analyses are encrypted in Supabase Storage with strict Row-Level Security.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Chart Visual Canvas (if result exists) */}
        {currentResult && (
          <div className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Interactive Annotated Chart Overlay
              </h2>
              <Link
                href={`/analysis/${currentResult.id}`}
                className="text-xs font-mono text-blue-600 hover:underline flex items-center gap-1 font-bold"
              >
                Open Dedicated Analysis View <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <ChartCanvasOverlay
              imageUrl={currentResult.imageUrl}
              demandZones={currentResult.analysis.demand_zones}
              supplyZones={currentResult.analysis.supply_zones}
              ticker={currentResult.analysis.ticker_guess}
              timeframe={currentResult.analysis.timeframe}
            />
          </div>
        )}

        {/* Historical Analyses Section */}
        <div className="space-y-6 pt-10 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                Your Analysis History
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Saved chart uploads and AI insights stored in Supabase
              </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search ticker or trend..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 w-44 sm:w-56 font-medium shadow-sm"
              />
              
              <select
                value={filterTf}
                onChange={(e) => setFilterTf(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-mono font-semibold shadow-sm"
              >
                <option value="all">All TFs</option>
                <option value="5m">5M</option>
                <option value="15m">15M</option>
                <option value="1h">1H</option>
                <option value="4h">4H</option>
                <option value="1d">1D</option>
                <option value="1w">1W</option>
              </select>

              <button
                onClick={fetchHistory}
                className="p-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
                title="Refresh History"
              >
                <RefreshCw className={`w-4 h-4 ${loadingHistory ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* History Records Grid */}
          {loadingHistory ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl animate-pulse h-48 shadow-sm" />
              ))}
            </div>
          ) : filteredHistory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredHistory.map((item) => {
                const upload = item.chart_uploads;
                const ticker = upload?.ticker_guess || item.raw_model_response?.ticker_guess || 'ASSET';
                const tf = upload?.timeframe || '1h';
                const demandCount = item.demand_zones?.length || 0;
                const supplyCount = item.supply_zones?.length || 0;

                return (
                  <Link
                    key={item.id}
                    href={`/analysis/${item.id}`}
                    className="bg-white border border-slate-200 p-6 rounded-3xl group flex flex-col justify-between hover:border-blue-500 transition-all hover:scale-[1.01] shadow-md hover:shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-slate-900 text-base">
                            {ticker}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-mono text-[11px] font-bold uppercase">
                            {tf}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {item.trend_summary}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {demandCount} Demand
                        </span>
                        <span className="text-rose-600 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          {supplyCount} Supply
                        </span>
                      </div>

                      <span className="text-blue-600 font-bold flex items-center gap-1 text-xs group-hover:translate-x-0.5 transition-transform">
                        View <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 p-10 rounded-3xl text-center space-y-3 shadow-md">
              <Layers className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">
                {user ? 'No chart analyses found yet' : 'Sign in to sync and save your analysis history'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Upload your chart screenshot above and enter the compulsory asset symbol to generate institutional supply/demand zones.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
