import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ModelComparisonTable = ({ className = '' }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'accuracy', direction: 'desc' });

  const modelPerformanceData = [
    {
      model: 'LSTM',
      accuracy: 87.5,
      rmse: 2.34,
      mae: 1.89,
      confidence: 85.2,
      lastTrained: '2025-08-30',
      predictions: 1247,
      status: 'active',
      color: '#2563EB'
    },
    {
      model: 'GRU',
      accuracy: 84.2,
      rmse: 2.67,
      mae: 2.12,
      confidence: 82.1,
      lastTrained: '2025-08-29',
      predictions: 1189,
      status: 'active',
      color: '#F59E0B'
    },
    {
      model: 'CNN-LSTM',
      accuracy: 89.1,
      rmse: 2.18,
      mae: 1.76,
      confidence: 88.7,
      lastTrained: '2025-08-31',
      predictions: 1298,
      status: 'active',
      color: '#8B5CF6'
    }
  ];

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...modelPerformanceData]?.sort((a, b) => {
    if (sortConfig?.direction === 'asc') {
      return a?.[sortConfig?.key] > b?.[sortConfig?.key] ? 1 : -1;
    }
    return a?.[sortConfig?.key] < b?.[sortConfig?.key] ? 1 : -1;
  });

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} color="var(--color-muted-foreground)" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} color="var(--color-primary)" />
      : <Icon name="ArrowDown" size={14} color="var(--color-primary)" />;
  };

  const getPerformanceColor = (value, metric) => {
    switch (metric) {
      case 'accuracy': case'confidence':
        if (value >= 85) return 'text-success';
        if (value >= 75) return 'text-warning';
        return 'text-error';
      case 'rmse': case'mae':
        if (value <= 2.0) return 'text-success';
        if (value <= 2.5) return 'text-warning';
        return 'text-error';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="BarChart3" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Model Performance Comparison</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" iconName="Download" iconSize={16}>
            Export
          </Button>
          <Button variant="ghost" size="sm" iconName="RefreshCw" iconSize={16}>
            Refresh
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('model')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Model</span>
                  {getSortIcon('model')}
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('accuracy')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Accuracy (%)</span>
                  {getSortIcon('accuracy')}
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('rmse')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>RMSE</span>
                  {getSortIcon('rmse')}
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('mae')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>MAE</span>
                  {getSortIcon('mae')}
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('confidence')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Confidence (%)</span>
                  {getSortIcon('confidence')}
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('predictions')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Predictions</span>
                  {getSortIcon('predictions')}
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData?.map((model, index) => (
              <tr key={model?.model} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: model?.color }}
                    ></div>
                    <div>
                      <span className="font-medium text-foreground">{model?.model}</span>
                      <p className="text-xs text-muted-foreground">
                        Trained: {new Date(model.lastTrained)?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`font-medium ${getPerformanceColor(model?.accuracy, 'accuracy')}`}>
                    {model?.accuracy}%
                  </span>
                </td>
                <td className="p-4">
                  <span className={`font-medium ${getPerformanceColor(model?.rmse, 'rmse')}`}>
                    {model?.rmse}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`font-medium ${getPerformanceColor(model?.mae, 'mae')}`}>
                    {model?.mae}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${getPerformanceColor(model?.confidence, 'confidence')}`}>
                      {model?.confidence}%
                    </span>
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${model?.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-foreground font-medium">
                    {model?.predictions?.toLocaleString()}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm text-success capitalize">{model?.status}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-1">
                    <button
                      className="p-1.5 hover:bg-muted/50 rounded-md transition-colors"
                      title="View Details"
                    >
                      <Icon name="Eye" size={14} color="var(--color-muted-foreground)" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-muted/50 rounded-md transition-colors"
                      title="Configure"
                    >
                      <Icon name="Settings" size={14} color="var(--color-muted-foreground)" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-muted/50 rounded-md transition-colors"
                      title="Retrain"
                    >
                      <Icon name="RotateCcw" size={14} color="var(--color-muted-foreground)" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-border bg-muted/10">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Info" size={14} />
              <span>Performance metrics updated every 15 minutes</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-muted-foreground">
            <span>Best: CNN-LSTM (89.1%)</span>
            <span>•</span>
            <span>Avg: 86.9%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelComparisonTable;