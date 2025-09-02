import React from 'react';
import Icon from '../../../components/AppIcon';

const PortfolioMetrics = () => {
  const metrics = [
    {
      id: 'portfolio-value',
      label: 'Portfolio Value',
      value: '$2,847,392',
      change: '+$47,392',
      changePercent: '+1.69%',
      trend: 'up',
      sparkline: [2.1, 2.3, 2.8, 2.4, 2.9, 3.1, 2.8],
      benchmark: 'vs S&P 500: +0.8%'
    },
    {
      id: 'daily-pnl',
      label: 'Daily P&L',
      value: '+$23,847',
      change: '+$5,234',
      changePercent: '+0.84%',
      trend: 'up',
      sparkline: [1.2, 1.8, 2.1, 1.9, 2.3, 2.4, 2.1],
      benchmark: 'vs Yesterday: +28%'
    },
    {
      id: 'total-return',
      label: 'Total Return',
      value: '18.47%',
      change: '+2.34%',
      changePercent: '+14.5%',
      trend: 'up',
      sparkline: [15.2, 16.1, 17.8, 16.9, 17.4, 18.1, 18.5],
      benchmark: 'vs Benchmark: +4.2%'
    },
    {
      id: 'sharpe-ratio',
      label: 'Sharpe Ratio',
      value: '1.84',
      change: '+0.12',
      changePercent: '+7.0%',
      trend: 'up',
      sparkline: [1.6, 1.7, 1.8, 1.7, 1.8, 1.9, 1.8],
      benchmark: 'Excellent Risk-Adj Return'
    },
    {
      id: 'max-drawdown',
      label: 'Max Drawdown',
      value: '-8.23%',
      change: '+1.45%',
      changePercent: 'Improved',
      trend: 'up',
      sparkline: [-12.1, -10.8, -9.4, -8.9, -8.5, -8.2, -8.2],
      benchmark: 'vs Market: -12.4%'
    },
    {
      id: 'beta',
      label: 'Portfolio Beta',
      value: '0.87',
      change: '-0.03',
      changePercent: 'Lower Risk',
      trend: 'neutral',
      sparkline: [0.92, 0.89, 0.88, 0.90, 0.87, 0.86, 0.87],
      benchmark: 'vs Market Beta: 1.0'
    }
  ];

  const renderSparkline = (data, trend) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    const points = data?.map((value, index) => {
      const x = (index / (data?.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 20;
      return `${x},${y}`;
    })?.join(' ');

    return (
      <svg width="60" height="20" className="opacity-70">
        <polyline
          points={points}
          fill="none"
          stroke={trend === 'up' ? 'var(--color-success)' : trend === 'down' ? 'var(--color-error)' : 'var(--color-muted-foreground)'}
          strokeWidth="1.5"
        />
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {metrics?.map((metric) => (
        <div key={metric?.id} className="bg-card border border-border rounded-lg p-4 hover:bg-card/80 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground font-medium">{metric?.label}</span>
            <div className="flex items-center space-x-1">
              {metric?.trend === 'up' && (
                <Icon name="TrendingUp" size={14} color="var(--color-success)" />
              )}
              {metric?.trend === 'down' && (
                <Icon name="TrendingDown" size={14} color="var(--color-error)" />
              )}
              {metric?.trend === 'neutral' && (
                <Icon name="Minus" size={14} color="var(--color-muted-foreground)" />
              )}
            </div>
          </div>
          
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-2xl font-bold text-foreground mb-1">{metric?.value}</div>
              <div className={`text-sm font-medium ${
                metric?.trend === 'up' ? 'text-success' : 
                metric?.trend === 'down'? 'text-error' : 'text-muted-foreground'
              }`}>
                {metric?.change} ({metric?.changePercent})
              </div>
            </div>
            <div className="ml-2">
              {renderSparkline(metric?.sparkline, metric?.trend)}
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground border-t border-border pt-2">
            {metric?.benchmark}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioMetrics;