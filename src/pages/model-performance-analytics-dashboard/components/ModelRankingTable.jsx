import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ModelRankingTable = ({ className = '' }) => {
  const [selectedCondition, setSelectedCondition] = useState('bull');

  const marketConditions = [
    { id: 'bull', name: 'Bull Market', icon: 'TrendingUp', color: 'text-success' },
    { id: 'bear', name: 'Bear Market', icon: 'TrendingDown', color: 'text-error' },
    { id: 'volatile', name: 'Volatile Market', icon: 'Zap', color: 'text-warning' }
  ];

  // Mock ranking data for different market conditions
  const rankingData = {
    bull: [
      { rank: 1, model: 'CNN-LSTM', accuracy: 94.2, rmse: 0.032, sharpe: 2.18, trades: 156 },
      { rank: 2, model: 'LSTM', accuracy: 91.8, rmse: 0.038, sharpe: 1.94, trades: 142 },
      { rank: 3, model: 'GRU', accuracy: 88.5, rmse: 0.045, sharpe: 1.76, trades: 138 }
    ],
    bear: [
      { rank: 1, model: 'LSTM', accuracy: 87.3, rmse: 0.041, sharpe: 1.52, trades: 134 },
      { rank: 2, model: 'CNN-LSTM', accuracy: 85.9, rmse: 0.043, sharpe: 1.48, trades: 129 },
      { rank: 3, model: 'GRU', accuracy: 82.1, rmse: 0.051, sharpe: 1.31, trades: 125 }
    ],
    volatile: [
      { rank: 1, model: 'GRU', accuracy: 79.8, rmse: 0.058, sharpe: 1.23, trades: 167 },
      { rank: 2, model: 'CNN-LSTM', accuracy: 78.4, rmse: 0.061, sharpe: 1.19, trades: 159 },
      { rank: 3, model: 'LSTM', accuracy: 76.2, rmse: 0.065, sharpe: 1.12, trades: 151 }
    ]
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-400';
      case 3: return 'text-orange-400';
      default: return 'text-muted-foreground';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return 'Trophy';
      case 2: return 'Medal';
      case 3: return 'Award';
      default: return 'Circle';
    }
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="BarChart" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Model Performance Ranking</h3>
        </div>
      </div>
      {/* Market Condition Selector */}
      <div className="flex space-x-2 mb-6">
        {marketConditions?.map((condition) => (
          <Button
            key={condition?.id}
            variant={selectedCondition === condition?.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCondition(condition?.id)}
            iconName={condition?.icon}
            iconPosition="left"
            className="flex-1"
          >
            {condition?.name}
          </Button>
        ))}
      </div>
      {/* Ranking Table */}
      <div className="space-y-3">
        {rankingData?.[selectedCondition]?.map((item) => (
          <div key={item?.rank} className="flex items-center p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
            <div className="flex items-center space-x-3 flex-1">
              <div className={`flex items-center space-x-2 ${getRankColor(item?.rank)}`}>
                <Icon name={getRankIcon(item?.rank)} size={20} />
                <span className="font-bold text-lg">#{item?.rank}</span>
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{item?.model}</h4>
                <p className="text-sm text-muted-foreground">{item?.trades} trades analyzed</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 text-right">
              <div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
                <div className="font-semibold text-foreground">{item?.accuracy}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">RMSE</div>
                <div className="font-semibold text-foreground">{item?.rmse?.toFixed(3)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Sharpe</div>
                <div className="font-semibold text-foreground">{item?.sharpe?.toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Summary Stats */}
      <div className="mt-6 p-4 bg-primary/10 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Info" size={16} color="var(--color-primary)" />
          <span className="text-sm font-medium text-primary">Market Condition Analysis</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {selectedCondition === 'bull' && "CNN-LSTM performs best in trending upward markets with high momentum signals."}
          {selectedCondition === 'bear' && "LSTM shows superior resilience during market downturns with better risk management."}
          {selectedCondition === 'volatile' && "GRU adapts quickly to rapid market changes with faster convergence rates."}
        </p>
      </div>
    </div>
  );
};

export default ModelRankingTable;