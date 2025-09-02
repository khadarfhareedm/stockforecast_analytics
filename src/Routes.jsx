import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { ContextPreserver } from "./components/ui/ContextPreserver";
import NotFound from "pages/NotFound";
import MainTradingDashboard from './pages/main-trading-dashboard';
import SentimentAnalysisDashboard from './pages/sentiment-analysis-dashboard';
import ModelPerformanceAnalyticsDashboard from './pages/model-performance-analytics-dashboard';
import PortfolioMonitoringDashboard from './pages/portfolio-monitoring-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ContextPreserver>
          <ScrollToTop />
          <RouterRoutes>
            {/* Define your route here */}
            <Route path="/" element={<MainTradingDashboard />} />
            <Route path="/main-trading-dashboard" element={<MainTradingDashboard />} />
            <Route path="/sentiment-analysis-dashboard" element={<SentimentAnalysisDashboard />} />
            <Route path="/model-performance-analytics-dashboard" element={<ModelPerformanceAnalyticsDashboard />} />
            <Route path="/portfolio-monitoring-dashboard" element={<PortfolioMonitoringDashboard />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ContextPreserver>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;