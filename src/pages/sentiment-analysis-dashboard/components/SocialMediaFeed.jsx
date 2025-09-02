import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SocialMediaFeed = ({ posts, onPostClick }) => {
  const [filter, setFilter] = useState('all');

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.2) return 'text-success';
    if (sentiment < -0.2) return 'text-error';
    return 'text-muted-foreground';
  };

  const getSentimentBg = (sentiment) => {
    if (sentiment > 0.2) return 'bg-success/10';
    if (sentiment < -0.2) return 'bg-error/10';
    return 'bg-muted/10';
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'twitter': return 'Twitter';
      case 'reddit': return 'MessageCircle';
      default: return 'MessageSquare';
    }
  };

  const filteredPosts = posts?.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'positive') return post?.sentiment > 0.2;
    if (filter === 'negative') return post?.sentiment < -0.2;
    if (filter === 'neutral') return post?.sentiment >= -0.2 && post?.sentiment <= 0.2;
    return true;
  });

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Social Media Feed</h3>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            className="bg-input border border-border rounded-md px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Posts</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredPosts?.map((post) => (
          <div
            key={post?.id}
            className="border border-border rounded-lg p-4 hover:bg-muted/20 transition-colors duration-200 cursor-pointer"
            onClick={() => onPostClick && onPostClick(post)}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <Icon name={getPlatformIcon(post?.platform)} size={16} color="var(--color-muted-foreground)" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground truncate">
                      @{post?.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(post?.timestamp)}
                    </span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentBg(post?.sentiment)} ${getSentimentColor(post?.sentiment)}`}>
                    {post?.sentiment > 0 ? '+' : ''}{post?.sentiment?.toFixed(2)}
                  </div>
                </div>
                
                <p className="text-sm text-foreground mb-3 line-clamp-3">
                  {post?.content}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Icon name="Heart" size={12} />
                      <span>{post?.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="MessageCircle" size={12} />
                      <span>{post?.replies}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Repeat" size={12} />
                      <span>{post?.shares}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="TrendingUp" size={12} />
                    <span>Influence: {post?.influence}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaFeed;