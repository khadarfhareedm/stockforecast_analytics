import React, { useState, useEffect } from 'react';
import NavigationHeader from '../../components/ui/NavigationHeader';
import TabNavigation from '../../components/ui/TabNavigation';
import StockSearchInput from '../../components/ui/StockSearchInput';
import TimeframeSelector from '../../components/ui/TimeframeSelector';
import StockChart from '../../components/ui/StockChart';
import SentimentPanel from '../../components/ui/SentimentPanel';
import ForecastPanel from '../../components/ui/ForecastPanel';
import ModelSelector from './components/ModelSelector';
import BacktestingPeriodPicker from './components/BacktestingPeriodPicker';
import PerformanceMetricToggle from './components/PerformanceMetricToggle';
import ModelComparisonChart from './components/ModelComparisonChart';
import MetricCard from './components/MetricCard';
import CorrelationHeatmap from './components/CorrelationHeatmap';
import ModelRankingTable from './components/ModelRankingTable';
import BacktestingResults from './components/BacktestingResults';
import { useAnalyticalContext } from '../../components/ui/ContextPreserver';

// API Services
import stockApi from '../../utils/stockApi';
import mlModels from '../../utils/mlModels';


const ModelPerformanceAnalyticsDashboard = () => {
  const { selectedStocks, timeframe } = useAnalyticalContext();
  
  // Existing state
  const [selectedModels, setSelectedModels] = useState(['lstm', 'gru', 'cnn-lstm']);
  const [selectedPeriod, setSelectedPeriod] = useState('6M');
  const [selectedMetric, setSelectedMetric] = useState('accuracy');

  // New state for stock forecast functionality
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1y');
  const [stockData, setStockData] = useState([]);
  const [stockPrice, setStockPrice] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [selectedForecastModel, setSelectedForecastModel] = useState('lstm');
  const [forecastDays, setForecastDays] = useState(7);
  
  // Loading states
  const [loadingStock, setLoadingStock] = useState(false);
  const [loadingSentiment, setLoadingSentiment] = useState(false);
  const [loadingForecast, setLoadingForecast] = useState(false);

  // Load stock data when stock or timeframe changes
  useEffect(() => {
    if (selectedStock) {
      loadStockData();
      loadRealTimePrice();
      loadSentimentData();
    }
  }, [selectedStock, selectedTimeframe]);

  const loadStockData = async () => {
    setLoadingStock(true);
    try {
      const result = await stockApi?.getStockData(selectedStock, selectedTimeframe);
      if (result?.success) {
        setStockData(result?.data || []);
      } else {
        console.error('Failed to load stock data:', result?.error);
        setStockData([]);
      }
    } catch (error) {
      console.error('Error loading stock data:', error);
      setStockData([]);
    } finally {
      setLoadingStock(false);
    }
  };

  const loadRealTimePrice = async () => {
    try {
      const result = await stockApi?.getRealTimePrice(selectedStock);
      if (result?.success) {
        setStockPrice(result?.data);
      }
    } catch (error) {
      console.error('Error loading real-time price:', error);
    }
  };

  const loadSentimentData = async () => {
    setLoadingSentiment(true);
    try {
      const result = await stockApi?.getTwitterSentiment(selectedStock, 100);
      if (result?.success) {
        setSentimentData(result?.data?.sentiment);
        setTweets(result?.data?.tweets || []);
      }
    } catch (error) {
      console.error('Error loading sentiment data:', error);
    } finally {
      setLoadingSentiment(false);
    }
  };

  const handleRunForecast = async ({ model, days }) => {
    if (!stockData?.length) {
      alert('Please select a stock first');
      return;
    }

    setLoadingForecast(true);
    try {
      // Train the model
      let trainResult;
      switch (model?.toLowerCase()) {
        case 'arima':
          trainResult = await mlModels?.trainArima(stockData);
          break;
        case 'lstm':
          trainResult = await mlModels?.trainLSTM(stockData, 60, 25);
          break;
        case 'gru':
          trainResult = await mlModels?.trainGRU(stockData, 60, 25);
          break;
        case 'cnn-lstm':
          trainResult = await mlModels?.trainCNNLSTM(stockData, 60, 25);
          break;
        default:
          throw new Error('Unknown model type');
      }

      if (trainResult?.success) {
        // Make predictions
        const predResult = await mlModels?.predict(model, days);
        if (predResult?.success) {
          setPredictions(predResult?.predictions || []);
        } else {
          alert('Prediction failed: ' + predResult?.error);
        }
      } else {
        alert('Model training failed: ' + trainResult?.error);
      }
    } catch (error) {
      console.error('Forecast error:', error);
      alert('Forecast failed: ' + error?.message);
    } finally {
      setLoadingForecast(false);
    }
  };

  // Existing handlers
  const handleModelToggle = (modelId, isSelected) => {
    if (isSelected) {
      setSelectedModels([...selectedModels, modelId]);
    } else {
      setSelectedModels(selectedModels?.filter(id => id !== modelId));
    }
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const handleMetricChange = (metric) => {
    setSelectedMetric(metric);
  };

  // Mock metric data for the cards
  const metricCardsData = [
    {
      title: 'Best 1D Performance',
      value: '93.2%',
      change: 2.4,
      timeframe: '1D',
      confidence: 94,
      icon: 'Clock',
      color: '#3B82F6'
    },
    {
      title: 'Best 7D Performance',
      value: '89.7%',
      change: 1.8,
      timeframe: '7D',
      confidence: 87,
      icon: 'Calendar',
      color: '#F97316'
    },
    {
      title: 'Best 1M Performance',
      value: '85.4%',
      change: -0.6,
      timeframe: '1M',
      confidence: 82,
      icon: 'TrendingUp',
      color: '#A855F7'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <TabNavigation />
      <main className="pt-32 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          {/* Enhanced Header with Stock Search and Controls */}
          <div className="bg-background rounded-lg border p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Stock Search */}
              <div className="lg:col-span-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Search Stock Symbol
                </label>
                <StockSearchInput
                  selectedStock={selectedStock}
                  onStockSelect={setSelectedStock}
                  placeholder="Search stocks (AAPL, TSLA, GOOGL...)"
                  className="w-full"
                />
                {stockPrice && (
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current Price:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-foreground">
                        ${stockPrice?.price?.toFixed(2)}
                      </span>
                      <span className={`${stockPrice?.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stockPrice?.change >= 0 ? '+' : ''}
                        {stockPrice?.changePercent?.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeframe Selector */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Chart Timeframe
                </label>
                <TimeframeSelector
                  selectedTimeframe={selectedTimeframe}
                  onTimeframeChange={setSelectedTimeframe}
                  className="w-full"
                />
              </div>

              {/* Original Controls */}
              <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <ModelSelector
                  selectedModels={selectedModels}
                  onModelToggle={handleModelToggle}
                />
                <BacktestingPeriodPicker
                  selectedPeriod={selectedPeriod}
                  onPeriodChange={handlePeriodChange}
                />
                <PerformanceMetricToggle
                  selectedMetric={selectedMetric}
                  onMetricChange={handleMetricChange}
                />
              </div>
            </div>
          </div>

          {/* Stock Chart with Predictions and Sentiment */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <StockChart
                data={stockData}
                predictions={predictions}
                sentiment={{ data: tweets?.slice(0, 20)?.map(tweet => ({
                  date: tweet?.createdAt,
                  sentiment: tweet?.sentiment,
                  score: tweet?.confidence,
                  price: stockData?.find(d => 
                    new Date(d?.date)?.toDateString() === new Date(tweet?.createdAt)?.toDateString()
                  )?.close || stockPrice?.price || 0
                }))}}
                symbol={selectedStock}
                timeframe={selectedTimeframe}
                showPredictions={predictions?.length > 0}
                showSentiment={tweets?.length > 0}
                loading={loadingStock}
                height={500}
                className="h-full"
              />
            </div>
            
            <div className="space-y-6">
              {/* Sentiment Analysis */}
              <SentimentPanel
                sentimentData={sentimentData}
                tweets={tweets}
                symbol={selectedStock}
                showTweets={true}
                maxTweets={3}
                className="h-fit"
              />
              
              {/* Quick Stats */}
              {stockPrice && (
                <div className="bg-background rounded-lg border p-4">
                  <h4 className="font-medium text-foreground mb-3">Market Data</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Day High:</span>
                      <span className="font-medium">${stockPrice?.dayHigh?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Day Low:</span>
                      <span className="font-medium">${stockPrice?.dayLow?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volume:</span>
                      <span className="font-medium">{stockPrice?.volume?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">P/E Ratio:</span>
                      <span className="font-medium">{stockPrice?.peRatio?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Forecasting Panel */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ForecastPanel
              predictions={predictions}
              modelType={selectedForecastModel}
              onModelChange={setSelectedForecastModel}
              onForecastDaysChange={setForecastDays}
              onRunForecast={handleRunForecast}
              forecastDays={forecastDays}
              isLoading={loadingForecast}
              className="h-full"
            />
            
            <div className="space-y-6">
              {/* Original Model Comparison */}
              <ModelComparisonChart
                selectedModels={selectedModels}
                selectedMetric={selectedMetric}
              />
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metricCardsData?.map((card, index) => (
              <MetricCard
                key={index}
                title={card?.title}
                value={card?.value}
                change={card?.change}
                timeframe={card?.timeframe}
                confidence={card?.confidence}
                icon={card?.icon}
                color={card?.color}
              />
            ))}
          </div>

          {/* Dual-Pane Analysis */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-8">
              <CorrelationHeatmap />
            </div>
            <div className="xl:col-span-4">
              <ModelRankingTable />
            </div>
          </div>

          {/* Backtesting Results */}
          <div className="grid grid-cols-1 gap-6">
            <BacktestingResults />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModelPerformanceAnalyticsDashboard;