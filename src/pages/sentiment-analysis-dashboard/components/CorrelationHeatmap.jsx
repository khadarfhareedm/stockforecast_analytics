import React from 'react';

const CorrelationHeatmap = ({ correlationData, timeframes }) => {
  const getCorrelationColor = (value) => {
    const intensity = Math.abs(value);
    if (value > 0) {
      return `rgba(16, 185, 129, ${intensity})`; // Green for positive correlation
    } else {
      return `rgba(239, 68, 68, ${intensity})`; // Red for negative correlation
    }
  };

  const getCorrelationText = (value) => {
    if (Math.abs(value) < 0.1) return 'text-foreground';
    return 'text-white';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Sentiment-Price Correlation Matrix</h3>
        <p className="text-sm text-muted-foreground">Correlation coefficients across different timeframes</p>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          <div className="grid grid-cols-6 gap-2 mb-2">
            <div className="text-sm font-medium text-muted-foreground p-2"></div>
            {timeframes?.map((timeframe) => (
              <div key={timeframe} className="text-sm font-medium text-muted-foreground p-2 text-center">
                {timeframe}
              </div>
            ))}
          </div>

          {/* Data Rows */}
          {correlationData?.map((stock) => (
            <div key={stock?.symbol} className="grid grid-cols-6 gap-2 mb-2">
              <div className="text-sm font-medium text-foreground p-2 flex items-center">
                {stock?.symbol}
              </div>
              {stock?.correlations?.map((correlation, index) => (
                <div
                  key={index}
                  className="p-2 rounded text-center text-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: getCorrelationColor(correlation) }}
                  title={`${stock?.symbol} - ${timeframes?.[index]}: ${correlation?.toFixed(3)}`}
                >
                  <span className={getCorrelationText(correlation)}>
                    {correlation?.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-success rounded" />
              <span className="text-sm text-muted-foreground">Positive Correlation</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-error rounded" />
              <span className="text-sm text-muted-foreground">Negative Correlation</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Range: -1.0 to +1.0
          </div>
        </div>
        
        <div className="mt-3 text-xs text-muted-foreground">
          <p>• Values closer to +1.0 indicate strong positive correlation between sentiment and price</p>
          <p>• Values closer to -1.0 indicate strong negative correlation</p>
          <p>• Values near 0.0 indicate weak or no correlation</p>
        </div>
      </div>
    </div>
  );
};

export default CorrelationHeatmap;