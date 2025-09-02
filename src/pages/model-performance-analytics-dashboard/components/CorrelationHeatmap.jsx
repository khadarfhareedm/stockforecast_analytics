import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CorrelationHeatmap = ({ className = '' }) => {
  const [hoveredCell, setHoveredCell] = useState(null);

  // Mock correlation data between model predictions and actual prices
  const correlationData = [
    { model: 'LSTM', stock: 'AAPL', correlation: 0.89, pValue: 0.001 },
    { model: 'LSTM', stock: 'GOOGL', correlation: 0.85, pValue: 0.002 },
    { model: 'LSTM', stock: 'MSFT', correlation: 0.91, pValue: 0.001 },
    { model: 'LSTM', stock: 'TSLA', correlation: 0.76, pValue: 0.008 },
    { model: 'LSTM', stock: 'AMZN', correlation: 0.88, pValue: 0.001 },
    
    { model: 'GRU', stock: 'AAPL', correlation: 0.86, pValue: 0.002 },
    { model: 'GRU', stock: 'GOOGL', correlation: 0.82, pValue: 0.003 },
    { model: 'GRU', stock: 'MSFT', correlation: 0.87, pValue: 0.002 },
    { model: 'GRU', stock: 'TSLA', correlation: 0.73, pValue: 0.012 },
    { model: 'GRU', stock: 'AMZN', correlation: 0.84, pValue: 0.003 },
    
    { model: 'CNN-LSTM', stock: 'AAPL', correlation: 0.92, pValue: 0.001 },
    { model: 'CNN-LSTM', stock: 'GOOGL', correlation: 0.88, pValue: 0.001 },
    { model: 'CNN-LSTM', stock: 'MSFT', correlation: 0.94, pValue: 0.001 },
    { model: 'CNN-LSTM', stock: 'TSLA', correlation: 0.79, pValue: 0.005 },
    { model: 'CNN-LSTM', stock: 'AMZN', correlation: 0.90, pValue: 0.001 }
  ];

  const models = ['LSTM', 'GRU', 'CNN-LSTM'];
  const stocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];

  const getCorrelationColor = (correlation) => {
    if (correlation >= 0.9) return 'bg-green-500';
    if (correlation >= 0.8) return 'bg-green-400';
    if (correlation >= 0.7) return 'bg-yellow-400';
    if (correlation >= 0.6) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const getCorrelationData = (model, stock) => {
    return correlationData?.find(d => d?.model === model && d?.stock === stock);
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Grid3X3" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Prediction-Price Correlation</h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Info" size={16} />
          <span>Hover for details</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          <div className="grid grid-cols-6 gap-2 mb-2">
            <div className="text-sm font-medium text-muted-foreground"></div>
            {stocks?.map(stock => (
              <div key={stock} className="text-sm font-medium text-center text-muted-foreground">
                {stock}
              </div>
            ))}
          </div>

          {/* Heatmap Grid */}
          {models?.map(model => (
            <div key={model} className="grid grid-cols-6 gap-2 mb-2">
              <div className="text-sm font-medium text-muted-foreground flex items-center">
                {model}
              </div>
              {stocks?.map(stock => {
                const data = getCorrelationData(model, stock);
                const cellKey = `${model}-${stock}`;
                
                return (
                  <div
                    key={cellKey}
                    className={`
                      relative h-12 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105
                      ${getCorrelationColor(data?.correlation || 0)}
                      ${hoveredCell === cellKey ? 'ring-2 ring-primary' : ''}
                    `}
                    onMouseEnter={() => setHoveredCell(cellKey)}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold text-white">
                        {(data?.correlation || 0)?.toFixed(2)}
                      </span>
                    </div>
                    {/* Tooltip */}
                    {hoveredCell === cellKey && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg min-w-48">
                          <div className="text-sm font-medium text-foreground mb-2">
                            {model} vs {stock}
                          </div>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div>Correlation: <span className="text-foreground font-medium">{data?.correlation?.toFixed(3)}</span></div>
                            <div>P-value: <span className="text-foreground font-medium">{data?.pValue?.toFixed(3)}</span></div>
                            <div>Significance: <span className={`font-medium ${data?.pValue < 0.05 ? 'text-success' : 'text-warning'}`}>
                              {data?.pValue < 0.05 ? 'Significant' : 'Not Significant'}
                            </span></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">Correlation Strength:</span>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span className="text-xs text-muted-foreground">&lt;0.7</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-xs text-muted-foreground">0.7-0.8</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span className="text-xs text-muted-foreground">0.8-0.9</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-xs text-muted-foreground">&gt;0.9</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrelationHeatmap;