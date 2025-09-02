import React from 'react';
import Icon from '../../../components/AppIcon';

const TrendingHashtags = ({ hashtags, onHashtagClick }) => {
  const getTrendIcon = (trend) => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Trending Hashtags</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>Last 24h</span>
        </div>
      </div>
      <div className="space-y-3">
        {hashtags?.map((hashtag, index) => (
          <div
            key={hashtag?.tag}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20 transition-colors duration-200 cursor-pointer"
            onClick={() => onHashtagClick && onHashtagClick(hashtag)}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-sm font-bold text-primary">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-foreground">#{hashtag?.tag}</p>
                <p className="text-sm text-muted-foreground">{hashtag?.mentions} mentions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className={`flex items-center space-x-1 ${getTrendColor(hashtag?.trend)}`}>
                  <Icon name={getTrendIcon(hashtag?.trend)} size={16} />
                  <span className="text-sm font-medium">{hashtag?.change}</span>
                </div>
                <p className="text-xs text-muted-foreground">Sentiment: {hashtag?.sentiment?.toFixed(2)}</p>
              </div>
              
              <div className="w-12 h-8 bg-muted/20 rounded flex items-end justify-center space-x-1 p-1">
                {hashtag?.sparkline?.map((value, idx) => (
                  <div
                    key={idx}
                    className="bg-primary rounded-sm flex-1"
                    style={{ height: `${(value / Math.max(...hashtag?.sparkline)) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total tracked hashtags</span>
          <span className="font-medium text-foreground">247</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-muted-foreground">New trending</span>
          <span className="font-medium text-success">+12</span>
        </div>
      </div>
    </div>
  );
};

export default TrendingHashtags;