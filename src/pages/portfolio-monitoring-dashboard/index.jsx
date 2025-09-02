import React, { useState, useEffect } from 'react';
import NavigationHeader from '../../components/ui/NavigationHeader';
import TabNavigation from '../../components/ui/TabNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import PortfolioMetrics from './components/PortfolioMetrics';
import PortfolioComposition from './components/PortfolioComposition';
import CorrelationMatrix from './components/CorrelationMatrix';
import WatchlistPanel from './components/WatchlistPanel';
import RiskReturnScatter from './components/RiskReturnScatter';
import HoldingsTable from './components/HoldingsTable';
import AlertsPanel from './components/AlertsPanel';

const PortfolioMonitoringDashboard = () => {
  const [selectedPortfolio, setSelectedPortfolio] = useState('main');
  const [rebalancingAlerts, setRebalancingAlerts] = useState(true);
  const [riskThreshold, setRiskThreshold] = useState('moderate');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const portfolioOptions = [
    { value: 'main', label: 'Main Portfolio ($2.85M)' },
    { value: 'growth', label: 'Growth Portfolio ($1.24M)' },
    { value: 'dividend', label: 'Dividend Portfolio ($890K)' },
    { value: 'speculative', label: 'Speculative Portfolio ($340K)' }
  ];

  const riskThresholdOptions = [
    { value: 'conservative', label: 'Conservative (β < 0.8)' },
    { value: 'moderate', label: 'Moderate (β < 1.2)' },
    { value: 'aggressive', label: 'Aggressive (β < 1.8)' },
    { value: 'custom', label: 'Custom Threshold' }
  ];

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <TabNavigation />
      <div className="pt-32 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Global Controls */}
          <div className="mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="flex items-center space-x-3">
                    <Icon name="PieChart" size={24} color="var(--color-primary)" />
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">Portfolio Monitor</h1>
                      <p className="text-sm text-muted-foreground">Multi-stock tracking & risk assessment</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Select
                      options={portfolioOptions}
                      value={selectedPortfolio}
                      onChange={setSelectedPortfolio}
                      className="min-w-48"
                    />
                    
                    <Select
                      options={riskThresholdOptions}
                      value={riskThreshold}
                      onChange={setRiskThreshold}
                      className="min-w-44"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setRebalancingAlerts(!rebalancingAlerts)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                        rebalancingAlerts 
                          ? 'bg-success/10 text-success border border-success/20' :'bg-muted text-muted-foreground border border-border'
                      }`}
                    >
                      <Icon name={rebalancingAlerts ? 'Bell' : 'BellOff'} size={16} />
                      <span>Rebalancing Alerts</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span>Live Data</span>
                  </div>

                  <Button
                    variant="outline"
                    iconName="RefreshCw"
                    iconPosition="left"
                    onClick={() => setLastUpdate(new Date())}
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Metrics */}
          <PortfolioMetrics />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-16 gap-6 mb-8">
            {/* Portfolio Composition - 12 columns */}
            <div className="xl:col-span-12">
              <PortfolioComposition />
            </div>

            {/* Watchlist Panel - 4 columns */}
            <div className="xl:col-span-4">
              <WatchlistPanel />
            </div>
          </div>

          {/* Correlation Matrix */}
          <div className="mb-8">
            <CorrelationMatrix />
          </div>

          {/* Risk-Return Analysis */}
          <div className="mb-8">
            <RiskReturnScatter />
          </div>

          {/* Holdings Table and Alerts */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Holdings Table - 2 columns */}
            <div className="xl:col-span-2">
              <HoldingsTable />
            </div>

            {/* Alerts Panel - 1 column */}
            <div className="xl:col-span-1">
              <AlertsPanel />
            </div>
          </div>

          {/* Footer Status */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Icon name="Database" size={16} />
                  <span>Data Source: Yahoo Finance, Alpha Vantage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={16} />
                  <span>Risk Model: Monte Carlo Simulation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="TrendingUp" size={16} />
                  <span>ML Models: LSTM, GRU, CNN-LSTM</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Last updated: {lastUpdate?.toLocaleTimeString()}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioMonitoringDashboard;