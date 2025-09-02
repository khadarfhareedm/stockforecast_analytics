import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, change, timeframe, confidence, icon, color = 'var(--color-primary)', className = '' }) => {
  const isPositive = change >= 0;
  
  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
            <Icon name={icon} size={20} color={color} />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        <div className="text-xs text-muted-foreground">{timeframe}</div>
      </div>
      <div className="space-y-3">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-1 text-sm ${isPositive ? 'text-success' : 'text-error'}`}>
            <Icon name={isPositive ? 'TrendingUp' : 'TrendingDown'} size={16} />
            <span>{Math.abs(change)?.toFixed(1)}%</span>
            <span className="text-muted-foreground">vs last period</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-muted/30 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${confidence}%`, 
                backgroundColor: color 
              }}
            ></div>
          </div>
          <span className="text-xs text-muted-foreground">{confidence}% confidence</span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;