import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PortfolioComposition = () => {
  const [viewMode, setViewMode] = useState('treemap');

  const holdings = [
    { symbol: 'AAPL', name: 'Apple Inc.', value: 487392, weight: 17.1, performance: 12.4, sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', value: 423847, weight: 14.9, performance: 8.7, sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', value: 368291, weight: 12.9, performance: -2.3, sector: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', value: 312456, weight: 11.0, performance: 15.8, sector: 'Consumer Discretionary' },
    { symbol: 'TSLA', name: 'Tesla Inc.', value: 284739, weight: 10.0, performance: 24.6, sector: 'Consumer Discretionary' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', value: 256847, weight: 9.0, performance: 31.2, sector: 'Technology' },
    { symbol: 'META', name: 'Meta Platforms', value: 198374, weight: 7.0, performance: 6.8, sector: 'Technology' },
    { symbol: 'JPM', name: 'JPMorgan Chase', value: 142638, weight: 5.0, performance: 4.2, sector: 'Financial Services' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', value: 113847, weight: 4.0, performance: -1.8, sector: 'Healthcare' },
    { symbol: 'V', name: 'Visa Inc.', value: 99283, weight: 3.5, performance: 9.1, sector: 'Financial Services' },
    { symbol: 'UNH', name: 'UnitedHealth Group', value: 85629, weight: 3.0, performance: 7.3, sector: 'Healthcare' },
    { symbol: 'HD', name: 'Home Depot Inc.', value: 71384, weight: 2.5, performance: 3.6, sector: 'Consumer Discretionary' }
  ];

  const getPerformanceColor = (performance) => {
    if (performance > 15) return 'bg-success/80';
    if (performance > 5) return 'bg-success/60';
    if (performance > 0) return 'bg-success/40';
    if (performance > -5) return 'bg-warning/60';
    return 'bg-error/60';
  };

  const TreemapView = () => {
    const totalValue = holdings?.reduce((sum, holding) => sum + holding?.value, 0);
    
    return (
      <div className="h-96 bg-muted/20 rounded-lg p-4 relative overflow-hidden">
        <div className="grid grid-cols-4 gap-2 h-full">
          {holdings?.slice(0, 12)?.map((holding, index) => {
            const heightClass = index < 4 ? 'row-span-2' : index < 8 ? 'row-span-1' : 'row-span-1';
            const widthClass = holding?.weight > 10 ? 'col-span-2' : 'col-span-1';
            
            return (
              <div
                key={holding?.symbol}
                className={`${getPerformanceColor(holding?.performance)} ${heightClass} ${widthClass} rounded-lg p-3 flex flex-col justify-between hover:opacity-80 transition-opacity cursor-pointer`}
              >
                <div>
                  <div className="font-bold text-foreground text-sm">{holding?.symbol}</div>
                  <div className="text-xs text-foreground/80 truncate">{holding?.name}</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground">{holding?.weight}%</div>
                  <div className="text-xs text-foreground/80">${(holding?.value / 1000)?.toFixed(0)}K</div>
                  <div className={`text-xs font-medium ${holding?.performance >= 0 ? 'text-success' : 'text-error'}`}>
                    {holding?.performance >= 0 ? '+' : ''}{holding?.performance?.toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const PieChartView = () => {
    const sectors = holdings?.reduce((acc, holding) => {
      if (!acc?.[holding?.sector]) {
        acc[holding.sector] = { weight: 0, count: 0, performance: 0 };
      }
      acc[holding.sector].weight += holding?.weight;
      acc[holding.sector].count += 1;
      acc[holding.sector].performance += holding?.performance;
      return acc;
    }, {});

    Object.keys(sectors)?.forEach(sector => {
      sectors[sector].performance = sectors?.[sector]?.performance / sectors?.[sector]?.count;
    });

    const sectorColors = {
      'Technology': 'text-blue-400',
      'Consumer Discretionary': 'text-purple-400',
      'Financial Services': 'text-green-400',
      'Healthcare': 'text-red-400'
    };

    return (
      <div className="h-96 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-8 w-full max-w-md">
          {Object.entries(sectors)?.map(([sector, data]) => (
            <div key={sector} className="text-center">
              <div className={`w-24 h-24 rounded-full border-8 ${sectorColors?.[sector]} border-current mx-auto mb-3 flex items-center justify-center`}>
                <span className="text-lg font-bold text-foreground">{data?.weight?.toFixed(1)}%</span>
              </div>
              <div className="text-sm font-medium text-foreground">{sector}</div>
              <div className="text-xs text-muted-foreground">{data?.count} stocks</div>
              <div className={`text-xs font-medium ${data?.performance >= 0 ? 'text-success' : 'text-error'}`}>
                {data?.performance >= 0 ? '+' : ''}{data?.performance?.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Portfolio Composition</h3>
          <p className="text-sm text-muted-foreground">Position sizes and performance overview</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('treemap')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              viewMode === 'treemap' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Icon name="Grid3X3" size={16} className="mr-1" />
            Treemap
          </button>
          <button
            onClick={() => setViewMode('sectors')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              viewMode === 'sectors' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Icon name="PieChart" size={16} className="mr-1" />
            Sectors
          </button>
        </div>
      </div>
      {viewMode === 'treemap' ? <TreemapView /> : <PieChartView />}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-muted-foreground">Strong Performance (&gt;15%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span className="text-muted-foreground">Moderate (0-15%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded-full"></div>
              <span className="text-muted-foreground">Underperforming (&lt;0%)</span>
            </div>
          </div>
          <div className="text-muted-foreground">
            Last updated: {new Date()?.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioComposition;