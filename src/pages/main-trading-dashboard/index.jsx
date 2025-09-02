import React from 'react';
import NavigationHeader from '../../components/ui/NavigationHeader';
import TabNavigation from '../../components/ui/TabNavigation';
import StockSelector from './components/StockSelector';
import TimeframeSelector from './components/TimeframeSelector';
import DataStatusIndicator from './components/DataStatusIndicator';
import KPIMetricCard from './components/KPIMetricCard';
import TradingChart from './components/TradingChart';
import SentimentFeed from './components/SentimentFeed';
import ModelComparisonTable from './components/ModelComparisonTable';
import { useAnalyticalContext } from '../../components/ui/ContextPreserver';

const MainTradingDashboard = () => {
  const { selectedStocks } = useAnalyticalContext();

  // Mock KPI data based on selected stocks
  const mockKPIData = {
    currentPrice: {
      value: '$156.78',
      change: '+$2.34',
      changePercent: '+1.52%',
      trend: 'up'
    },
    dailyChange: {
      value: '+1.52%',
      change: '+$2.34',
      changePercent: '+0.23%',
      trend: 'up'
    },
    volume: {
      value: '45.2M',
      change: '+12.3%',
      changePercent: '+12.3%',
      trend: 'up'
    },
    sentiment: {
      value: '78.5%',
      change: '+5.2%',
      changePercent: '+5.2%',
      trend: 'up'
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <TabNavigation />
      <main className="pt-32 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          {/* Global Controls Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StockSelector />
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <TimeframeSelector />
              <DataStatusIndicator />
            </div>
          </div>

          {/* KPI Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPIMetricCard
              title="Current Price"
              value={mockKPIData?.currentPrice?.value}
              change={mockKPIData?.currentPrice?.change}
              changePercent={mockKPIData?.currentPrice?.changePercent}
              trend={mockKPIData?.currentPrice?.trend}
              icon="DollarSign"
            />
            <KPIMetricCard
              title="Daily Change"
              value={mockKPIData?.dailyChange?.value}
              change={mockKPIData?.dailyChange?.change}
              changePercent={mockKPIData?.dailyChange?.changePercent}
              trend={mockKPIData?.dailyChange?.trend}
              icon="TrendingUp"
            />
            <KPIMetricCard
              title="Volume"
              value={mockKPIData?.volume?.value}
              change={mockKPIData?.volume?.change}
              changePercent={mockKPIData?.volume?.changePercent}
              trend={mockKPIData?.volume?.trend}
              icon="BarChart3"
            />
            <KPIMetricCard
              title="Sentiment Score"
              value={mockKPIData?.sentiment?.value}
              change={mockKPIData?.sentiment?.change}
              changePercent={mockKPIData?.sentiment?.changePercent}
              trend={mockKPIData?.sentiment?.trend}
              icon="MessageSquare"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Trading Chart - Takes 2/3 width on desktop */}
            <div className="xl:col-span-2">
              <TradingChart />
            </div>
            
            {/* Sentiment Feed - Takes 1/3 width on desktop */}
            <div className="xl:col-span-1">
              <SentimentFeed />
            </div>
          </div>

          {/* Model Comparison Table */}
          <div className="w-full">
            <ModelComparisonTable />
          </div>

          {/* Additional Info Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Market Intelligence Summary</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span>Updated 2 minutes ago</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">AI Forecast Consensus</h4>
                <p className="text-sm text-muted-foreground">
                  All three models (LSTM, GRU, CNN-LSTM) show bullish sentiment for the next 7 days with 
                  an average confidence of 85.3%. Expected price target: $162.45 (+3.6%).
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Social Sentiment Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Current sentiment score of 78.5% indicates strong positive momentum. Twitter mentions 
                  up 23% with Reddit engagement showing increased bullish discussions.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Risk Assessment</h4>
                <p className="text-sm text-muted-foreground">
                  Moderate risk level with volatility index at 18.2%. Key support at $152.30, 
                  resistance at $159.80. Stop-loss recommended at $148.50.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainTradingDashboard;