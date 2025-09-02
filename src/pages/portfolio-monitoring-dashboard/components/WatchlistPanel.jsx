import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const WatchlistPanel = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [newSymbol, setNewSymbol] = useState('');

  const mockWatchlistData = [
    {
      symbol: 'NFLX',
      name: 'Netflix Inc.',
      price: 487.23,
      change: 12.45,
      changePercent: 2.62,
      sentiment: 0.72,
      volume: '2.4M',
      prediction: 'BUY',
      confidence: 0.84,
      targetPrice: 520.00,
      lastUpdated: new Date(Date.now() - 30000)
    },
    {
      symbol: 'DIS',
      name: 'Walt Disney Co.',
      price: 98.76,
      change: -2.34,
      changePercent: -2.31,
      sentiment: 0.45,
      volume: '8.7M',
      prediction: 'HOLD',
      confidence: 0.67,
      targetPrice: 105.00,
      lastUpdated: new Date(Date.now() - 45000)
    },
    {
      symbol: 'COIN',
      name: 'Coinbase Global',
      price: 156.89,
      change: 8.92,
      changePercent: 6.03,
      sentiment: 0.68,
      volume: '12.3M',
      prediction: 'BUY',
      confidence: 0.78,
      targetPrice: 175.00,
      lastUpdated: new Date(Date.now() - 15000)
    },
    {
      symbol: 'PYPL',
      name: 'PayPal Holdings',
      price: 67.45,
      change: -1.23,
      changePercent: -1.79,
      sentiment: 0.38,
      volume: '5.6M',
      prediction: 'SELL',
      confidence: 0.71,
      targetPrice: 62.00,
      lastUpdated: new Date(Date.now() - 60000)
    },
    {
      symbol: 'ROKU',
      name: 'Roku Inc.',
      price: 78.92,
      change: 4.56,
      changePercent: 6.13,
      sentiment: 0.81,
      volume: '3.2M',
      prediction: 'BUY',
      confidence: 0.89,
      targetPrice: 88.00,
      lastUpdated: new Date(Date.now() - 20000)
    }
  ];

  useEffect(() => {
    setWatchlist(mockWatchlistData);
  }, []);

  const getSentimentColor = (sentiment) => {
    if (sentiment >= 0.7) return 'text-success';
    if (sentiment >= 0.5) return 'text-warning';
    return 'text-error';
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment >= 0.7) return 'TrendingUp';
    if (sentiment >= 0.5) return 'Minus';
    return 'TrendingDown';
  };

  const getPredictionColor = (prediction) => {
    switch (prediction) {
      case 'BUY': return 'text-success bg-success/10';
      case 'SELL': return 'text-error bg-error/10';
      default: return 'text-warning bg-warning/10';
    }
  };

  const addToWatchlist = () => {
    if (newSymbol?.trim() && !watchlist?.find(item => item?.symbol === newSymbol?.toUpperCase())) {
      const newStock = {
        symbol: newSymbol?.toUpperCase(),
        name: `${newSymbol?.toUpperCase()} Corp.`,
        price: Math.random() * 200 + 50,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5,
        sentiment: Math.random(),
        volume: `${(Math.random() * 10 + 1)?.toFixed(1)}M`,
        prediction: ['BUY', 'SELL', 'HOLD']?.[Math.floor(Math.random() * 3)],
        confidence: Math.random() * 0.3 + 0.6,
        targetPrice: Math.random() * 50 + 100,
        lastUpdated: new Date()
      };
      setWatchlist([...watchlist, newStock]);
      setNewSymbol('');
    }
  };

  const removeFromWatchlist = (symbol) => {
    setWatchlist(watchlist?.filter(item => item?.symbol !== symbol));
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-fit">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Watchlist</h3>
          <p className="text-sm text-muted-foreground">Monitor potential investments</p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Eye" size={16} color="var(--color-muted-foreground)" />
          <span className="text-sm text-muted-foreground">{watchlist?.length} stocks</span>
        </div>
      </div>
      {/* Add new stock */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Add symbol (e.g., AAPL)"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e?.target?.value?.toUpperCase())}
          onKeyPress={(e) => e?.key === 'Enter' && addToWatchlist()}
          className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={addToWatchlist}
          className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Icon name="Plus" size={16} />
        </button>
      </div>
      {/* Watchlist items */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {watchlist?.map((stock) => (
          <div key={stock?.symbol} className="bg-muted/20 rounded-lg p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-foreground">{stock?.symbol}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPredictionColor(stock?.prediction)}`}>
                    {stock?.prediction}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground truncate">{stock?.name}</div>
              </div>
              <button
                onClick={() => removeFromWatchlist(stock?.symbol)}
                className="text-muted-foreground hover:text-error transition-colors"
              >
                <Icon name="X" size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-lg font-bold text-foreground">${stock?.price?.toFixed(2)}</div>
                <div className={`text-sm font-medium ${stock?.change >= 0 ? 'text-success' : 'text-error'}`}>
                  {stock?.change >= 0 ? '+' : ''}${stock?.change?.toFixed(2)} ({stock?.changePercent?.toFixed(2)}%)
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Target</div>
                <div className="text-sm font-semibold text-foreground">${stock?.targetPrice?.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">
                  {((stock?.targetPrice - stock?.price) / stock?.price * 100)?.toFixed(1)}% upside
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Icon 
                    name={getSentimentIcon(stock?.sentiment)} 
                    size={14} 
                    color={`var(--color-${stock?.sentiment >= 0.7 ? 'success' : stock?.sentiment >= 0.5 ? 'warning' : 'error'})`}
                  />
                  <span className={getSentimentColor(stock?.sentiment)}>
                    {(stock?.sentiment * 100)?.toFixed(0)}%
                  </span>
                </div>
                <div className="text-muted-foreground">Vol: {stock?.volume}</div>
              </div>
              <div className="text-xs text-muted-foreground">
                {getTimeAgo(stock?.lastUpdated)}
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Confidence</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${stock?.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-muted-foreground">{(stock?.confidence * 100)?.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {watchlist?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="TrendingUp" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No stocks in watchlist</p>
          <p className="text-sm text-muted-foreground">Add symbols to monitor potential investments</p>
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Auto-refresh: ON</span>
          <span>Last update: {new Date()?.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default WatchlistPanel;