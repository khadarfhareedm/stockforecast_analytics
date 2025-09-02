import React, { useState, useMemo } from 'react';
import { cn } from '../../utils/cn';
import Icon from '../AppIcon';
import Button from './Button';
import Select from './Select';
import Input from './Input';

const ForecastPanel = ({ 
  predictions = [],
  modelType = 'LSTM',
  onModelChange,
  onForecastDaysChange,
  onRunForecast,
  forecastDays = 7,
  isLoading = false,
  className = "",
  availableModels = [
    { value: 'arima', label: 'ARIMA', description: 'Auto Regressive Integrated Moving Average' },
    { value: 'lstm', label: 'LSTM', description: 'Long Short-Term Memory Neural Network' },
    { value: 'gru', label: 'GRU', description: 'Gated Recurrent Unit Neural Network' },
    { value: 'cnn-lstm', label: 'CNN-LSTM', description: 'Hybrid Convolutional + LSTM Model' }
  ]
}) => {
  const [selectedModel, setSelectedModel] = useState(modelType?.toLowerCase() || 'lstm');
  const [selectedDays, setSelectedDays] = useState(forecastDays);

  const forecastStats = useMemo(() => {
    if (!predictions?.length) return null;

    const prices = predictions?.map(p => p?.predicted);
    const currentPrice = prices?.[0];
    const finalPrice = prices?.[prices?.length - 1];
    const priceChange = finalPrice - currentPrice;
    const changePercent = (priceChange / currentPrice) * 100;

    const avgConfidence = predictions?.reduce((sum, p) => sum + (p?.confidence || 0), 0) / predictions?.length;

    return {
      currentPrice: currentPrice,
      finalPrice: finalPrice,
      priceChange: priceChange,
      changePercent: changePercent,
      avgConfidence: avgConfidence,
      trend: priceChange > 0 ? 'bullish' : priceChange < 0 ? 'bearish' : 'neutral'
    };
  }, [predictions]);

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    onModelChange?.(model);
  };

  const handleDaysChange = (days) => {
    setSelectedDays(days);
    onForecastDaysChange?.(days);
  };

  const handleRunForecast = () => {
    onRunForecast?.({
      model: selectedModel,
      days: selectedDays
    });
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price)?.toFixed(2)}`;
  };

  const formatPercent = (percent) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent?.toFixed(2)}%`;
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'bullish':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'bearish':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'bullish':
        return 'TrendingUp';
      case 'bearish':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <div className={cn("bg-background rounded-lg border", className)}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Price Forecast
          </h3>
          <div className="flex items-center space-x-2">
            <Icon name="Brain" size={18} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">ML Powered</span>
          </div>
        </div>

        {/* Model Selection & Configuration */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                ML Model
              </label>
              <Select
                value={selectedModel}
                onValueChange={handleModelSelect}
                className="w-full"
              >
                {availableModels?.map((model) => (
                  <option key={model?.value} value={model?.value}>
                    {model?.label}
                  </option>
                ))}
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {availableModels?.find(m => m?.value === selectedModel)?.description}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Forecast Days
              </label>
              <div className="flex space-x-2">
                {[7, 15, 30]?.map((days) => (
                  <Button
                    key={days}
                    variant={selectedDays === days ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDaysChange(days)}
                    className="flex-1"
                  >
                    {days}d
                  </Button>
                ))}
              </div>
              <div className="mt-2">
                <Input
                  type="number"
                  value={selectedDays}
                  onChange={(e) => handleDaysChange(parseInt(e?.target?.value) || 7)}
                  min="1"
                  max="365"
                  placeholder="Custom days..."
                  className="w-full text-sm"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleRunForecast}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Training Model...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Icon name="Play" size={16} />
                <span>Run Forecast</span>
              </div>
            )}
          </Button>
        </div>

        {/* Forecast Results */}
        {forecastStats && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h4 className="font-medium text-foreground mb-3">Forecast Summary</h4>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Target Price</div>
                  <div className="text-xl font-semibold text-foreground">
                    {formatPrice(forecastStats?.finalPrice)}
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Expected Change</div>
                  <div className={cn(
                    "text-xl font-semibold",
                    forecastStats?.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  )}>
                    {formatPercent(forecastStats?.changePercent)}
                  </div>
                </div>
              </div>

              {/* Trend Indicator */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 mb-4">
                <div className="flex items-center space-x-3">
                  <div className={cn("p-2 rounded-full", getTrendColor(forecastStats?.trend))}>
                    <Icon name={getTrendIcon(forecastStats?.trend)} size={18} />
                  </div>
                  <div>
                    <div className="font-medium text-foreground capitalize">
                      {forecastStats?.trend} Trend
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedDays}-day outlook
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {(forecastStats?.avgConfidence * 100)?.toFixed(0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Confidence</div>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground">Price Range Forecast</div>
                
                <div className="space-y-2">
                  {predictions?.slice(0, 5)?.map((pred, index) => {
                    const date = new Date(pred?.date);
                    const isToday = index === 0;
                    
                    return (
                      <div key={index} className="flex items-center justify-between text-sm py-1">
                        <span className={cn(
                          "text-muted-foreground",
                          isToday && "font-medium text-foreground"
                        )}>
                          {date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {isToday && ' (Today)'}
                        </span>
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-foreground">
                            {formatPrice(pred?.predicted)}
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={cn(
                                "h-2 rounded-full",
                                pred?.confidence > 0.7 ? 'bg-green-500' :
                                pred?.confidence > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                              )}
                              style={{ width: `${pred?.confidence * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {predictions?.length > 5 && (
                  <div className="text-center pt-2">
                    <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                      View all {predictions?.length} predictions
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!forecastStats && !isLoading && (
          <div className="text-center space-y-3 py-8">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Icon name="BarChart3" size={24} className="text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">No Forecast Available</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Select a model and click "Run Forecast" to see predictions
              </p>
            </div>
          </div>
        )}

        {/* Model Info */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">About {selectedModel?.toUpperCase()} Model:</p>
              <p className="leading-relaxed">
                {availableModels?.find(m => m?.value === selectedModel)?.description}
                {selectedModel === 'lstm' && " - Best for capturing long-term dependencies in sequential data."}
                {selectedModel === 'arima' && " - Classical statistical model ideal for stationary time series."}
                {selectedModel === 'gru' && " - More efficient alternative to LSTM with comparable performance."}
                {selectedModel === 'cnn-lstm' && " - Combines pattern recognition with sequence modeling."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastPanel;