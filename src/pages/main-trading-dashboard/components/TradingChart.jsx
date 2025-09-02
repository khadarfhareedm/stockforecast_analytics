import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAnalyticalContext } from '../../../components/ui/ContextPreserver';

const TradingChart = ({ className = '' }) => {
  const { selectedStocks, timeframe } = useAnalyticalContext();
  const [activeModels, setActiveModels] = useState({
    LSTM: true,
    GRU: true,
    'CNN-LSTM': true
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock historical and prediction data
  const generateMockData = () => {
    const basePrice = 150;
    const data = [];
    const now = new Date();
    
    // Historical data (30 days)
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date?.setDate(date?.getDate() - i);
      
      const randomFactor = 0.95 + Math.random() * 0.1;
      const price = basePrice * randomFactor * (1 + Math.sin(i * 0.1) * 0.05);
      
      data?.push({
        date: date?.toISOString()?.split('T')?.[0],
        timestamp: date?.getTime(),
        actual: Math.round(price * 100) / 100,
        volume: Math.floor(Math.random() * 10000000) + 5000000,
        isHistorical: true
      });
    }
    
    // Prediction data (7 days)
    for (let i = 1; i <= 7; i++) {
      const date = new Date(now);
      date?.setDate(date?.getDate() + i);
      
      const lastPrice = data?.[data?.length - 1]?.actual;
      const trendFactor = 1 + (Math.random() - 0.5) * 0.02;
      
      data?.push({
        date: date?.toISOString()?.split('T')?.[0],
        timestamp: date?.getTime(),
        LSTM: Math.round(lastPrice * trendFactor * (1 + Math.random() * 0.01) * 100) / 100,
        GRU: Math.round(lastPrice * trendFactor * (1 + Math.random() * 0.015) * 100) / 100,
        'CNN-LSTM': Math.round(lastPrice * trendFactor * (1 + Math.random() * 0.008) * 100) / 100,
        confidence_LSTM: 0.85 + Math.random() * 0.1,
        confidence_GRU: 0.82 + Math.random() * 0.12,
        confidence_CNN_LSTM: 0.88 + Math.random() * 0.08,
        isHistorical: false
      });
    }
    
    return data;
  };

  const [chartData, setChartData] = useState(generateMockData());

  useEffect(() => {
    setChartData(generateMockData());
  }, [selectedStocks, timeframe]);

  const toggleModel = (model) => {
    setActiveModels(prev => ({
      ...prev,
      [model]: !prev?.[model]
    }));
  };

  const modelColors = {
    LSTM: '#2563EB',
    GRU: '#F59E0B',
    'CNN-LSTM': '#8B5CF6'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      const isHistorical = data?.isHistorical;
      
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-3">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {isHistorical ? (
            <div className="space-y-1">
              <p className="text-sm text-foreground">
                <span className="text-muted-foreground">Actual:</span> ${data?.actual}
              </p>
              <p className="text-xs text-muted-foreground">
                Volume: {(data?.volume / 1000000)?.toFixed(1)}M
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {Object.entries(activeModels)?.map(([model, isActive]) => {
                if (!isActive) return null;
                return (
                  <p key={model} className="text-sm" style={{ color: modelColors?.[model] }}>
                    <span className="text-muted-foreground">{model}:</span>${data?.[model]}
                    <span className="text-xs ml-2">
                      ({Math.round(data?.[`confidence_${model?.replace('-', '_')}`] * 100)}%)
                    </span>
                  </p>
                );
              })}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const currentDate = new Date()?.toISOString()?.split('T')?.[0];

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">Price Analysis & Predictions</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedStocks?.length > 0 ? selectedStocks?.[0] : 'No stock selected'}
            </span>
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {Object.entries(modelColors)?.map(([model, color]) => (
            <Button
              key={model}
              variant={activeModels?.[model] ? 'default' : 'ghost'}
              size="sm"
              onClick={() => toggleModel(model)}
              className="px-3 py-1.5 text-xs"
            >
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: activeModels?.[model] ? color : 'var(--color-muted-foreground)' }}
              ></div>
              {model}
            </Button>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            iconName={isFullscreen ? "Minimize2" : "Maximize2"}
            iconSize={16}
          >
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </Button>
        </div>
      </div>
      <div className={`p-6 ${isFullscreen ? 'h-96' : 'h-80'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Vertical line to separate historical from predictions */}
            <ReferenceLine 
              x={currentDate} 
              stroke="var(--color-warning)" 
              strokeDasharray="5 5"
              label={{ value: "Today", position: "top" }}
            />
            
            {/* Historical actual price line */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="var(--color-foreground)"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
            
            {/* Prediction lines */}
            {Object.entries(activeModels)?.map(([model, isActive]) => {
              if (!isActive) return null;
              return (
                <Line
                  key={model}
                  type="monotone"
                  dataKey={model}
                  stroke={modelColors?.[model]}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: modelColors?.[model], strokeWidth: 2, r: 3 }}
                  connectNulls={false}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="px-6 py-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-foreground rounded-full"></div>
              <span className="text-muted-foreground">Historical Data</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-1 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">AI Predictions</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Info" size={14} />
            <span className="text-xs">7-day forecast with confidence intervals</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;