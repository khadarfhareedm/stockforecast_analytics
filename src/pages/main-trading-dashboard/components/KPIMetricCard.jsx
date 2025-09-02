import React from 'react';
import Icon from '../../../components/AppIcon';

const KPIMetricCard = ({ 
  title, 
  value, 
  change, 
  changePercent, 
  icon, 
  trend = 'neutral',
  className = '' 
}) => {
  const getTrendConfig = () => {
    switch (trend) {
      case 'up':
        return {
          color: 'var(--color-success)',
          bgColor: 'bg-success/10',
          icon: 'TrendingUp',
          textColor: 'text-success'
        };
      case 'down':
        return {
          color: 'var(--color-error)',
          bgColor: 'bg-error/10',
          icon: 'TrendingDown',
          textColor: 'text-error'
        };
      default:
        return {
          color: 'var(--color-muted-foreground)',
          bgColor: 'bg-muted/10',
          icon: 'Minus',
          textColor: 'text-muted-foreground'
        };
    }
  };

  const trendConfig = getTrendConfig();

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={icon} size={18} color="var(--color-primary)" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
        </div>
        
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${trendConfig?.bgColor}`}>
          <Icon name={trendConfig?.icon} size={14} color={trendConfig?.color} />
          <span className={`text-xs font-medium ${trendConfig?.textColor}`}>
            {changePercent}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-2xl font-bold text-foreground">
          {value}
        </div>
        
        {change && (
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${trendConfig?.textColor}`}>
              {change}
            </span>
            <span className="text-xs text-muted-foreground">today</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPIMetricCard;