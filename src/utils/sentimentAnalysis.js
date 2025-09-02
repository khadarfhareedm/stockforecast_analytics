import Sentiment from 'sentiment';

class SentimentAnalysisService {
  constructor() {
    this.sentiment = new Sentiment();
    this.customTerms = {
      // Stock-specific positive terms
      'bullish': 5,
      'moon': 5,
      'rocket': 4,
      'diamond hands': 5,
      'hodl': 3,
      'buy the dip': 4,
      'strong buy': 5,
      'outperform': 4,
      'beat expectations': 5,
      'revenue growth': 4,
      'profit margin': 3,
      'market leader': 4,
      'innovation': 3,
      'breakthrough': 4,
      'partnership': 3,
      'expansion': 3,
      'acquisition': 3,
      
      // Stock-specific negative terms
      'bearish': -5,
      'crash': -5,
      'dump': -4,
      'paper hands': -3,
      'sell off': -4,
      'overvalued': -4,
      'bubble': -5,
      'recession': -5,
      'bear market': -5,
      'downturn': -4,
      'loss': -3,
      'decline': -3,
      'disappointed': -4,
      'miss expectations': -5,
      'lawsuit': -4,
      'investigation': -4,
      'bankruptcy': -5,
      'debt': -3,
      'volatility': -2
    };

    // Register custom terms
    this.sentiment?.registerLanguage('en', this.customTerms);
  }

  // Analyze single text for sentiment
  analyzeSentiment(text) {
    if (!text || typeof text !== 'string') {
      return {
        sentiment: 'neutral',
        score: 0,
        confidence: 0,
        words: []
      };
    }

    const result = this.sentiment?.analyze(text);
    const normalizedScore = this.normalizeScore(result?.score);
    
    return {
      sentiment: this.classifySentiment(normalizedScore),
      score: normalizedScore,
      confidence: this.calculateConfidence(result?.score, text?.split(' ')?.length),
      comparative: result?.comparative,
      words: result?.words,
      positive: result?.positive,
      negative: result?.negative,
      tokens: result?.tokens
    };
  }

  // Analyze multiple texts (tweets, news articles, etc.)
  analyzeMultipleTexts(texts) {
    if (!Array.isArray(texts) || texts?.length === 0) {
      return {
        overall: { sentiment: 'neutral', score: 0, confidence: 0 },
        individual: [],
        distribution: { positive: 0, negative: 0, neutral: 0 }
      };
    }

    const individual = texts?.map(text => this.analyzeSentiment(text));
    const overallScore = individual?.reduce((sum, item) => sum + item?.score, 0) / individual?.length;
    
    const distribution = {
      positive: individual?.filter(item => item?.sentiment === 'positive')?.length,
      negative: individual?.filter(item => item?.sentiment === 'negative')?.length,
      neutral: individual?.filter(item => item?.sentiment === 'neutral')?.length
    };

    return {
      overall: {
        sentiment: this.classifySentiment(overallScore),
        score: overallScore,
        confidence: this.calculateAverageConfidence(individual),
        totalTexts: texts?.length
      },
      individual: individual,
      distribution: distribution,
      percentages: {
        positive: (distribution?.positive / texts?.length) * 100,
        negative: (distribution?.negative / texts?.length) * 100,
        neutral: (distribution?.neutral / texts?.length) * 100
      }
    };
  }

  // Analyze sentiment over time (for time series analysis)
  analyzeSentimentOverTime(timeSeriesData) {
    if (!Array.isArray(timeSeriesData) || timeSeriesData?.length === 0) {
      return [];
    }

    return timeSeriesData?.map(dataPoint => {
      const { date, texts } = dataPoint;
      const analysis = this.analyzeMultipleTexts(texts);
      
      return {
        date: date,
        ...analysis?.overall,
        distribution: analysis?.distribution,
        percentages: analysis?.percentages,
        sampleSize: texts?.length
      };
    });
  }

  // Get sentiment trends and patterns
  getSentimentTrends(sentimentData, period = 7) {
    if (!Array.isArray(sentimentData) || sentimentData?.length < period) {
      return null;
    }

    const recentData = sentimentData?.slice(-period);
    const averageScore = recentData?.reduce((sum, item) => sum + item?.score, 0) / recentData?.length;
    const trend = this.calculateTrend(recentData?.map(item => item?.score));
    
    return {
      period: period,
      averageScore: averageScore,
      sentiment: this.classifySentiment(averageScore),
      trend: trend, // 'improving', 'declining', 'stable'
      volatility: this.calculateVolatility(recentData?.map(item => item?.score)),
      consistency: this.calculateConsistency(recentData?.map(item => item?.sentiment))
    };
  }

  // Correlate sentiment with stock price movements
  correlateSentimentWithPrice(sentimentData, priceData) {
    if (!Array.isArray(sentimentData) || !Array.isArray(priceData) || 
        sentimentData?.length === 0 || priceData?.length === 0) {
      return null;
    }

    // Align data by date
    const alignedData = this.alignDataByDate(sentimentData, priceData);
    
    if (alignedData?.length < 2) {
      return null;
    }

    const sentimentScores = alignedData?.map(item => item?.sentimentScore);
    const priceChanges = alignedData?.map(item => item?.priceChange);
    
    const correlation = this.calculateCorrelation(sentimentScores, priceChanges);
    
    return {
      correlation: correlation,
      strength: this.interpretCorrelationStrength(correlation),
      alignedDataPoints: alignedData?.length,
      predictivePower: Math.abs(correlation) > 0.3 ? 'moderate' : 'weak'
    };
  }

  // Helper methods
  normalizeScore(score) {
    // Normalize score to -1 to 1 range
    return Math.max(-1, Math.min(1, score / 5));
  }

  classifySentiment(score) {
    if (score > 0.1) return 'positive';
    if (score < -0.1) return 'negative';
    return 'neutral';
  }

  calculateConfidence(score, wordCount) {
    // Confidence based on score magnitude and text length
    const scoreMagnitude = Math.abs(score);
    const lengthFactor = Math.min(wordCount / 10, 1); // Max factor of 1 for 10+ words
    return Math.min(scoreMagnitude * lengthFactor, 1);
  }

  calculateAverageConfidence(analyses) {
    if (!analyses?.length) return 0;
    return analyses?.reduce((sum, item) => sum + item?.confidence, 0) / analyses?.length;
  }

  calculateTrend(scores) {
    if (scores?.length < 2) return 'stable';
    
    const firstHalf = scores?.slice(0, Math.floor(scores?.length / 2));
    const secondHalf = scores?.slice(Math.floor(scores?.length / 2));
    
    const firstAvg = firstHalf?.reduce((sum, score) => sum + score, 0) / firstHalf?.length;
    const secondAvg = secondHalf?.reduce((sum, score) => sum + score, 0) / secondHalf?.length;
    
    const difference = secondAvg - firstAvg;
    
    if (difference > 0.1) return 'improving';
    if (difference < -0.1) return 'declining';
    return 'stable';
  }

  calculateVolatility(scores) {
    if (scores?.length < 2) return 0;
    
    const mean = scores?.reduce((sum, score) => sum + score, 0) / scores?.length;
    const variance = scores?.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores?.length;
    return Math.sqrt(variance);
  }

  calculateConsistency(sentiments) {
    if (sentiments?.length === 0) return 0;
    
    const counts = sentiments?.reduce((acc, sentiment) => {
      acc[sentiment] = (acc?.[sentiment] || 0) + 1;
      return acc;
    }, {});
    
    const maxCount = Math.max(...Object.values(counts));
    return maxCount / sentiments?.length;
  }

  alignDataByDate(sentimentData, priceData) {
    const aligned = [];
    
    sentimentData?.forEach(sentimentItem => {
      const matchingPriceItem = priceData?.find(priceItem => 
        this.isSameDay(new Date(sentimentItem.date), new Date(priceItem.date))
      );
      
      if (matchingPriceItem) {
        aligned?.push({
          date: sentimentItem?.date,
          sentimentScore: sentimentItem?.score,
          priceChange: matchingPriceItem?.changePercent || 0
        });
      }
    });
    
    return aligned;
  }

  isSameDay(date1, date2) {
    return date1?.toDateString() === date2?.toDateString();
  }

  calculateCorrelation(x, y) {
    if (x?.length !== y?.length || x?.length === 0) return 0;
    
    const n = x?.length;
    const sumX = x?.reduce((sum, val) => sum + val, 0);
    const sumY = y?.reduce((sum, val) => sum + val, 0);
    const sumXY = x?.reduce((sum, val, i) => sum + (val * y?.[i]), 0);
    const sumXSquare = x?.reduce((sum, val) => sum + (val * val), 0);
    const sumYSquare = y?.reduce((sum, val) => sum + (val * val), 0);
    
    const numerator = (n * sumXY) - (sumX * sumY);
    const denominator = Math.sqrt(((n * sumXSquare) - (sumX * sumX)) * ((n * sumYSquare) - (sumY * sumY)));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  interpretCorrelationStrength(correlation) {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return 'strong';
    if (abs >= 0.3) return 'moderate';
    if (abs >= 0.1) return 'weak';
    return 'negligible';
  }

  // Generate sentiment report
  generateSentimentReport(symbol, sentimentData, priceData) {
    const multipleAnalysis = this.analyzeMultipleTexts(
      sentimentData?.map(item => item?.text || '')
    );
    
    const trends = this.getSentimentTrends(
      sentimentData?.map(item => ({ ...item, score: this.analyzeSentiment(item?.text)?.score }))
    );
    
    const correlation = this.correlateSentimentWithPrice(
      sentimentData?.map(item => ({ 
        date: item?.date, 
        score: this.analyzeSentiment(item?.text)?.score 
      })),
      priceData
    );

    return {
      symbol: symbol,
      generatedAt: new Date(),
      overall: multipleAnalysis?.overall,
      distribution: multipleAnalysis?.distribution,
      percentages: multipleAnalysis?.percentages,
      trends: trends,
      correlation: correlation,
      summary: this.generateSummary(multipleAnalysis, trends, correlation)
    };
  }

  generateSummary(analysis, trends, correlation) {
    const sentiment = analysis?.overall?.sentiment;
    const confidence = analysis?.overall?.confidence;
    const trend = trends?.trend || 'stable';
    const correlationStrength = correlation?.strength || 'negligible';

    let summary = `Overall sentiment is ${sentiment}`;
    
    if (confidence > 0.7) {
      summary += ' with high confidence';
    } else if (confidence > 0.4) {
      summary += ' with moderate confidence';
    } else {
      summary += ' with low confidence';
    }

    summary += `. Sentiment trend is ${trend}`;
    
    if (correlation && correlationStrength !== 'negligible') {
      summary += ` with ${correlationStrength} correlation to price movements`;
    }

    summary += '.';

    return summary;
  }
}

export default new SentimentAnalysisService();