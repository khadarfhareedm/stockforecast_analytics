import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PerformanceMetricToggle = ({ selectedMetric, onMetricChange, className = '' }) => {
  const metrics = [
    {
      id: 'rmse',
      name: 'RMSE',
      fullName: 'Root Mean Square Error',
      icon: 'TrendingDown',
      description: 'Lower values indicate better accuracy'
    },
    {
      id: 'mae',
      name: 'MAE',
      fullName: 'Mean Absolute Error',
      icon: 'Target',
      description: 'Average prediction error magnitude'
    },
    {
      id: 'accuracy',
      name: 'Accuracy',
      fullName: 'Directional Accuracy',
      icon: 'CheckCircle',
      description: 'Percentage of correct trend predictions'
    },
    {
      id: 'sharpe',
      name: 'Sharpe Ratio',
      fullName: 'Risk-Adjusted Returns',
      icon: 'TrendingUp',
      description: 'Return per unit of risk taken'
    }
  ];

  return (
    <div className={`bg-card rounded-lg border border-border p-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="BarChart3" size={20} color="var(--color-primary)" />
        <h3 className="text-lg font-semibold text-foreground">Performance Metrics</h3>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {metrics?.map((metric) => (
          <Button
            key={metric?.id}
            variant={selectedMetric === metric?.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onMetricChange(metric?.id)}
            className="flex flex-col items-center p-3 h-auto"
          >
            <Icon name={metric?.icon} size={18} className="mb-1" />
            <span className="text-xs font-medium">{metric?.name}</span>
          </Button>
        ))}
      </div>
      <div className="mt-3 p-3 bg-muted/20 rounded-lg">
        <p className="text-sm text-muted-foreground">
          {metrics?.find(m => m?.id === selectedMetric)?.description || 'Select a metric to view details'}
        </p>
      </div>
    </div>
  );
};

export default PerformanceMetricToggle;