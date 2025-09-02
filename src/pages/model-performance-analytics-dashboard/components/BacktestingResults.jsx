import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BacktestingResults = ({ className = '' }) => {
  const [activeView, setActiveView] = useState('equity');

  // Mock backtesting data
  const equityData = [
    { date: '2024-01-01', lstm: 100000, gru: 100000, 'cnn-lstm': 100000, benchmark: 100000 },
    { date: '2024-02-01', lstm: 103200, gru: 102800, 'cnn-lstm': 104500, benchmark: 101200 },
    { date: '2024-03-01', lstm: 106800, gru: 105200, 'cnn-lstm': 108900, benchmark: 102800 },
    { date: '2024-04-01', lstm: 104500, gru: 103100, 'cnn-lstm': 107200, benchmark: 101500 },
    { date: '2024-05-01', lstm: 108900, gru: 107300, 'cnn-lstm': 112400, benchmark: 103900 },
    { date: '2024-06-01', lstm: 112300, gru: 110800, 'cnn-lstm': 116700, benchmark: 106200 },
    { date: '2024-07-01', lstm: 115600, gru: 113400, 'cnn-lstm': 119800, benchmark: 108500 },
    { date: '2024-08-01', lstm: 118900, gru: 116200, 'cnn-lstm': 123400, benchmark: 110800 },
    { date: '2024-09-01', lstm: 122400, gru: 119500, 'cnn-lstm': 127800, benchmark: 113200 }
  ];

  const drawdownData = [
    { date: '2024-01-01', lstm: 0, gru: 0, 'cnn-lstm': 0 },
    { date: '2024-02-01', lstm: -0.8, gru: -1.2, 'cnn-lstm': -0.5 },
    { date: '2024-03-01', lstm: -1.5, gru: -2.1, 'cnn-lstm': -1.1 },
    { date: '2024-04-01', lstm: -2.8, gru: -3.4, 'cnn-lstm': -2.2 },
    { date: '2024-05-01', lstm: -1.2, gru: -1.8, 'cnn-lstm': -0.9 },
    { date: '2024-06-01', lstm: -0.6, gru: -1.1, 'cnn-lstm': -0.4 },
    { date: '2024-07-01', lstm: -0.9, gru: -1.4, 'cnn-lstm': -0.7 },
    { date: '2024-08-01', lstm: -1.3, gru: -1.9, 'cnn-lstm': -1.0 },
    { date: '2024-09-01', lstm: -0.7, gru: -1.2, 'cnn-lstm': -0.5 }
  ];

  const performanceMetrics = {
    lstm: {
      totalReturn: 22.4,
      annualizedReturn: 18.7,
      volatility: 12.3,
      sharpeRatio: 1.52,
      maxDrawdown: -2.8,
      winRate: 68.5
    },
    gru: {
      totalReturn: 19.5,
      annualizedReturn: 16.2,
      volatility: 13.1,
      sharpeRatio: 1.24,
      maxDrawdown: -3.4,
      winRate: 64.2
    },
    'cnn-lstm': {
      totalReturn: 27.8,
      annualizedReturn: 23.1,
      volatility: 11.8,
      sharpeRatio: 1.96,
      maxDrawdown: -2.2,
      winRate: 72.3
    }
  };

  const modelColors = {
    lstm: '#3B82F6',
    gru: '#F97316',
    'cnn-lstm': '#A855F7',
    benchmark: '#6B7280'
  };

  const views = [
    { id: 'equity', name: 'Equity Curves', icon: 'TrendingUp' },
    { id: 'drawdown', name: 'Drawdown', icon: 'TrendingDown' },
    { id: 'metrics', name: 'Metrics', icon: 'BarChart3' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const formatPercentage = (value) => {
    return `${value?.toFixed(1)}%`;
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Activity" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Backtesting Results</h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Calendar" size={16} />
          <span>Jan 2024 - Sep 2024</span>
        </div>
      </div>
      {/* View Selector */}
      <div className="flex space-x-2 mb-6">
        {views?.map((view) => (
          <Button
            key={view?.id}
            variant={activeView === view?.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView(view?.id)}
            iconName={view?.icon}
            iconPosition="left"
          >
            {view?.name}
          </Button>
        ))}
      </div>
      {/* Chart Area */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {activeView === 'equity' ? (
            <LineChart data={equityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => new Date(value)?.toLocaleDateString('en-US', { month: 'short' })}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-foreground)'
                }}
                formatter={(value, name) => [formatCurrency(value), name?.toUpperCase()]}
                labelFormatter={(label) => new Date(label)?.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              />
              <Legend />
              
              <Line type="monotone" dataKey="lstm" stroke={modelColors?.lstm} strokeWidth={2} name="LSTM" />
              <Line type="monotone" dataKey="gru" stroke={modelColors?.gru} strokeWidth={2} name="GRU" />
              <Line type="monotone" dataKey="cnn-lstm" stroke={modelColors?.['cnn-lstm']} strokeWidth={2} name="CNN-LSTM" />
              <Line type="monotone" dataKey="benchmark" stroke={modelColors?.benchmark} strokeWidth={2} strokeDasharray="5 5" name="Benchmark" />
            </LineChart>
          ) : activeView === 'drawdown' ? (
            <AreaChart data={drawdownData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => new Date(value)?.toLocaleDateString('en-US', { month: 'short' })}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={formatPercentage}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-foreground)'
                }}
                formatter={(value, name) => [formatPercentage(value), name?.toUpperCase()]}
              />
              <Legend />
              
              <Area type="monotone" dataKey="lstm" stackId="1" stroke={modelColors?.lstm} fill={modelColors?.lstm} fillOpacity={0.3} name="LSTM" />
              <Area type="monotone" dataKey="gru" stackId="2" stroke={modelColors?.gru} fill={modelColors?.gru} fillOpacity={0.3} name="GRU" />
              <Area type="monotone" dataKey="cnn-lstm" stackId="3" stroke={modelColors?.['cnn-lstm']} fill={modelColors?.['cnn-lstm']} fillOpacity={0.3} name="CNN-LSTM" />
            </AreaChart>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
              {Object.entries(performanceMetrics)?.map(([model, metrics]) => (
                <div key={model} className="bg-muted/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: modelColors?.[model] }}></div>
                    <h4 className="font-semibold text-foreground">{model?.toUpperCase()}</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Return</span>
                      <span className="text-sm font-medium text-success">{formatPercentage(metrics?.totalReturn)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Annual Return</span>
                      <span className="text-sm font-medium text-foreground">{formatPercentage(metrics?.annualizedReturn)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Volatility</span>
                      <span className="text-sm font-medium text-foreground">{formatPercentage(metrics?.volatility)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                      <span className="text-sm font-medium text-foreground">{metrics?.sharpeRatio?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Max Drawdown</span>
                      <span className="text-sm font-medium text-error">{formatPercentage(metrics?.maxDrawdown)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Win Rate</span>
                      <span className="text-sm font-medium text-foreground">{formatPercentage(metrics?.winRate)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ResponsiveContainer>
      </div>
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-success/10 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} color="var(--color-success)" />
            <span className="text-sm font-medium text-success">Best Performer</span>
          </div>
          <div className="text-lg font-bold text-foreground">CNN-LSTM</div>
          <div className="text-sm text-muted-foreground">27.8% total return</div>
        </div>
        
        <div className="p-4 bg-primary/10 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Shield" size={16} color="var(--color-primary)" />
            <span className="text-sm font-medium text-primary">Lowest Risk</span>
          </div>
          <div className="text-lg font-bold text-foreground">CNN-LSTM</div>
          <div className="text-sm text-muted-foreground">11.8% volatility</div>
        </div>
        
        <div className="p-4 bg-warning/10 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Target" size={16} color="var(--color-warning)" />
            <span className="text-sm font-medium text-warning">Best Sharpe</span>
          </div>
          <div className="text-lg font-bold text-foreground">1.96</div>
          <div className="text-sm text-muted-foreground">CNN-LSTM model</div>
        </div>
        
        <div className="p-4 bg-muted/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Calendar" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm font-medium text-muted-foreground">Test Period</span>
          </div>
          <div className="text-lg font-bold text-foreground">9 Months</div>
          <div className="text-sm text-muted-foreground">Jan - Sep 2024</div>
        </div>
      </div>
    </div>
  );
};

export default BacktestingResults;