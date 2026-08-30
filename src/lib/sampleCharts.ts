// Pre-rendered high quality realistic financial candlestick charts as base64 data URLs for instant 1-click testing

export interface SampleChartItem {
  id: string;
  name: string;
  ticker: string;
  timeframe: '5m' | '15m' | '1h' | '4h' | '1d' | '1w';
  description: string;
  generateDataUrl: () => string;
}

function createCandleChartSvg(params: {
  ticker: string;
  timeframe: string;
  candles: { open: number; high: number; low: number; close: number; time: string }[];
  minPrice: number;
  maxPrice: number;
}): string {
  const width = 800;
  const height = 450;
  const padding = { top: 40, right: 70, bottom: 40, left: 20 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const { minPrice, maxPrice, candles, ticker, timeframe } = params;
  const priceRange = maxPrice - minPrice;

  const getY = (price: number) => {
    return padding.top + chartH - ((price - minPrice) / priceRange) * chartH;
  };

  const candleW = Math.max(6, Math.floor(chartW / candles.length) - 4);

  let svgElements = '';

  // Grid lines & price labels
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    const p = minPrice + (priceRange / steps) * i;
    const y = getY(p);
    svgElements += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#1e293b" stroke-dasharray="3,3" stroke-width="1"/>`;
    svgElements += `<text x="${width - padding.right + 8}" y="${y + 4}" fill="#64748b" font-family="monospace" font-size="11">${p.toFixed(2)}</text>`;
  }

  // Draw Candlesticks
  candles.forEach((c, idx) => {
    const x = padding.left + idx * (chartW / candles.length) + (chartW / candles.length) / 2;
    const isBull = c.close >= c.open;
    const color = isBull ? '#10b981' : '#f43f5e';
    const topY = getY(Math.max(c.open, c.close));
    const botY = getY(Math.min(c.open, c.close));
    const candleH = Math.max(2, botY - topY);
    const wickTop = getY(c.high);
    const wickBot = getY(c.low);

    // Wick
    svgElements += `<line x1="${x}" y1="${wickTop}" x2="${x}" y2="${wickBot}" stroke="${color}" stroke-width="1.5"/>`;
    // Body
    svgElements += `<rect x="${x - candleW / 2}" y="${topY}" width="${candleW}" height="${candleH}" fill="${color}" rx="1"/>`;
  });

  const fullSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background:#080c14;">
    <rect width="${width}" height="${height}" fill="#080c14"/>
    <text x="20" y="28" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="16">${ticker}</text>
    <text x="130" y="28" fill="#06b6d4" font-family="monospace" font-weight="bold" font-size="13">${timeframe.toUpperCase()}</text>
    <text x="180" y="28" fill="#10b981" font-family="monospace" font-size="12">● LIVE FEED</text>
    ${svgElements}
  </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(fullSvg)}`;
}

export const SAMPLE_CHARTS: SampleChartItem[] = [
  {
    id: 'btc-15m',
    name: 'BTC/USDT 15M Scalp',
    ticker: 'BTC/USDT',
    timeframe: '15m',
    description: 'Intraday impulse out of 15m demand block with clear rejection wicks.',
    generateDataUrl: () => {
      const candles = [
        { open: 64200, high: 64400, low: 64150, close: 64350, time: '10:00' },
        { open: 64350, high: 64600, low: 64300, close: 64550, time: '10:15' },
        { open: 64550, high: 64800, low: 64450, close: 64480, time: '10:30' },
        { open: 64480, high: 64500, low: 64100, close: 64180, time: '10:45' }, // dip into demand
        { open: 64180, high: 64450, low: 64120, close: 64400, time: '11:00' }, // bounce
        { open: 64400, high: 64900, low: 64380, close: 64850, time: '11:15' },
        { open: 64850, high: 65400, low: 64800, close: 65350, time: '11:30' },
        { open: 65350, high: 65900, low: 65200, close: 65800, time: '11:45' },
        { open: 65800, high: 66400, low: 65700, close: 66350, time: '12:00' },
        { open: 66350, high: 66800, low: 66200, close: 66750, time: '12:15' }, // testing supply
        { open: 66750, high: 67100, low: 66500, close: 66600, time: '12:30' },
        { open: 66600, high: 66900, low: 66400, close: 66820, time: '12:45' },
      ];
      return createCandleChartSvg({
        ticker: 'BTC/USDT.P',
        timeframe: '15m',
        candles,
        minPrice: 63800,
        maxPrice: 67400,
      });
    },
  },
  {
    id: 'eth-1h',
    name: 'ETH/USD 1H Order Block',
    ticker: 'ETH/USD',
    timeframe: '1h',
    description: 'Hourly support base retest and compression towards overhead supply.',
    generateDataUrl: () => {
      const candles = [
        { open: 3450, high: 3480, low: 3420, close: 3430, time: '01:00' },
        { open: 3430, high: 3440, low: 3380, close: 3390, time: '02:00' },
        { open: 3390, high: 3410, low: 3350, close: 3360, time: '03:00' },
        { open: 3360, high: 3400, low: 3340, close: 3395, time: '04:00' }, // demand bounce
        { open: 3395, high: 3450, low: 3385, close: 3440, time: '05:00' },
        { open: 3440, high: 3490, low: 3430, close: 3485, time: '06:00' },
        { open: 3485, high: 3540, low: 3470, close: 3530, time: '07:00' },
        { open: 3530, high: 3580, low: 3510, close: 3560, time: '08:00' },
        { open: 3560, high: 3620, low: 3550, close: 3610, time: '09:00' },
        { open: 3610, high: 3650, low: 3590, close: 3600, time: '10:00' }, // supply rejection
      ];
      return createCandleChartSvg({
        ticker: 'ETH/USD',
        timeframe: '1h',
        candles,
        minPrice: 3300,
        maxPrice: 3700,
      });
    },
  },
  {
    id: 'nvda-1d',
    name: 'NVDA 1D Institutional Base',
    ticker: 'NVDA',
    timeframe: '1d',
    description: 'Daily institutional accumulation shelf with long lower absorption wicks.',
    generateDataUrl: () => {
      const candles = [
        { open: 112, high: 116, low: 110, close: 114, time: 'D1' },
        { open: 114, high: 115, low: 108, close: 109, time: 'D2' },
        { open: 109, high: 111, low: 106, close: 110, time: 'D3' },
        { open: 110, high: 117, low: 109, close: 116, time: 'D4' },
        { open: 116, high: 122, low: 115, close: 121, time: 'D5' },
        { open: 121, high: 126, low: 120, close: 125, time: 'D6' },
        { open: 125, high: 131, low: 124, close: 130, time: 'D7' },
        { open: 130, high: 135, low: 128, close: 133, time: 'D8' },
      ];
      return createCandleChartSvg({
        ticker: 'NVDA (NASDAQ)',
        timeframe: '1d',
        candles,
        minPrice: 104,
        maxPrice: 138,
      });
    },
  },
];
