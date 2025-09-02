import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const ModelComparisonChart = ({ selectedModels, selectedMetric, className = '' }) => {
  // Mock performance data over time
  const performanceData = [
    { date: '2024-07-01', lstm: 0.85, gru: 0.82, 'cnn-lstm': 0.88 },
    { date: '2024-07-08', lstm: 0.87, gru: 0.84, 'cnn-lstm': 0.89 },
    { date: '2024-07-15', lstm: 0.83, gru: 0.81, 'cnn-lstm': 0.86 },
    { date: '2024-07-22', lstm: 0.89, gru: 0.86, 'cnn-lstm': 0.91 },
    { date: '2024-07-29', lstm: 0.86, gru: 0.83, 'cnn-lstm': 0.88 },
    { date: '2024-08-05', lstm: 0.88, gru: 0.85, 'cnn-lstm': 0.90 },
    { date: '2024-08-12', lstm: 0.84, gru: 0.82, 'cnn-lstm': 0.87 },
    { date: '2024-08-19', lstm: 0.90, gru: 0.87, 'cnn-lstm': 0.92 },
    { date: '2024-08-26', lstm: 0.87, gru: 0.84, 'cnn-lstm': 0.89 },
    { date: '2024-09-01', lstm: 0.91, gru: 0.88, 'cnn-lstm': 0.93 }
  ];

  const modelColors = {
    lstm: '#3B82F6',
    gru: '#F97316',
    'cnn-lstm': '#A855F7'
  };

  const modelNames = {
    lstm: 'LSTM',
    gru: 'GRU',
    'cnn-lstm': 'CNN-LSTM'
  };

  const formatTooltipValue = (value, name) => {
    const metricFormats = {
      rmse: (val) => `${(val * 100)?.toFixed(2)}%`,
      mae: (val) => `${(val * 100)?.toFixed(2)}%`,
      accuracy: (val) => `${(val * 100)?.toFixed(1)}%`,
      sharpe: (val) => val?.toFixed(3)
    };
    
    return [metricFormats?.[selectedMetric]?.(value) || value?.toFixed(3), modelNames?.[name] || name];
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="LineChart" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Model Performance Comparison</h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="TrendingUp" size={16} />
          <span>Last 60 days</span>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => new Date(value)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => selectedMetric === 'accuracy' ? `${(value * 100)?.toFixed(0)}%` : value?.toFixed(2)}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-foreground)'
              }}
              formatter={formatTooltipValue}
              labelFormatter={(label) => new Date(label)?.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            />
            <Legend />
            
            {selectedModels?.includes('lstm') && (
              <Line 
                type="monotone" 
                dataKey="lstm" 
                stroke={modelColors?.lstm}
                strokeWidth={2}
                dot={{ fill: modelColors?.lstm, strokeWidth: 2, r: 4 }}
                name="LSTM"
              />
            )}
            {selectedModels?.includes('gru') && (
              <Line 
                type="monotone" 
                dataKey="gru" 
                stroke={modelColors?.gru}
                strokeWidth={2}
                dot={{ fill: modelColors?.gru, strokeWidth: 2, r: 4 }}
                name="GRU"
              />
            )}
            {selectedModels?.includes('cnn-lstm') && (
              <Line 
                type="monotone" 
                dataKey="cnn-lstm" 
                stroke={modelColors?.['cnn-lstm']}
                strokeWidth={2}
                dot={{ fill: modelColors?.['cnn-lstm'], strokeWidth: 2, r: 4 }}
                name="CNN-LSTM"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {selectedModels?.map((modelId) => {
          const latestData = performanceData?.[performanceData?.length - 1];
          const previousData = performanceData?.[performanceData?.length - 2];
          const currentValue = latestData?.[modelId];
          const previousValue = previousData?.[modelId];
          const change = ((currentValue - previousValue) / previousValue * 100);
          
          return (
            <div key={modelId} className="p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: modelColors?.[modelId] }}>
                  {modelNames?.[modelId]}
                </span>
                <div className={`flex items-center space-x-1 text-xs ${change >= 0 ? 'text-success' : 'text-error'}`}>
                  <Icon name={change >= 0 ? 'TrendingUp' : 'TrendingDown'} size={12} />
                  <span>{Math.abs(change)?.toFixed(1)}%</span>
                </div>
              </div>
              <div className="text-lg font-semibold text-foreground">
                {selectedMetric === 'accuracy' ? `${(currentValue * 100)?.toFixed(1)}%` : currentValue?.toFixed(3)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModelComparisonChart;