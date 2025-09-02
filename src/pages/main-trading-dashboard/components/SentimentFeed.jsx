import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SentimentFeed = ({ className = '' }) => {
  const [sentimentData, setSentimentData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const mockSentimentData = [
    {
      id: 1,
      source: 'twitter',
      username: '@TradingPro_AI',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: `$AAPL showing strong momentum after earnings beat. Technical indicators suggest continued upward trend. #StockAnalysis #TradingSignals`,
      sentiment: 0.85,
      timestamp: new Date(Date.now() - 300000),
      engagement: { likes: 234, retweets: 67, replies: 23 },
      relevanceScore: 0.92
    },
    {
      id: 2,
      source: 'reddit',
      username: 'u/MarketAnalyst2024',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      content: `GOOGL's AI developments are game-changing. The recent partnerships and product launches position them well for Q4. Long-term bullish outlook remains intact.`,
      sentiment: 0.78,
      timestamp: new Date(Date.now() - 600000),
      engagement: { upvotes: 156, comments: 34 },
      relevanceScore: 0.88
    },
    {
      id: 3,
      source: 'twitter',username: '@FinanceGuru',avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      content: `Market volatility increasing. $MSFT and $AAPL showing resilience while tech sector faces headwinds. Diversification key in current environment.`,
      sentiment: 0.45,
      timestamp: new Date(Date.now() - 900000),
      engagement: { likes: 89, retweets: 23, replies: 12 },
      relevanceScore: 0.75
    },
    {
      id: 4,
      source: 'reddit',username: 'u/StockWatcher_Pro',avatar: 'https://randomuser.me/api/portraits/women/23.jpg',content: `Tesla's production numbers exceeded expectations. Supply chain improvements and new factory efficiency driving positive sentiment. Q4 looking strong.`,
      sentiment: 0.82,
      timestamp: new Date(Date.now() - 1200000),
      engagement: { upvotes: 203, comments: 67 },
      relevanceScore: 0.91
    },
    {
      id: 5,
      source: 'twitter',
      username: '@CryptoStockHub',
      avatar: 'https://randomuser.me/api/portraits/men/89.jpg',
      content: `Bearish signals emerging in tech sector. $GOOGL facing regulatory pressure while $META struggles with user engagement metrics. Caution advised.`,
      sentiment: 0.25,
      timestamp: new Date(Date.now() - 1500000),
      engagement: { likes: 45, retweets: 12, replies: 8 },
      relevanceScore: 0.68
    }
  ];

  useEffect(() => {
    setSentimentData(mockSentimentData);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      const newPost = {
        id: Date.now(),
        source: Math.random() > 0.5 ? 'twitter' : 'reddit',
        username: Math.random() > 0.5 ? '@LiveTrader_AI' : 'u/MarketInsights',
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 90) + 1}.jpg`,
        content: `Real-time market update: Strong buying pressure in tech stocks. Institutional investors showing renewed interest. #MarketUpdate`,
        sentiment: 0.6 + Math.random() * 0.3,
        timestamp: new Date(),
        engagement: {
          likes: Math.floor(Math.random() * 100) + 20,
          retweets: Math.floor(Math.random() * 30) + 5,
          replies: Math.floor(Math.random() * 20) + 2
        },
        relevanceScore: 0.7 + Math.random() * 0.2
      };
      
      setSentimentData(prev => [newPost, ...prev?.slice(0, 9)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getSentimentColor = (sentiment) => {
    if (sentiment >= 0.7) return 'text-success';
    if (sentiment >= 0.4) return 'text-warning';
    return 'text-error';
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment >= 0.7) return 'TrendingUp';
    if (sentiment >= 0.4) return 'Minus';
    return 'TrendingDown';
  };

  const getSourceIcon = (source) => {
    return source === 'twitter' ? 'Twitter' : 'MessageSquare';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp?.toLocaleDateString();
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="MessageSquare" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Live Sentiment Feed</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-2 py-1 bg-success/10 rounded-md">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-success font-medium">Live</span>
          </div>
          
          <button
            onClick={() => setIsLoading(true)}
            className="p-1.5 hover:bg-muted/50 rounded-md transition-colors"
            disabled={isLoading}
          >
            <Icon 
              name="RefreshCw" 
              size={16} 
              color="var(--color-muted-foreground)"
              className={isLoading ? 'animate-spin' : ''}
            />
          </button>
        </div>
      </div>
      <div className="h-96 overflow-y-auto">
        {sentimentData?.map((item, index) => (
          <div key={item?.id} className="p-4 border-b border-border/50 hover:bg-muted/20 transition-colors">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <Image
                  src={item?.avatar}
                  alt={item?.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getSourceIcon(item?.source)} 
                      size={14} 
                      color="var(--color-muted-foreground)" 
                    />
                    <span className="text-sm font-medium text-foreground">{item?.username}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{formatTimestamp(item?.timestamp)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Icon 
                      name={getSentimentIcon(item?.sentiment)} 
                      size={14} 
                      color={`var(--color-${item?.sentiment >= 0.7 ? 'success' : item?.sentiment >= 0.4 ? 'warning' : 'error'})`}
                    />
                    <span className={`text-xs font-medium ${getSentimentColor(item?.sentiment)}`}>
                      {Math.round(item?.sentiment * 100)}%
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-foreground mb-3 leading-relaxed">
                  {item?.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    {item?.source === 'twitter' ? (
                      <>
                        <div className="flex items-center space-x-1">
                          <Icon name="Heart" size={12} />
                          <span>{item?.engagement?.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Repeat" size={12} />
                          <span>{item?.engagement?.retweets}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="MessageCircle" size={12} />
                          <span>{item?.engagement?.replies}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center space-x-1">
                          <Icon name="ArrowUp" size={12} />
                          <span>{item?.engagement?.upvotes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="MessageSquare" size={12} />
                          <span>{item?.engagement?.comments}</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Icon name="Target" size={12} color="var(--color-muted-foreground)" />
                    <span className="text-xs text-muted-foreground">
                      {Math.round(item?.relevanceScore * 100)}% relevant
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border bg-muted/10">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="Twitter" size={12} />
              <span>Twitter</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="MessageSquare" size={12} />
              <span>Reddit</span>
            </div>
          </div>
          
          <span>Auto-refresh every 5 minutes</span>
        </div>
      </div>
    </div>
  );
};

export default SentimentFeed;