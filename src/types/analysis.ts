export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface ChartUpload {
  id: string;
  user_id: string;
  storage_path: string;
  ticker_guess: string | null;
  timeframe: '5m' | '15m' | '1h' | '4h' | '1d' | '1w' | string;
  created_at: string;
}

export interface ZoneLevel {
  low: number | string;
  high: number | string;
  strength: 'weak' | 'moderate' | 'strong';
  note: string;
  price_unit?: string;
  // Optional relative pixel/bounding box percentages (0 to 100) for visual overlay
  overlay_box?: {
    top_percent: number;    // % from top (for high price)
    bottom_percent: number; // % from top (for low price)
    left_percent?: number;
    right_percent?: number;
  };
}

export interface KeyLevel {
  label: string;
  price: number | string;
  type: 'support' | 'resistance' | 'pivot' | 'breakout';
  significance: string;
}

export interface ChartAnalysisResult {
  ticker_guess?: string;
  timeframe: string;
  trend_summary: string;
  market_structure?: {
    bias: 'bullish' | 'bearish' | 'neutral' | 'ranging';
    current_phase: string;
    key_observation: string;
  };
  demand_zones: ZoneLevel[];
  supply_zones: ZoneLevel[];
  key_levels?: KeyLevel[];
  confidence: 'low' | 'moderate' | 'high' | string;
  confidence_rationale?: string;
  trade_scenarios?: {
    bullish_scenario?: string;
    bearish_scenario?: string;
    invalidation_level?: string;
  };
  disclaimer: string;
}

export interface ChartAnalysisRecord {
  id: string;
  upload_id: string;
  user_id: string;
  trend_summary: string | null;
  demand_zones: ZoneLevel[] | null;
  supply_zones: ZoneLevel[] | null;
  confidence: string | null;
  raw_model_response: ChartAnalysisResult | any;
  created_at: string;
  chart_uploads?: ChartUpload;
}
