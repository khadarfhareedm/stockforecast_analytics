import React, { useState } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const PredictionChart = ({ data, selectedStock, selectedModel, onModelChange }) => {
  const [showConfidenceInterval, setShowConfidenceInterval] = useState(true);
  const [viewMode, setViewMode] = useState('combined'); // 'combined', 'price', 'sentiment'

  const modelOptions = [
    { value: 'LSTM', label: 'LSTM Neural Network' },
    { value: 'GRU', label: 'GRU Model' },
    { value: 'CNN-LSTM', label: 'CNN-LSTM Hybrid' }
  ];

  const viewModeOptions = [
    { value: 'combined', label: 'Price + Sentiment' },
    { value: 'price', label: 'Price Only' },
    { value: 'sentiment', label: 'Sentiment Only' }
  ];

  const getModelAccuracy = (model) => {
    const accuracies = {
      'LSTM': { accuracy: 87.3, color: 'text-success' },
      'GRU': { accuracy: 84.7, color: 'text-warning' },
      'CNN-LSTM': { accuracy: 91.2, color: 'text-primary' }
    };
    return accuracies?.[model] || accuracies?.['LSTM'];
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const currentData = payload?.[0]?.payload;
      
      return (
        <div className="bg-popover border border-border rounded-lg p-4 shadow-lg min-w-[250px]">
          <p className="text-sm font-semibold text-foreground mb-3">{label}</p>
          
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between mb-2 text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry?.color }}
                />
                <span className="text-muted-foreground">{entry?.name}:</span>
              </div>
              <span className="text-foreground font-medium">
                {entry?.dataKey?.includes('price') || entry?.dataKey?.includes('Price') ? 
                  `$${entry?.value?.toFixed(2)}` : 
                  entry?.value?.toFixed(3)
                }
              </span>
            </div>
          ))}
          
          {currentData?.confidence && (
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Confidence:</span>
                <span className="text-foreground font-medium">
                  {(currentData?.confidence * 100)?.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Range:</span>
                <span className="text-foreground font-medium">
                  ±${currentData?.priceRange?.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const modelInfo = getModelAccuracy(selectedModel);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="TrendingUp" size={20} />
            <span>AI Prediction Analysis</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            {selectedStock} - Expected High/Low with Sentiment Impact
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Model Selector */}
          <Select
            options={modelOptions}
            value={selectedModel}
            onChange={onModelChange}
            placeholder="Select Model"
            className="w-48"
          />
          
          {/* View Mode */}
          <Select
            options={viewModeOptions}
            value={viewMode}
            onChange={setViewMode}
            placeholder="View Mode"
            className="w-40"
          />
          
          {/* Confidence Toggle */}
          <button
            onClick={() => setShowConfidenceInterval(!showConfidenceInterval)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              showConfidenceInterval 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Confidence Band
          </button>
        </div>
      </div>

      {/* Model Performance Indicator */}
      <div className="flex items-center space-x-6 mb-6 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="Target" size={16} className={modelInfo?.color} />
          <span className="text-sm text-muted-foreground">Model Accuracy:</span>
          <span className={`text-sm font-semibold ${modelInfo?.color}`}>
            {modelInfo?.accuracy}%
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Prediction Window:</span>
          <span className="text-sm font-medium text-foreground">7 Days</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="Activity" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Last Updated:</span>
          <span className="text-sm font-medium text-foreground">2 mins ago</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            
            {/* Price Y-Axis */}
            {(viewMode === 'combined' || viewMode === 'price') && (
              <YAxis 
                yAxisId="price"
                orientation="left"
                stroke="var(--color-primary)"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
            )}
            
            {/* Sentiment Y-Axis */}
            {(viewMode === 'combined' || viewMode === 'sentiment') && (
              <YAxis 
                yAxisId="sentiment"
                orientation="right"
                stroke="var(--color-accent)"
                fontSize={12}
                domain={[-1, 1]}
              />
            )}
            
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Sentiment Zero Line */}
            {(viewMode === 'combined' || viewMode === 'sentiment') && (
              <ReferenceLine 
                y={0} 
                yAxisId="sentiment" 
                stroke="var(--color-muted-foreground)" 
                strokeDasharray="2 2" 
              />
            )}
            
            {/* Confidence Interval for Price (as Area) */}
            {showConfidenceInterval && (viewMode === 'combined' || viewMode === 'price') && (
              <>
                <Area
                  yAxisId="price"
                  dataKey="priceUpperBound"
                  fill="var(--color-primary)"
                  fillOpacity={0.1}
                  stroke="none"
                />
                <Area
                  yAxisId="price"
                  dataKey="priceLowerBound"
                  fill="var(--color-background)"
                  fillOpacity={1}
                  stroke="none"
                />
              </>
            )}
            
            {/* Actual Price Line */}
            {(viewMode === 'combined' || viewMode === 'price') && (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="actualPrice"
                stroke="var(--color-muted-foreground)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Actual Price"
              />
            )}
            
            {/* Predicted Price Line */}
            {(viewMode === 'combined' || viewMode === 'price') && (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="predictedPrice"
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ fill: "var(--color-primary)", strokeWidth: 2, r: 4 }}
                name="Predicted Price"
              />
            )}
            
            {/* Expected High Line */}
            {(viewMode === 'combined' || viewMode === 'price') && (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="expectedHigh"
                stroke="var(--color-success)"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={false}
                name="Expected High"
              />
            )}
            
            {/* Expected Low Line */}
            {(viewMode === 'combined' || viewMode === 'price') && (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="expectedLow"
                stroke="var(--color-error)"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={false}
                name="Expected Low"
              />
            )}
            
            {/* Sentiment Line */}
            {(viewMode === 'combined' || viewMode === 'sentiment') && (
              <Line
                yAxisId="sentiment"
                type="monotone"
                dataKey="sentiment"
                stroke="var(--color-accent)"
                strokeWidth={2}
                dot={{ fill: "var(--color-accent)", strokeWidth: 2, r: 3 }}
                name="Sentiment Score"
              />
            )}
            
            {/* Predicted Sentiment Line */}
            {(viewMode === 'combined' || viewMode === 'sentiment') && (
              <Line
                yAxisId="sentiment"
                type="monotone"
                dataKey="predictedSentiment"
                stroke="var(--color-warning)"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                name="Predicted Sentiment"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Prediction Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="ArrowUp" size={16} className="text-success" />
            <span className="text-sm font-medium text-foreground">Expected High</span>
          </div>
          <p className="text-lg font-bold text-success">
            ${data?.[data?.length - 1]?.expectedHigh?.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">Next 7 days</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="ArrowDown" size={16} className="text-error" />
            <span className="text-sm font-medium text-foreground">Expected Low</span>
          </div>
          <p className="text-lg font-bold text-error">
            ${data?.[data?.length - 1]?.expectedLow?.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">Next 7 days</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="Target" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Target Price</span>
          </div>
          <p className="text-lg font-bold text-primary">
            ${data?.[data?.length - 1]?.predictedPrice?.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">7-day forecast</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="TrendingUp" size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Sentiment Trend</span>
          </div>
          <p className="text-lg font-bold text-accent">
            {data?.[data?.length - 1]?.predictedSentiment > 0 ? '+' : ''}
            {data?.[data?.length - 1]?.predictedSentiment?.toFixed(3)}
          </p>
          <p className="text-xs text-muted-foreground">Predicted sentiment</p>
        </div>
      </div>
    </div>
  );
};

export default PredictionChart;