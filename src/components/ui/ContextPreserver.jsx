import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ContextPreserverContext = createContext();

const initialState = {
  selectedStocks: ['AAPL', 'GOOGL', 'MSFT'],
  timeframe: '1D',
  modelSettings: {
    selectedModel: 'LSTM',
    confidence: 0.85,
    lookbackPeriod: 30
  },
  portfolioSettings: {
    totalValue: 100000,
    riskTolerance: 'moderate',
    rebalanceFrequency: 'monthly'
  },
  sentimentSettings: {
    sources: ['twitter', 'reddit', 'news'],
    timeRange: '24h',
    sentiment_threshold: 0.6
  },
  dashboardLayout: {
    trading: { widgets: ['price-chart', 'predictions', 'alerts'] },
    models: { widgets: ['performance-metrics', 'backtesting', 'comparison'] },
    portfolio: { widgets: ['allocation', 'performance', 'risk-metrics'] },
    sentiment: { widgets: ['sentiment-chart', 'social-feed', 'correlation'] }
  },
  userPreferences: {
    theme: 'dark',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 5000
  }
};

const contextReducer = (state, action) => {
  switch (action?.type) {
    case 'UPDATE_SELECTED_STOCKS':
      return { ...state, selectedStocks: action?.payload };
    case 'UPDATE_TIMEFRAME':
      return { ...state, timeframe: action?.payload };
    case 'UPDATE_MODEL_SETTINGS':
      return { 
        ...state, 
        modelSettings: { ...state?.modelSettings, ...action?.payload } 
      };
    case 'UPDATE_PORTFOLIO_SETTINGS':
      return { 
        ...state, 
        portfolioSettings: { ...state?.portfolioSettings, ...action?.payload } 
      };
    case 'UPDATE_SENTIMENT_SETTINGS':
      return { 
        ...state, 
        sentimentSettings: { ...state?.sentimentSettings, ...action?.payload } 
      };
    case 'UPDATE_DASHBOARD_LAYOUT':
      return { 
        ...state, 
        dashboardLayout: { ...state?.dashboardLayout, ...action?.payload } 
      };
    case 'UPDATE_USER_PREFERENCES':
      return { 
        ...state, 
        userPreferences: { ...state?.userPreferences, ...action?.payload } 
      };
    case 'RESTORE_STATE':
      return { ...state, ...action?.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};

export const ContextPreserver = ({ children }) => {
  const [state, dispatch] = useReducer(contextReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('stockforecast-context');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'RESTORE_STATE', payload: parsedState });
      }
    } catch (error) {
      console.warn('Failed to restore context from localStorage:', error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('stockforecast-context', JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save context to localStorage:', error);
    }
  }, [state]);

  const contextValue = {
    state,
    dispatch,
    actions: {
      updateSelectedStocks: (stocks) => 
        dispatch({ type: 'UPDATE_SELECTED_STOCKS', payload: stocks }),
      updateTimeframe: (timeframe) => 
        dispatch({ type: 'UPDATE_TIMEFRAME', payload: timeframe }),
      updateModelSettings: (settings) => 
        dispatch({ type: 'UPDATE_MODEL_SETTINGS', payload: settings }),
      updatePortfolioSettings: (settings) => 
        dispatch({ type: 'UPDATE_PORTFOLIO_SETTINGS', payload: settings }),
      updateSentimentSettings: (settings) => 
        dispatch({ type: 'UPDATE_SENTIMENT_SETTINGS', payload: settings }),
      updateDashboardLayout: (layout) => 
        dispatch({ type: 'UPDATE_DASHBOARD_LAYOUT', payload: layout }),
      updateUserPreferences: (preferences) => 
        dispatch({ type: 'UPDATE_USER_PREFERENCES', payload: preferences }),
      resetState: () => 
        dispatch({ type: 'RESET_STATE' })
    }
  };

  return (
    <ContextPreserverContext.Provider value={contextValue}>
      {children}
    </ContextPreserverContext.Provider>
  );
};

export const useContextPreserver = () => {
  const context = useContext(ContextPreserverContext);
  if (!context) {
    throw new Error('useContextPreserver must be used within a ContextPreserver');
  }
  return context;
};

// Hook for specific context sections
export const useAnalyticalContext = () => {
  const { state, actions } = useContextPreserver();
  
  return {
    selectedStocks: state?.selectedStocks,
    timeframe: state?.timeframe,
    modelSettings: state?.modelSettings,
    portfolioSettings: state?.portfolioSettings,
    sentimentSettings: state?.sentimentSettings,
    updateSelectedStocks: actions?.updateSelectedStocks,
    updateTimeframe: actions?.updateTimeframe,
    updateModelSettings: actions?.updateModelSettings,
    updatePortfolioSettings: actions?.updatePortfolioSettings,
    updateSentimentSettings: actions?.updateSentimentSettings
  };
};

// Hook for dashboard layout management
export const useDashboardLayout = () => {
  const { state, actions } = useContextPreserver();
  
  return {
    dashboardLayout: state?.dashboardLayout,
    userPreferences: state?.userPreferences,
    updateDashboardLayout: actions?.updateDashboardLayout,
    updateUserPreferences: actions?.updateUserPreferences
  };
};

export default ContextPreserver;