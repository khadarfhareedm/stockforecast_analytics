import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const RiskReturnScatter = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [timeframe, setTimeframe] = useState('1Y');

  const portfolioData = [
    { symbol: 'AAPL', return: 18.4, risk: 24.2, confidence: 0.87, marketCap: 2800, sector: 'Technology', prediction: 12.3 },
    { symbol: 'MSFT', return: 15.7, risk: 22.1, confidence: 0.84, marketCap: 2400, sector: 'Technology', prediction: 8.9 },
    { symbol: 'GOOGL', return: -2.3, risk: 28.4, confidence: 0.72, marketCap: 1600, sector: 'Technology', prediction: -1.2 },
    { symbol: 'AMZN', return: 24.6, risk: 32.1, confidence: 0.79, marketCap: 1400, sector: 'Consumer Discretionary', prediction: 15.8 },
    { symbol: 'TSLA', return: 31.2, risk: 45.8, confidence: 0.65, marketCap: 800, sector: 'Consumer Discretionary', prediction: 24.6 },
    { symbol: 'NVDA', return: 42.1, risk: 38.9, confidence: 0.91, marketCap: 1200, sector: 'Technology', prediction: 31.2 },
    { symbol: 'META', return: 12.8, risk: 35.2, confidence: 0.76, marketCap: 900, sector: 'Technology', prediction: 6.8 },
    { symbol: 'JPM', return: 8.2, risk: 18.7, confidence: 0.82, marketCap: 450, sector: 'Financial Services', prediction: 4.2 },
    { symbol: 'JNJ', return: -1.8, risk: 14.3, confidence: 0.88, marketCap: 420, sector: 'Healthcare', prediction: -1.8 },
    { symbol: 'V', return: 16.1, risk: 19.4, confidence: 0.85, marketCap: 480, sector: 'Financial Services', prediction: 9.1 },
    { symbol: 'UNH', return: 14.3, risk: 16.8, confidence: 0.89, marketCap: 520, sector: 'Healthcare', prediction: 7.3 },
    { symbol: 'HD', return: 7.6, risk: 21.2, confidence: 0.81, marketCap: 380, sector: 'Consumer Discretionary', prediction: 3.6 }
  ];

  const sectorColors = {
    'Technology': '#3B82F6',
    'Consumer Discretionary': '#8B5CF6',
    'Financial Services': '#10B981',
    'Healthcare': '#EF4444'
  };

  const timeframes = [
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '1Y', label: '1 Year' },
    { value: '3Y', label: '3 Years' }
  ];

  const getBubbleSize = (marketCap) => {
    const minSize = 8;
    const maxSize = 24;
    const minCap = Math.min(...portfolioData?.map(d => d?.marketCap));
    const maxCap = Math.max(...portfolioData?.map(d => d?.marketCap));
    return minSize + ((marketCap - minCap) / (maxCap - minCap)) * (maxSize - minSize);
  };

  const getQuadrantLabel = (x, y) => {
    const avgReturn = portfolioData?.reduce((sum, d) => sum + d?.return, 0) / portfolioData?.length;
    const avgRisk = portfolioData?.reduce((sum, d) => sum + d?.risk, 0) / portfolioData?.length;
    
    if (x > avgReturn && y < avgRisk) return 'High Return, Low Risk';
    if (x > avgReturn && y > avgRisk) return 'High Return, High Risk';
    if (x < avgReturn && y < avgRisk) return 'Low Return, Low Risk';
    return 'Low Return, High Risk';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Risk-Return Analysis</h3>
          <p className="text-sm text-muted-foreground">Portfolio positioning and prediction confidence</p>
        </div>
        <div className="flex items-center space-x-2">
          {timeframes?.map((tf) => (
            <button
              key={tf?.value}
              onClick={() => setTimeframe(tf?.value)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                timeframe === tf?.value 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tf?.label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative">
        {/* Chart container */}
        <div className="h-96 bg-muted/10 rounded-lg p-4 relative overflow-hidden">
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--color-border)" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Axis lines */}
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="var(--color-border)" strokeWidth="1" opacity="0.5" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="var(--color-border)" strokeWidth="1" opacity="0.5" />
          </svg>

          {/* Quadrant labels */}
          <div className="absolute top-4 left-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
            Low Return, High Risk
          </div>
          <div className="absolute top-4 right-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
            High Return, High Risk
          </div>
          <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
            Low Return, Low Risk
          </div>
          <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
            High Return, Low Risk
          </div>

          {/* Data points */}
          {portfolioData?.map((stock) => {
            const x = ((stock?.return + 50) / 100) * 100; // Normalize to 0-100%
            const y = 100 - ((stock?.risk / 50) * 100); // Invert Y axis, normalize to 0-100%
            const size = getBubbleSize(stock?.marketCap);
            
            return (
              <div
                key={stock?.symbol}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ 
                  left: `${Math.max(5, Math.min(95, x))}%`, 
                  top: `${Math.max(5, Math.min(95, y))}%` 
                }}
                onClick={() => setSelectedStock(selectedStock === stock?.symbol ? null : stock?.symbol)}
              >
                <div
                  className="rounded-full border-2 border-white shadow-lg transition-all duration-200 group-hover:scale-110"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: sectorColors?.[stock?.sector],
                    opacity: stock?.confidence
                  }}
                ></div>
                {/* Stock label */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-medium text-foreground bg-background/90 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {stock?.symbol}
                </div>
                {/* Detailed tooltip */}
                {selectedStock === stock?.symbol && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-popover border border-border rounded-lg p-3 shadow-lg z-10 min-w-48">
                    <div className="text-sm font-semibold text-foreground mb-2">{stock?.symbol}</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Return:</span>
                        <span className={stock?.return >= 0 ? 'text-success' : 'text-error'}>
                          {stock?.return >= 0 ? '+' : ''}{stock?.return?.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Risk (Volatility):</span>
                        <span className="text-foreground">{stock?.risk?.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Prediction:</span>
                        <span className={stock?.prediction >= 0 ? 'text-success' : 'text-error'}>
                          {stock?.prediction >= 0 ? '+' : ''}{stock?.prediction?.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Confidence:</span>
                        <span className="text-foreground">{(stock?.confidence * 100)?.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Market Cap:</span>
                        <span className="text-foreground">${stock?.marketCap}B</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sector:</span>
                        <span className="text-foreground">{stock?.sector}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Axis labels */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">Lower Risk</span>
          <span className="text-xs text-muted-foreground font-medium">Risk (Volatility) →</span>
          <span className="text-xs text-muted-foreground">Higher Risk</span>
        </div>
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between items-center -ml-16 py-4">
          <span className="text-xs text-muted-foreground transform -rotate-90 whitespace-nowrap">Higher Return</span>
          <span className="text-xs text-muted-foreground font-medium transform -rotate-90 whitespace-nowrap">← Return</span>
          <span className="text-xs text-muted-foreground transform -rotate-90 whitespace-nowrap">Lower Return</span>
        </div>
      </div>
      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="text-sm font-medium text-foreground">Sectors:</div>
            <div className="flex items-center space-x-4">
              {Object.entries(sectorColors)?.map(([sector, color]) => (
                <div key={sector} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-xs text-muted-foreground">{sector}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} color="var(--color-muted-foreground)" />
              <span className="text-muted-foreground">Bubble size = Market Cap | Opacity = Confidence</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskReturnScatter;