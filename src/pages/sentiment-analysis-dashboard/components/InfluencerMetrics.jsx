import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const InfluencerMetrics = ({ influencers, onInfluencerClick }) => {
  const getInfluenceLevel = (score) => {
    if (score >= 80) return { level: 'High', color: 'text-success', bg: 'bg-success/10' };
    if (score >= 60) return { level: 'Medium', color: 'text-warning', bg: 'bg-warning/10' };
    return { level: 'Low', color: 'text-muted-foreground', bg: 'bg-muted/10' };
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment > 0.2) return 'TrendingUp';
    if (sentiment < -0.2) return 'TrendingDown';
    return 'Minus';
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.2) return 'text-success';
    if (sentiment < -0.2) return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Key Opinion Leaders</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Users" size={16} />
          <span>Top Influencers</span>
        </div>
      </div>
      <div className="space-y-4">
        {influencers?.map((influencer) => {
          const influence = getInfluenceLevel(influencer?.influenceScore);
          
          return (
            <div
              key={influencer?.id}
              className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/20 transition-colors duration-200 cursor-pointer"
              onClick={() => onInfluencerClick && onInfluencerClick(influencer)}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Image
                  src={influencer?.avatar}
                  alt={influencer?.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-foreground truncate">@{influencer?.username}</h4>
                  {influencer?.verified && (
                    <Icon name="CheckCircle" size={16} color="var(--color-primary)" />
                  )}
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${influence?.bg} ${influence?.color}`}>
                    {influence?.level}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Users" size={12} />
                    <span>{influencer?.followers?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="MessageSquare" size={12} />
                    <span>{influencer?.posts} posts</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Activity" size={12} />
                    <span>{influencer?.engagement}% eng.</span>
                  </div>
                </div>
              </div>
              {/* Metrics */}
              <div className="flex-shrink-0 text-right">
                <div className={`flex items-center space-x-1 mb-1 ${getSentimentColor(influencer?.avgSentiment)}`}>
                  <Icon name={getSentimentIcon(influencer?.avgSentiment)} size={16} />
                  <span className="text-sm font-medium">{influencer?.avgSentiment?.toFixed(2)}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Impact: {influencer?.marketImpact}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-border grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">24</div>
          <div className="text-xs text-muted-foreground">Active Influencers</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">2.4M</div>
          <div className="text-xs text-muted-foreground">Total Reach</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-success">+0.23</div>
          <div className="text-xs text-muted-foreground">Avg Sentiment</div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerMetrics;