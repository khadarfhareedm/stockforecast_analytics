import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const HoldingsTable = () => {
  const [sortField, setSortField] = useState('value');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filter, setFilter] = useState('all');

  const holdings = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 1250,
      avgCost: 145.32,
      currentPrice: 189.84,
      value: 237300,
      dayChange: 4.23,
      dayChangePercent: 2.28,
      totalReturn: 55650,
      totalReturnPercent: 30.65,
      prediction: 195.50,
      predictionChange: 2.98,
      sentiment: 0.78,
      modelConsensus: 'BUY',
      confidence: 0.87,
      sector: 'Technology',
      beta: 1.24,
      volume: '45.2M',
      marketCap: 2847
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      shares: 980,
      avgCost: 285.67,
      currentPrice: 338.11,
      value: 331348,
      dayChange: -2.45,
      dayChangePercent: -0.72,
      totalReturn: 51431,
      totalReturnPercent: 18.36,
      prediction: 345.20,
      predictionChange: 2.10,
      sentiment: 0.72,
      modelConsensus: 'BUY',
      confidence: 0.84,
      sector: 'Technology',
      beta: 0.89,
      volume: '28.7M',
      marketCap: 2512
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      shares: 420,
      avgCost: 142.89,
      currentPrice: 139.37,
      value: 58535,
      dayChange: -1.87,
      dayChangePercent: -1.32,
      totalReturn: -1478,
      totalReturnPercent: -2.46,
      prediction: 148.90,
      predictionChange: 6.84,
      sentiment: 0.65,
      modelConsensus: 'HOLD',
      confidence: 0.72,
      sector: 'Technology',
      beta: 1.05,
      volume: '32.1M',
      marketCap: 1734
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      shares: 650,
      avgCost: 134.56,
      currentPrice: 155.89,
      value: 101329,
      dayChange: 3.21,
      dayChangePercent: 2.10,
      totalReturn: 13864,
      totalReturnPercent: 15.87,
      prediction: 168.50,
      predictionChange: 8.09,
      sentiment: 0.81,
      modelConsensus: 'BUY',
      confidence: 0.79,
      sector: 'Consumer Discretionary',
      beta: 1.33,
      volume: '41.8M',
      marketCap: 1598
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      shares: 380,
      avgCost: 201.45,
      currentPrice: 248.42,
      value: 94400,
      dayChange: 12.87,
      dayChangePercent: 5.46,
      totalReturn: 17848,
      totalReturnPercent: 23.31,
      prediction: 265.00,
      predictionChange: 6.67,
      sentiment: 0.89,
      modelConsensus: 'BUY',
      confidence: 0.65,
      sector: 'Consumer Discretionary',
      beta: 2.01,
      volume: '89.3M',
      marketCap: 789
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      shares: 290,
      avgCost: 412.33,
      currentPrice: 875.28,
      value: 253831,
      dayChange: 18.45,
      dayChangePercent: 2.15,
      totalReturn: 134257,
      totalReturnPercent: 112.34,
      prediction: 920.00,
      predictionChange: 5.11,
      sentiment: 0.92,
      modelConsensus: 'BUY',
      confidence: 0.91,
      sector: 'Technology',
      beta: 1.68,
      volume: '52.7M',
      marketCap: 2156
    },
    {
      symbol: 'META',
      name: 'Meta Platforms Inc.',
      shares: 520,
      avgCost: 187.92,
      currentPrice: 298.58,
      value: 155262,
      dayChange: -4.23,
      dayChangePercent: -1.40,
      totalReturn: 57542,
      totalReturnPercent: 58.94,
      prediction: 315.00,
      predictionChange: 5.50,
      sentiment: 0.68,
      modelConsensus: 'BUY',
      confidence: 0.76,
      sector: 'Technology',
      beta: 1.18,
      volume: '19.4M',
      marketCap: 758
    },
    {
      symbol: 'JPM',
      name: 'JPMorgan Chase & Co.',
      shares: 780,
      avgCost: 142.67,
      currentPrice: 168.45,
      value: 131391,
      dayChange: 1.23,
      dayChangePercent: 0.74,
      totalReturn: 20107,
      totalReturnPercent: 18.07,
      prediction: 175.00,
      predictionChange: 3.89,
      sentiment: 0.54,
      modelConsensus: 'HOLD',
      confidence: 0.82,
      sector: 'Financial Services',
      beta: 1.12,
      volume: '12.8M',
      marketCap: 487
    }
  ];

  const filters = [
    { value: 'all', label: 'All Holdings' },
    { value: 'gainers', label: 'Gainers' },
    { value: 'losers', label: 'Losers' },
    { value: 'buy', label: 'Buy Signals' },
    { value: 'sell', label: 'Sell Signals' }
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredHoldings = holdings?.filter(holding => {
    switch (filter) {
      case 'gainers':
        return holding?.dayChange > 0;
      case 'losers':
        return holding?.dayChange < 0;
      case 'buy':
        return holding?.modelConsensus === 'BUY';
      case 'sell':
        return holding?.modelConsensus === 'SELL';
      default:
        return true;
    }
  });

  const sortedHoldings = [...filteredHoldings]?.sort((a, b) => {
    const aValue = a?.[sortField];
    const bValue = b?.[sortField];
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    if (typeof aValue === 'string') {
      return aValue?.localeCompare(bValue) * multiplier;
    }
    return (aValue - bValue) * multiplier;
  });

  const getSentimentIcon = (sentiment) => {
    if (sentiment >= 0.7) return 'TrendingUp';
    if (sentiment >= 0.5) return 'Minus';
    return 'TrendingDown';
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment >= 0.7) return 'text-success';
    if (sentiment >= 0.5) return 'text-warning';
    return 'text-error';
  };

  const getConsensusColor = (consensus) => {
    switch (consensus) {
      case 'BUY': return 'text-success bg-success/10';
      case 'SELL': return 'text-error bg-error/10';
      default: return 'text-warning bg-warning/10';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Holdings Details</h3>
          <p className="text-sm text-muted-foreground">Complete position analysis with predictions</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            className="px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {filters?.map(f => (
              <option key={f?.value} value={f?.value}>{f?.label}</option>
            ))}
          </select>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="BarChart3" size={16} />
            <span>{sortedHoldings?.length} positions</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2">
                <button
                  onClick={() => handleSort('symbol')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Stock</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-right py-3 px-2">
                <button
                  onClick={() => handleSort('shares')}
                  className="flex items-center justify-end space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Shares</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-right py-3 px-2">
                <button
                  onClick={() => handleSort('currentPrice')}
                  className="flex items-center justify-end space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Price</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-right py-3 px-2">
                <button
                  onClick={() => handleSort('value')}
                  className="flex items-center justify-end space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Value</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-right py-3 px-2">
                <button
                  onClick={() => handleSort('dayChangePercent')}
                  className="flex items-center justify-end space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Day Change</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-right py-3 px-2">
                <button
                  onClick={() => handleSort('totalReturnPercent')}
                  className="flex items-center justify-end space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Total Return</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-right py-3 px-2">
                <button
                  onClick={() => handleSort('prediction')}
                  className="flex items-center justify-end space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Prediction</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-center py-3 px-2">
                <span className="text-sm font-medium text-muted-foreground">Sentiment</span>
              </th>
              <th className="text-center py-3 px-2">
                <span className="text-sm font-medium text-muted-foreground">Signal</span>
              </th>
              <th className="text-center py-3 px-2">
                <span className="text-sm font-medium text-muted-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedHoldings?.map((holding) => (
              <tr key={holding?.symbol} className="border-b border-border hover:bg-muted/20 transition-colors">
                <td className="py-4 px-2">
                  <div>
                    <div className="font-semibold text-foreground">{holding?.symbol}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-32">{holding?.name}</div>
                    <div className="text-xs text-muted-foreground">{holding?.sector}</div>
                  </div>
                </td>
                <td className="py-4 px-2 text-right">
                  <div className="text-sm text-foreground">{holding?.shares?.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Avg: ${holding?.avgCost?.toFixed(2)}</div>
                </td>
                <td className="py-4 px-2 text-right">
                  <div className="text-sm font-medium text-foreground">${holding?.currentPrice?.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Vol: {holding?.volume}</div>
                </td>
                <td className="py-4 px-2 text-right">
                  <div className="text-sm font-medium text-foreground">${holding?.value?.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">β: {holding?.beta}</div>
                </td>
                <td className="py-4 px-2 text-right">
                  <div className={`text-sm font-medium ${holding?.dayChange >= 0 ? 'text-success' : 'text-error'}`}>
                    {holding?.dayChange >= 0 ? '+' : ''}${holding?.dayChange?.toFixed(2)}
                  </div>
                  <div className={`text-xs ${holding?.dayChangePercent >= 0 ? 'text-success' : 'text-error'}`}>
                    ({holding?.dayChangePercent >= 0 ? '+' : ''}{holding?.dayChangePercent?.toFixed(2)}%)
                  </div>
                </td>
                <td className="py-4 px-2 text-right">
                  <div className={`text-sm font-medium ${holding?.totalReturn >= 0 ? 'text-success' : 'text-error'}`}>
                    {holding?.totalReturn >= 0 ? '+' : ''}${holding?.totalReturn?.toLocaleString()}
                  </div>
                  <div className={`text-xs ${holding?.totalReturnPercent >= 0 ? 'text-success' : 'text-error'}`}>
                    ({holding?.totalReturnPercent >= 0 ? '+' : ''}{holding?.totalReturnPercent?.toFixed(2)}%)
                  </div>
                </td>
                <td className="py-4 px-2 text-right">
                  <div className="text-sm font-medium text-foreground">${holding?.prediction?.toFixed(2)}</div>
                  <div className={`text-xs ${holding?.predictionChange >= 0 ? 'text-success' : 'text-error'}`}>
                    {holding?.predictionChange >= 0 ? '+' : ''}{holding?.predictionChange?.toFixed(2)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(holding?.confidence * 100)?.toFixed(0)}% conf
                  </div>
                </td>
                <td className="py-4 px-2 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Icon 
                      name={getSentimentIcon(holding?.sentiment)} 
                      size={14} 
                      color={`var(--color-${holding?.sentiment >= 0.7 ? 'success' : holding?.sentiment >= 0.5 ? 'warning' : 'error'})`}
                    />
                    <span className={`text-sm ${getSentimentColor(holding?.sentiment)}`}>
                      {(holding?.sentiment * 100)?.toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="py-4 px-2 text-center">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConsensusColor(holding?.modelConsensus)}`}>
                    {holding?.modelConsensus}
                  </span>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center justify-center space-x-1">
                    <button className="p-1 text-muted-foreground hover:text-primary transition-colors" title="View Details">
                      <Icon name="Eye" size={14} />
                    </button>
                    <button className="p-1 text-muted-foreground hover:text-primary transition-colors" title="Trade">
                      <Icon name="TrendingUp" size={14} />
                    </button>
                    <button className="p-1 text-muted-foreground hover:text-error transition-colors" title="Remove">
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedHoldings?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Search" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No holdings match the current filter</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filter criteria</p>
        </div>
      )}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {sortedHoldings?.length} of {holdings?.length} positions
          </div>
          <div className="flex items-center space-x-4">
            <span>Last updated: {new Date()?.toLocaleTimeString()}</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>Live data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoldingsTable;