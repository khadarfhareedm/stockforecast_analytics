import axios from 'axios';
import yahooFinance from 'yahoo-finance2';

class StockAPIService {
  constructor() {
    this.baseURL = 'https://query1.finance.yahoo.com/v8/finance/chart/';
    this.alphaVantageKey = import.meta.env?.VITE_ALPHA_VANTAGE_API_KEY;
    this.twitterApiKey = import.meta.env?.VITE_TWITTER_API_KEY;
    this.twitterApiSecret = import.meta.env?.VITE_TWITTER_API_SECRET;
  }

  // Yahoo Finance API for real-time stock data
  async getStockData(symbol, period = '1y') {
    try {
      const result = await yahooFinance?.historical(symbol, {
        period1: this.getPeriodStartDate(period),
        period2: new Date(),
        interval: '1d'
      });
      
      return {
        success: true,
        data: result?.map(item => ({
          date: item?.date,
          open: item?.open,
          high: item?.high,
          low: item?.low,
          close: item?.close,
          volume: item?.volume,
          adjClose: item?.adjClose
        })) || []
      };
    } catch (error) {
      console.error('Yahoo Finance API Error:', error);
      return this.getFallbackStockData(symbol, period);
    }
  }

  // Real-time stock price
  async getRealTimePrice(symbol) {
    try {
      const quote = await yahooFinance?.quoteSummary(symbol, {
        modules: ['price', 'summaryDetail']
      });
      
      return {
        success: true,
        data: {
          symbol: symbol,
          price: quote?.price?.regularMarketPrice,
          change: quote?.price?.regularMarketChange,
          changePercent: quote?.price?.regularMarketChangePercent,
          dayHigh: quote?.price?.regularMarketDayHigh,
          dayLow: quote?.price?.regularMarketDayLow,
          volume: quote?.price?.regularMarketVolume,
          marketCap: quote?.summaryDetail?.marketCap,
          peRatio: quote?.summaryDetail?.trailingPE
        }
      };
    } catch (error) {
      console.error('Real-time price error:', error);
      return this.getFallbackRealTimePrice(symbol);
    }
  }

  // Alpha Vantage fallback for additional data
  async getAlphaVantageData(symbol, interval = 'daily') {
    if (!this.alphaVantageKey) {
      return { success: false, error: 'Alpha Vantage API key not configured' };
    }

    try {
      const response = await axios?.get('https://www.alphavantage.co/query', {
        params: {
          function: interval === 'daily' ? 'TIME_SERIES_DAILY' : 'TIME_SERIES_INTRADAY',
          symbol: symbol,
          interval: interval === 'daily' ? undefined : '5min',
          apikey: this.alphaVantageKey,
          outputsize: 'full'
        }
      });

      if (response?.data?.['Error Message']) {
        throw new Error(response?.data['Error Message']);
      }

      return {
        success: true,
        data: this.parseAlphaVantageData(response?.data)
      };
    } catch (error) {
      console.error('Alpha Vantage API Error:', error);
      return { success: false, error: error?.message };
    }
  }

  // Twitter sentiment data (mock implementation for demo)
  async getTwitterSentiment(symbol, count = 100) {
    try {
      // Mock Twitter data since actual Twitter API requires server-side implementation
      const mockTweets = this.generateMockTwitterData(symbol, count);
      
      return {
        success: true,
        data: {
          tweets: mockTweets,
          sentiment: {
            positive: mockTweets?.filter(t => t?.sentiment === 'positive')?.length,
            negative: mockTweets?.filter(t => t?.sentiment === 'negative')?.length,
            neutral: mockTweets?.filter(t => t?.sentiment === 'neutral')?.length,
            totalTweets: mockTweets?.length,
            sentimentScore: this.calculateSentimentScore(mockTweets)
          }
        }
      };
    } catch (error) {
      console.error('Twitter sentiment error:', error);
      return { success: false, error: error?.message };
    }
  }

  // Helper methods
  getPeriodStartDate(period) {
    const now = new Date();
    const periods = {
      '1w': 7 * 24 * 60 * 60 * 1000,
      '1m': 30 * 24 * 60 * 60 * 1000,
      '6m': 6 * 30 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000,
      '5y': 5 * 365 * 24 * 60 * 60 * 1000
    };
    
    return new Date(now.getTime() - (periods[period] || periods['1y']));
  }

  parseAlphaVantageData(data) {
    const timeSeriesKey = Object.keys(data)?.find(key => key?.includes('Time Series'));
    if (!timeSeriesKey) return [];

    const timeSeries = data?.[timeSeriesKey];
    return Object.entries(timeSeries)?.map(([date, values]) => ({
      date: new Date(date),
      open: parseFloat(values?.['1. open']),
      high: parseFloat(values?.['2. high']),
      low: parseFloat(values?.['3. low']),
      close: parseFloat(values?.['4. close']),
      volume: parseInt(values?.['5. volume'])
    }))?.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  generateMockTwitterData(symbol, count) {
    const sentiments = ['positive', 'negative', 'neutral'];
    const mockTweets = [];
    
    for (let i = 0; i < count; i++) {
      const sentiment = sentiments?.[Math.floor(Math.random() * sentiments?.length)];
      const confidence = Math.random() * 0.6 + 0.4; // 0.4-1.0
      
      mockTweets?.push({
        id: `mock_tweet_${i}`,
        text: this.generateMockTweetText(symbol, sentiment),
        sentiment: sentiment,
        confidence: confidence,
        author: `@user${i}`,
        createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        retweets: Math.floor(Math.random() * 100),
        likes: Math.floor(Math.random() * 500),
        replies: Math.floor(Math.random() * 50)
      });
    }
    
    return mockTweets?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  generateMockTweetText(symbol, sentiment) {
    const texts = {
      positive: [
        `$${symbol} is looking strong today! Great fundamentals 🚀`,
        `Bullish on $${symbol}. This stock has huge potential! 📈`,
        `$${symbol} just hit new highs! Love this momentum`,
        `Great earnings report from $${symbol}. Time to buy more!`,
        `$${symbol} is my top pick for 2024. Strong company fundamentals`
      ],
      negative: [
        `$${symbol} is overvalued. Time to sell before it drops further 📉`,
        `Not feeling good about $${symbol} recent performance`,
        `$${symbol} disappointing earnings. Expected much better`,
        `Bearish on $${symbol}. Too much risk in current market`,
        `$${symbol} facing headwinds. Would avoid for now`
      ],
      neutral: [
        `$${symbol} trading sideways today. Waiting for clear direction`,
        `Watching $${symbol} for a breakout. Could go either way`,
        `$${symbol} consolidating around these levels`,
        `Mixed signals on $${symbol}. Need to see more data`,
        `$${symbol} holding support. Let's see if it can push higher`
      ]
    };
    
    const sentimentTexts = texts?.[sentiment];
    return sentimentTexts?.[Math.floor(Math.random() * sentimentTexts?.length)];
  }

  calculateSentimentScore(tweets) {
    if (!tweets?.length) return 0;
    
    let totalScore = 0;
    tweets?.forEach(tweet => {
      const multiplier = tweet?.sentiment === 'positive' ? 1 : tweet?.sentiment === 'negative' ? -1 : 0;
      totalScore += multiplier * tweet?.confidence;
    });
    
    return totalScore / tweets?.length;
  }

  // Fallback data for when APIs are not available
  getFallbackStockData(symbol, period) {
    const mockData = this.generateMockStockData(symbol, period);
    return {
      success: true,
      data: mockData,
      isMockData: true
    };
  }

  getFallbackRealTimePrice(symbol) {
    const basePrice = Math.random() * 200 + 50; // $50-$250 range
    const change = (Math.random() - 0.5) * 10; // -$5 to +$5
    
    return {
      success: true,
      data: {
        symbol: symbol,
        price: basePrice,
        change: change,
        changePercent: (change / basePrice) * 100,
        dayHigh: basePrice + Math.random() * 5,
        dayLow: basePrice - Math.random() * 5,
        volume: Math.floor(Math.random() * 10000000),
        marketCap: Math.floor(basePrice * Math.random() * 1000000000),
        peRatio: Math.random() * 30 + 10
      },
      isMockData: true
    };
  }

  generateMockStockData(symbol, period) {
    const dataPoints = this.getDataPointsForPeriod(period);
    const startPrice = Math.random() * 100 + 50;
    const data = [];
    let currentPrice = startPrice;
    
    const startDate = this.getPeriodStartDate(period);
    
    for (let i = 0; i < dataPoints; i++) {
      const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
      const volatility = 0.02; // 2% daily volatility
      const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
      
      currentPrice = Math.max(currentPrice + change, 1); // Prevent negative prices
      
      const high = currentPrice * (1 + Math.random() * 0.01);
      const low = currentPrice * (1 - Math.random() * 0.01);
      const open = low + Math.random() * (high - low);
      const close = currentPrice;
      
      data?.push({
        date: date,
        open: parseFloat(open?.toFixed(2)),
        high: parseFloat(high?.toFixed(2)),
        low: parseFloat(low?.toFixed(2)),
        close: parseFloat(close?.toFixed(2)),
        volume: Math.floor(Math.random() * 10000000),
        adjClose: parseFloat(close?.toFixed(2))
      });
    }
    
    return data;
  }

  getDataPointsForPeriod(period) {
    const points = {
      '1w': 7,
      '1m': 30,
      '6m': 180,
      '1y': 365,
      '5y': 1825
    };
    return points?.[period] || 365;
  }
}

export default new StockAPIService();