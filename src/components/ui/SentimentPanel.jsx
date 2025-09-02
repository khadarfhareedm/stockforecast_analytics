import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';
import Icon from '../AppIcon';

const SentimentPanel = ({ 
  sentimentData = null, 
  tweets = [], 
  symbol = '',
  className = "",
  showTweets = true,
  maxTweets = 5 
}) => {
  const sentimentStats = useMemo(() => {
    if (!sentimentData) return null;

    return {
      overall: sentimentData?.sentiment || 'neutral',
      score: sentimentData?.sentimentScore || 0,
      distribution: sentimentData?.sentiment || { positive: 0, negative: 0, neutral: 0 },
      total: sentimentData?.totalTweets || 0
    };
  }, [sentimentData]);

  const displayTweets = useMemo(() => {
    return tweets?.slice(0, maxTweets) || [];
  }, [tweets, maxTweets]);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'TrendingUp';
      case 'negative':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  const formatSentimentScore = (score) => {
    if (score > 0) return `+${(score * 100)?.toFixed(1)}%`;
    return `${(score * 100)?.toFixed(1)}%`;
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const tweetDate = new Date(date);
    const diffInMinutes = Math.floor((now - tweetDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  if (!sentimentStats && !displayTweets?.length) {
    return (
      <div className={cn("bg-background rounded-lg border p-6", className)}>
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Icon name="MessageCircle" size={24} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">No Sentiment Data</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Select a stock symbol to view sentiment analysis
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-background rounded-lg border", className)}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Sentiment Analysis {symbol && `- ${symbol}`}
          </h3>
          {sentimentStats?.total > 0 && (
            <span className="text-sm text-muted-foreground">
              {sentimentStats?.total} tweets analyzed
            </span>
          )}
        </div>

        {sentimentStats && (
          <div className="space-y-4 mb-6">
            {/* Overall Sentiment */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center space-x-3">
                <div className={cn("p-2 rounded-full", getSentimentColor(sentimentStats?.overall))}>
                  <Icon name={getSentimentIcon(sentimentStats?.overall)} size={18} />
                </div>
                <div>
                  <div className="font-medium text-foreground capitalize">
                    {sentimentStats?.overall} Sentiment
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Overall market mood
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={cn("text-lg font-semibold", 
                  sentimentStats?.score > 0 ? 'text-green-600' : 
                  sentimentStats?.score < 0 ? 'text-red-600' : 'text-gray-600'
                )}>
                  {formatSentimentScore(sentimentStats?.score)}
                </div>
                <div className="text-xs text-muted-foreground">Score</div>
              </div>
            </div>

            {/* Sentiment Distribution */}
            {sentimentStats?.distribution && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground mb-3">Sentiment Breakdown</div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-muted-foreground">Positive</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {sentimentStats?.distribution?.positive || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-muted-foreground">Negative</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {sentimentStats?.distribution?.negative || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-muted-foreground">Neutral</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {sentimentStats?.distribution?.neutral || 0}
                  </span>
                </div>

                {/* Visual bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div 
                    className="bg-green-500 h-2 rounded-l-full" 
                    style={{ 
                      width: sentimentStats?.total > 0 ? 
                        `${(sentimentStats?.distribution?.positive / sentimentStats?.total) * 100}%` : 
                        '0%' 
                    }}
                  ></div>
                  <div 
                    className="bg-red-500 h-2 -mt-2" 
                    style={{ 
                      marginLeft: sentimentStats?.total > 0 ? 
                        `${(sentimentStats?.distribution?.positive / sentimentStats?.total) * 100}%` : 
                        '0%',
                      width: sentimentStats?.total > 0 ? 
                        `${(sentimentStats?.distribution?.negative / sentimentStats?.total) * 100}%` : 
                        '0%' 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent Tweets */}
        {showTweets && displayTweets?.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Recent Tweets</h4>
              <span className="text-xs text-muted-foreground">Live sentiment data</span>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {displayTweets?.map((tweet, index) => (
                <div key={tweet?.id || index} className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm text-foreground">
                        {tweet?.author || '@user'}
                      </span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        getSentimentColor(tweet?.sentiment)
                      )}>
                        {tweet?.sentiment}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(tweet?.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-foreground leading-relaxed mb-3">
                    {tweet?.text}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="MessageCircle" size={12} />
                      <span>{tweet?.replies || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Repeat" size={12} />
                      <span>{tweet?.retweets || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Heart" size={12} />
                      <span>{tweet?.likes || 0}</span>
                    </div>
                    {tweet?.confidence && (
                      <div className="ml-auto">
                        Confidence: {(tweet?.confidence * 100)?.toFixed(0)}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {tweets?.length > maxTweets && (
              <div className="text-center">
                <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                  View {tweets?.length - maxTweets} more tweets
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SentimentPanel;