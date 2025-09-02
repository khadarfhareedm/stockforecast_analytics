import React, { useState, useEffect } from 'react';
import NavigationHeader from '../../components/ui/NavigationHeader';
import TabNavigation from '../../components/ui/TabNavigation';
import { useAnalyticalContext } from '../../components/ui/ContextPreserver';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import SentimentOverviewCard from './components/SentimentOverviewCard';
import SentimentPriceChart from './components/SentimentPriceChart';
import SocialMediaFeed from './components/SocialMediaFeed';
import SentimentDistributionChart from './components/SentimentDistributionChart';
import TrendingHashtags from './components/TrendingHashtags';
import CorrelationHeatmap from './components/CorrelationHeatmap';
import InfluencerMetrics from './components/InfluencerMetrics';
import StockSearchInput from '../../components/ui/StockSearchInput';
import PredictionChart from './components/PredictionChart';

const SentimentAnalysisDashboard = () => {
  const { selectedStocks, timeframe, sentimentSettings, updateSentimentSettings } = useAnalyticalContext();
  const [selectedStock, setSelectedStock] = useState(selectedStocks?.[0] || 'AAPL');
  const [selectedModel, setSelectedModel] = useState('LSTM');
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock data for sentiment analysis
  const sentimentOverviewData = [
    {
      title: "Current Sentiment Score",
      value: "+0.34",
      change: "+12.5%",
      changeType: "positive",
      icon: "TrendingUp",
      color: "bg-success"
    },
    {
      title: "24h Mentions",
      value: "15.2K",
      change: "+8.3%",
      changeType: "positive",
      icon: "MessageSquare",
      color: "bg-primary"
    },
    {
      title: "Volume Score",
      value: "847",
      change: "-3.2%",
      changeType: "negative",
      icon: "BarChart3",
      color: "bg-accent"
    },
    {
      title: "Price Correlation",
      value: "0.67",
      change: "+0.15",
      changeType: "positive",
      icon: "Activity",
      color: "bg-warning"
    }
  ];

  const sentimentPriceData = [
    { time: "09:00", price: 175.23, sentiment: 0.12 },
    { time: "10:00", price: 176.45, sentiment: 0.28 },
    { time: "11:00", price: 174.89, sentiment: -0.15 },
    { time: "12:00", price: 177.12, sentiment: 0.45 },
    { time: "13:00", price: 178.34, sentiment: 0.62 },
    { time: "14:00", price: 176.78, sentiment: 0.23 },
    { time: "15:00", price: 179.45, sentiment: 0.78 },
    { time: "16:00", price: 180.12, sentiment: 0.34 }
  ];

  // Enhanced prediction data with high/low forecasts and sentiment integration
  const predictionData = [
    { 
      time: "Day 1", 
      actualPrice: 175.23, 
      predictedPrice: 176.45, 
      expectedHigh: 178.90, 
      expectedLow: 173.80,
      priceUpperBound: 179.20,
      priceLowerBound: 173.50,
      sentiment: 0.34, 
      predictedSentiment: 0.42,
      confidence: 0.87,
      priceRange: 2.35
    },
    { 
      time: "Day 2", 
      actualPrice: 176.45, 
      predictedPrice: 178.12, 
      expectedHigh: 180.50, 
      expectedLow: 175.20,
      priceUpperBound: 181.00,
      priceLowerBound: 174.80,
      sentiment: 0.28, 
      predictedSentiment: 0.38,
      confidence: 0.85,
      priceRange: 2.80
    },
    { 
      time: "Day 3", 
      actualPrice: null, 
      predictedPrice: 179.67, 
      expectedHigh: 182.20, 
      expectedLow: 176.90,
      priceUpperBound: 183.10,
      priceLowerBound: 176.20,
      sentiment: null, 
      predictedSentiment: 0.45,
      confidence: 0.82,
      priceRange: 3.45
    },
    { 
      time: "Day 4", 
      actualPrice: null, 
      predictedPrice: 181.34, 
      expectedHigh: 184.80, 
      expectedLow: 178.50,
      priceUpperBound: 185.90,
      priceLowerBound: 177.80,
      sentiment: null, 
      predictedSentiment: 0.52,
      confidence: 0.79,
      priceRange: 4.05
    },
    { 
      time: "Day 5", 
      actualPrice: null, 
      predictedPrice: 183.45, 
      expectedHigh: 187.20, 
      expectedLow: 180.10,
      priceUpperBound: 188.50,
      priceLowerBound: 179.40,
      sentiment: null, 
      predictedSentiment: 0.58,
      confidence: 0.76,
      priceRange: 4.55
    },
    { 
      time: "Day 6", 
      actualPrice: null, 
      predictedPrice: 185.78, 
      expectedHigh: 189.90, 
      expectedLow: 182.30,
      priceUpperBound: 191.40,
      priceLowerBound: 181.60,
      sentiment: null, 
      predictedSentiment: 0.62,
      confidence: 0.73,
      priceRange: 4.90
    },
    { 
      time: "Day 7", 
      actualPrice: null, 
      predictedPrice: 187.92, 
      expectedHigh: 192.50, 
      expectedLow: 184.70,
      priceUpperBound: 194.20,
      priceLowerBound: 183.90,
      sentiment: null, 
      predictedSentiment: 0.67,
      confidence: 0.71,
      priceRange: 5.15
    }
  ];

  // Twitter-focused social media posts
  const twitterSentimentPosts = [
    {
      id: 1,
      platform: "twitter",
      username: "TechAnalyst_Pro",
      verified: true,
      content: `$${selectedStock} breaking above key resistance! 📈 The ${selectedModel} model is showing strong bullish signals. Price target raised to $190. #StockAnalysis #AI #TradingView`,
      sentiment: 0.78,
      timestamp: new Date(Date.now() - 300000),
      likes: 1234,
      retweets: 456,
      replies: 89,
      influence: 8.5,
      hashtags: [`${selectedStock}`, "bullish", "AI", "TradingView"]
    },
    {
      id: 2,
      platform: "twitter",
      username: "MarketSentiment_AI",
      verified: true,
      content: `🚨 ${selectedStock} Social Sentiment Alert: 72% positive mentions in last 4hrs. Twitter volume spike of +340%. Our ${selectedModel} prediction model shows 87% accuracy. This could be the breakout! 🚀`,
      sentiment: 0.85,
      timestamp: new Date(Date.now() - 450000),
      likes: 2567,
      retweets: 892,
      replies: 234,
      influence: 9.2,
      hashtags: ["Alert", selectedStock, "SentimentAnalysis"]
    },
    {
      id: 3,
      platform: "twitter",
      username: "WallStreetAI",
      verified: true,
      content: `Caution on $${selectedStock}: While ${selectedModel} shows upside potential, social sentiment seems overheated. Remember: trees don't grow to the sky 🌳 Risk management is key! #RiskManagement`,
      sentiment: -0.23,
      timestamp: new Date(Date.now() - 600000),
      likes: 899,
      retweets: 234,
      replies: 123,
      influence: 7.8,
      hashtags: [selectedStock, "RiskManagement", "caution"]
    },
    {
      id: 4,
      platform: "twitter",
      username: "AITradingBot",
      verified: false,
      content: `${selectedStock} Analysis Update: \n• ${selectedModel} Model Accuracy: 87%\n• Expected High: $192.50\n• Expected Low: $184.70\n• Sentiment Score: +0.67\n• Confidence: 71%\n\nThe fusion of price action + sentiment = 🔥`,
      sentiment: 0.62,
      timestamp: new Date(Date.now() - 750000),
      likes: 1567,
      retweets: 445,
      replies: 67,
      influence: 6.9,
      hashtags: [selectedStock, selectedModel, "analysis"]
    },
    {
      id: 5,
      platform: "twitter",
      username: "CryptoStockGuru",
      verified: true,
      content: `Dear followers, I've been tracking $${selectedStock} with advanced ML models. The ${selectedModel} algorithm suggests a consolidation phase before the next leg up. Patience will be rewarded! 💎🙌`,
      sentiment: 0.45,
      timestamp: new Date(Date.now() - 900000),
      likes: 3456,
      retweets: 1234,
      replies: 445,
      influence: 9.1,
      hashtags: [selectedStock, "ML", "patience", "DiamondHands"]
    }
  ];

  const socialMediaPosts = [
    {
      id: 1,
      platform: "twitter",
      username: "TechAnalyst_Pro",
      content: `$${selectedStock} showing strong momentum with institutional buying. The technical indicators are aligning perfectly for a breakout above resistance levels.`,
      sentiment: 0.78,
      timestamp: new Date(Date.now() - 300000),
      likes: 234,
      replies: 45,
      shares: 67,
      influence: 8.5
    },
    {
      id: 2,
      platform: "reddit",
      username: "MarketWatcher2024",
      content: `Just analyzed the latest earnings report for ${selectedStock}. Revenue growth is impressive but margins are concerning. Mixed signals here.`,
      sentiment: 0.12,
      timestamp: new Date(Date.now() - 600000),
      likes: 156,
      replies: 89,
      shares: 23,
      influence: 6.2
    },
    {
      id: 3,
      platform: "twitter",
      username: "WallStreetDaily",
      content: `Breaking: Major institutional investor increases position in $${selectedStock} by 15%. This could signal strong confidence in upcoming quarters.`,
      sentiment: 0.85,
      timestamp: new Date(Date.now() - 900000),
      likes: 567,
      replies: 123,
      shares: 234,
      influence: 9.1
    },
    {
      id: 4,
      platform: "reddit",
      username: "ValueInvestor_DD",
      content: `Detailed DD on ${selectedStock}: Fundamentals look solid but current valuation seems stretched. Waiting for a better entry point.`,
      sentiment: -0.23,
      timestamp: new Date(Date.now() - 1200000),
      likes: 89,
      replies: 34,
      shares: 12,
      influence: 5.8
    }
  ];

  const distributionData = [
    { hour: "00", positive: 45, negative: 23, neutral: 67 },
    { hour: "04", positive: 32, negative: 18, neutral: 45 },
    { hour: "08", positive: 89, negative: 34, neutral: 78 },
    { hour: "12", positive: 156, negative: 67, neutral: 123 },
    { hour: "16", positive: 234, negative: 89, neutral: 167 },
    { hour: "20", positive: 178, negative: 56, neutral: 134 }
  ];

  const pieData = [
    { name: "positive", value: 734, percentage: 52, color: "var(--color-success)" },
    { name: "neutral", value: 614, percentage: 34, color: "var(--color-muted-foreground)" },
    { name: "negative", value: 287, percentage: 14, color: "var(--color-error)" }
  ];

  const trendingHashtags = [
    {
      tag: selectedStock,
      mentions: 15234,
      trend: "up",
      change: "+23%",
      sentiment: 0.45,
      sparkline: [12, 15, 18, 22, 19, 25, 28, 24]
    },
    {
      tag: "earnings",
      mentions: 8967,
      trend: "up",
      change: "+18%",
      sentiment: 0.32,
      sparkline: [8, 10, 12, 15, 14, 16, 18, 17]
    },
    {
      tag: "bullish",
      mentions: 6543,
      trend: "down",
      change: "-5%",
      sentiment: 0.78,
      sparkline: [20, 18, 16, 14, 12, 10, 8, 9]
    },
    {
      tag: "technicals",
      mentions: 4321,
      trend: "up",
      change: "+12%",
      sentiment: 0.23,
      sparkline: [5, 6, 7, 8, 9, 10, 11, 12]
    }
  ];

  const correlationData = [
    {
      symbol: "AAPL",
      correlations: [0.67, 0.72, 0.58, 0.81, 0.69]
    },
    {
      symbol: "GOOGL",
      correlations: [0.54, 0.61, 0.48, 0.73, 0.56]
    },
    {
      symbol: "MSFT",
      correlations: [0.71, 0.68, 0.63, 0.79, 0.74]
    },
    {
      symbol: "TSLA",
      correlations: [0.89, 0.85, 0.92, 0.87, 0.91]
    }
  ];

  const timeframes = ["1H", "4H", "1D", "1W", "1M"];

  const influencers = [
    {
      id: 1,
      username: "ElonMusk",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      followers: 150000000,
      posts: 45,
      engagement: 12.5,
      influenceScore: 95,
      avgSentiment: 0.34,
      marketImpact: 8.7,
      verified: true
    },
    {
      id: 2,
      username: "CathieDWood",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      followers: 2500000,
      posts: 23,
      engagement: 8.9,
      influenceScore: 87,
      avgSentiment: 0.67,
      marketImpact: 6.2,
      verified: true
    },
    {
      id: 3,
      username: "jimcramer",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      followers: 1800000,
      posts: 67,
      engagement: 15.2,
      influenceScore: 82,
      avgSentiment: -0.12,
      marketImpact: 5.8,
      verified: true
    }
  ];

  const stockOptions = [
    { value: 'AAPL', label: 'Apple Inc. (AAPL)' },
    { value: 'GOOGL', label: 'Alphabet Inc. (GOOGL)' },
    { value: 'MSFT', label: 'Microsoft Corp. (MSFT)' },
    { value: 'TSLA', label: 'Tesla Inc. (TSLA)' },
    { value: 'AMZN', label: 'Amazon.com Inc. (AMZN)' }
  ];

  const sentimentModelOptions = [
    { value: 'VADER', label: 'VADER Sentiment' },
    { value: 'BERT', label: 'BERT Model' },
    { value: 'RoBERTa', label: 'RoBERTa Model' }
  ];

  const timeRangeOptions = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  // Simulate live updates
  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveUpdating]);

  const handlePostClick = (post) => {
    console.log('Post clicked:', post);
  };

  const handleHashtagClick = (hashtag) => {
    console.log('Hashtag clicked:', hashtag);
  };

  const handleInfluencerClick = (influencer) => {
    console.log('Influencer clicked:', influencer);
  };

  const handleExportReport = () => {
    console.log('Exporting sentiment analysis report...');
  };

  const handleStockSelect = (stockSymbol) => {
    setSelectedStock(stockSymbol);
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
    updateSentimentSettings({ ...sentimentSettings, model });
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <TabNavigation />
      <main className="pt-32 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Advanced Stock Sentiment & Prediction</h1>
              <p className="text-muted-foreground">AI-powered forecasting with Twitter sentiment analysis and 100+ stock coverage</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Enhanced Stock Search */}
              <StockSearchInput
                selectedStock={selectedStock}
                onStockSelect={handleStockSelect}
                placeholder="Search 100+ stocks..."
                className="w-64"
              />

              {/* Time Range */}
              <Select
                options={timeRangeOptions}
                value={sentimentSettings?.timeRange}
                onChange={(value) => updateSentimentSettings({ timeRange: value })}
                placeholder="Time Range"
                className="w-36"
              />

              {/* Live Updates Toggle */}
              <Button
                variant={isLiveUpdating ? "default" : "outline"}
                onClick={() => setIsLiveUpdating(!isLiveUpdating)}
                iconName={isLiveUpdating ? "Pause" : "Play"}
                iconPosition="left"
                size="sm"
              >
                {isLiveUpdating ? 'Live' : 'Paused'}
              </Button>

              {/* Export Button */}
              <Button
                variant="outline"
                onClick={handleExportReport}
                iconName="Download"
                iconPosition="left"
                size="sm"
              >
                Export
              </Button>
            </div>
          </div>

          {/* Live Status Indicator */}
          <div className="flex items-center justify-between mb-6 p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isLiveUpdating ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
                <span className="text-sm font-medium text-foreground">
                  {isLiveUpdating ? 'Live Twitter Feed Active' : 'Data Feed Paused'}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated: {lastUpdate?.toLocaleTimeString()}
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Icon name="Twitter" size={16} color="var(--color-primary)" />
                <span className="text-muted-foreground">Twitter API: Connected</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Brain" size={16} color="var(--color-accent)" />
                <span className="text-muted-foreground">Model: {selectedModel}</span>
              </div>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {sentimentOverviewData?.map((card, index) => (
              <SentimentOverviewCard
                key={index}
                title={card?.title}
                value={card?.value}
                change={card?.change}
                changeType={card?.changeType}
                icon={card?.icon}
                color={card?.color}
              />
            ))}
          </div>

          {/* Main Prediction Chart */}
          <div className="mb-8">
            <PredictionChart
              data={predictionData}
              selectedStock={selectedStock}
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Price vs Sentiment Chart */}
            <div className="lg:col-span-8">
              <SentimentPriceChart
                data={sentimentPriceData}
                selectedStock={selectedStock}
                timeframe={timeframe}
              />
            </div>

            {/* Enhanced Twitter Social Media Feed */}
            <div className="lg:col-span-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Icon name="Twitter" size={20} className="text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Twitter Sentiment Feed</h3>
                </div>
                
                <SocialMediaFeed
                  posts={twitterSentimentPosts}
                  onPostClick={handlePostClick}
                />
              </div>
            </div>
          </div>

          {/* Distribution Charts */}
          <div className="mb-8">
            <SentimentDistributionChart
              distributionData={distributionData}
              pieData={pieData}
            />
          </div>

          {/* Secondary Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Trending Hashtags */}
            <div>
              <TrendingHashtags
                hashtags={trendingHashtags}
                onHashtagClick={handleHashtagClick}
              />
            </div>

            {/* Influencer Metrics */}
            <div>
              <InfluencerMetrics
                influencers={influencers}
                onInfluencerClick={handleInfluencerClick}
              />
            </div>

            {/* Additional Metrics */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Market Sentiment Metrics</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fear & Greed Index</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-success rounded-full" />
                    </div>
                    <span className="text-sm font-medium text-foreground">74</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Volatility Index</span>
                  <span className="text-sm font-medium text-foreground">18.5</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Social Volume</span>
                  <div className="flex items-center space-x-1 text-success">
                    <Icon name="TrendingUp" size={16} />
                    <span className="text-sm font-medium">+15%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">News Sentiment</span>
                  <span className="text-sm font-medium text-foreground">+0.42</span>
                </div>
              </div>
            </div>
          </div>

          {/* Correlation Heatmap */}
          <div className="mb-8">
            <CorrelationHeatmap
              correlationData={correlationData}
              timeframes={timeframes}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SentimentAnalysisDashboard;