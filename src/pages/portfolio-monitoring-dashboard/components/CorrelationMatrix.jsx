import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CorrelationMatrix = () => {
  const [timeframe, setTimeframe] = useState('30D');

  const stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'JPM'];
  
  // Mock correlation data (symmetric matrix)
  const correlationData = {
    'AAPL': { 'AAPL': 1.00, 'MSFT': 0.72, 'GOOGL': 0.68, 'AMZN': 0.65, 'TSLA': 0.34, 'NVDA': 0.58, 'META': 0.61, 'JPM': 0.23 },
    'MSFT': { 'AAPL': 0.72, 'MSFT': 1.00, 'GOOGL': 0.74, 'AMZN': 0.69, 'TSLA': 0.31, 'NVDA': 0.62, 'META': 0.64, 'JPM': 0.28 },
    'GOOGL': { 'AAPL': 0.68, 'MSFT': 0.74, 'GOOGL': 1.00, 'AMZN': 0.71, 'TSLA': 0.29, 'NVDA': 0.59, 'META': 0.78, 'JPM': 0.25 },
    'AMZN': { 'AAPL': 0.65, 'MSFT': 0.69, 'GOOGL': 0.71, 'AMZN': 1.00, 'TSLA': 0.42, 'NVDA': 0.55, 'META': 0.67, 'JPM': 0.31 },
    'TSLA': { 'AAPL': 0.34, 'MSFT': 0.31, 'GOOGL': 0.29, 'AMZN': 0.42, 'TSLA': 1.00, 'NVDA': 0.48, 'META': 0.33, 'JPM': 0.12 },
    'NVDA': { 'AAPL': 0.58, 'MSFT': 0.62, 'GOOGL': 0.59, 'AMZN': 0.55, 'TSLA': 0.48, 'NVDA': 1.00, 'META': 0.56, 'JPM': 0.19 },
    'META': { 'AAPL': 0.61, 'MSFT': 0.64, 'GOOGL': 0.78, 'AMZN': 0.67, 'TSLA': 0.33, 'NVDA': 0.56, 'META': 1.00, 'JPM': 0.27 },
    'JPM': { 'AAPL': 0.23, 'MSFT': 0.28, 'GOOGL': 0.25, 'AMZN': 0.31, 'TSLA': 0.12, 'NVDA': 0.19, 'META': 0.27, 'JPM': 1.00 }
  };

  const getCorrelationColor = (correlation) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.8) return 'bg-red-500';
    if (abs >= 0.6) return 'bg-orange-500';
    if (abs >= 0.4) return 'bg-yellow-500';
    if (abs >= 0.2) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getCorrelationIntensity = (correlation) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.8) return 'opacity-100';
    if (abs >= 0.6) return 'opacity-80';
    if (abs >= 0.4) return 'opacity-60';
    if (abs >= 0.2) return 'opacity-40';
    return 'opacity-20';
  };

  const timeframes = [
    { value: '7D', label: '7 Days' },
    { value: '30D', label: '30 Days' },
    { value: '90D', label: '90 Days' },
    { value: '1Y', label: '1 Year' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Correlation Matrix</h3>
          <p className="text-sm text-muted-foreground">Risk analysis and diversification insights</p>
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
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header row */}
          <div className="flex">
            <div className="w-16 h-8"></div>
            {stocks?.map((stock) => (
              <div key={stock} className="w-16 h-8 flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground transform -rotate-45 origin-center">
                  {stock}
                </span>
              </div>
            ))}
          </div>

          {/* Matrix rows */}
          {stocks?.map((rowStock) => (
            <div key={rowStock} className="flex">
              <div className="w-16 h-8 flex items-center justify-end pr-2">
                <span className="text-xs font-medium text-muted-foreground">{rowStock}</span>
              </div>
              {stocks?.map((colStock) => {
                const correlation = correlationData?.[rowStock]?.[colStock];
                return (
                  <div
                    key={`${rowStock}-${colStock}`}
                    className="w-16 h-8 flex items-center justify-center relative group cursor-pointer"
                  >
                    <div
                      className={`w-12 h-6 rounded ${getCorrelationColor(correlation)} ${getCorrelationIntensity(correlation)} flex items-center justify-center`}
                    >
                      <span className="text-xs font-medium text-white">
                        {correlation === 1.00 ? '1' : correlation?.toFixed(2)?.substring(1)}
                      </span>
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      {rowStock} vs {colStock}: {correlation?.toFixed(3)}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Legend and insights */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="text-sm font-medium text-foreground">Correlation Strength:</div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-3 bg-red-500 rounded"></div>
                <span className="text-xs text-muted-foreground">Very High (0.8+)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-3 bg-orange-500 rounded"></div>
                <span className="text-xs text-muted-foreground">High (0.6-0.8)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-3 bg-yellow-500 rounded"></div>
                <span className="text-xs text-muted-foreground">Medium (0.4-0.6)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-3 bg-green-500 rounded"></div>
                <span className="text-xs text-muted-foreground">Low (0.2-0.4)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-3 bg-blue-500 rounded"></div>
                <span className="text-xs text-muted-foreground">Very Low (&lt;0.2)</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
              <span className="text-muted-foreground">High correlation risk detected in Tech sector</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} color="var(--color-success)" />
              <span className="text-muted-foreground">JPM provides good diversification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrelationMatrix;