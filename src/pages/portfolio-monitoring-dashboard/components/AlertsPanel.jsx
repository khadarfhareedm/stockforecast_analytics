import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');

  const mockAlerts = [
    {
      id: 1,
      type: 'price',
      severity: 'high',
      symbol: 'TSLA',
      title: 'Price Target Reached',
      message: 'TSLA has reached your target price of $250.00. Current price: $248.42',
      timestamp: new Date(Date.now() - 300000),
      isRead: false,
      action: 'Consider taking profits',
      change: 5.46
    },
    {
      id: 2,
      type: 'sentiment',
      severity: 'medium',
      symbol: 'NVDA',
      title: 'Sentiment Spike',
      message: 'NVDA sentiment increased by 15% in the last hour due to positive earnings news',
      timestamp: new Date(Date.now() - 600000),
      isRead: false,
      action: 'Monitor for momentum',
      change: 15.2
    },
    {
      id: 3,
      type: 'rebalance',
      severity: 'low',
      symbol: 'PORTFOLIO',
      title: 'Rebalancing Opportunity',
      message: 'Technology sector allocation has exceeded 65% threshold. Consider rebalancing.',
      timestamp: new Date(Date.now() - 900000),
      isRead: true,
      action: 'Review allocation',
      change: null
    },
    {
      id: 4,
      type: 'model',
      severity: 'high',
      symbol: 'GOOGL',
      title: 'Model Consensus Change',
      message: 'GOOGL consensus changed from HOLD to BUY with 84% confidence',
      timestamp: new Date(Date.now() - 1200000),
      isRead: false,
      action: 'Consider increasing position',
      change: null
    },
    {
      id: 5,
      type: 'risk',
      severity: 'medium',
      symbol: 'PORTFOLIO',
      title: 'Risk Threshold Exceeded',
      message: 'Portfolio beta increased to 1.34, exceeding your risk tolerance of 1.25',
      timestamp: new Date(Date.now() - 1800000),
      isRead: true,
      action: 'Reduce high-beta positions',
      change: 1.34
    },
    {
      id: 6,
      type: 'volume',
      severity: 'low',
      symbol: 'META',
      title: 'Unusual Volume',
      message: 'META trading volume is 3x above average. Current volume: 58.4M',
      timestamp: new Date(Date.now() - 2400000),
      isRead: false,
      action: 'Monitor for news',
      change: 3.2
    }
  ];

  useEffect(() => {
    setAlerts(mockAlerts);
  }, []);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'price': return 'TrendingUp';
      case 'sentiment': return 'MessageSquare';
      case 'rebalance': return 'Scale';
      case 'model': return 'Brain';
      case 'risk': return 'AlertTriangle';
      case 'volume': return 'BarChart3';
      default: return 'Bell';
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error bg-error/10 border-error/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return 'AlertCircle';
      case 'medium': return 'AlertTriangle';
      case 'low': return 'Info';
      default: return 'Bell';
    }
  };

  const filteredAlerts = alerts?.filter(alert => {
    switch (filter) {
      case 'unread':
        return !alert?.isRead;
      case 'high':
        return alert?.severity === 'high';
      case 'price':
        return alert?.type === 'price';
      case 'sentiment':
        return alert?.type === 'sentiment';
      default:
        return true;
    }
  });

  const markAsRead = (alertId) => {
    setAlerts(alerts?.map(alert => 
      alert?.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const dismissAlert = (alertId) => {
    setAlerts(alerts?.filter(alert => alert?.id !== alertId));
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const filters = [
    { value: 'all', label: 'All Alerts', count: alerts?.length },
    { value: 'unread', label: 'Unread', count: alerts?.filter(a => !a?.isRead)?.length },
    { value: 'high', label: 'High Priority', count: alerts?.filter(a => a?.severity === 'high')?.length },
    { value: 'price', label: 'Price Alerts', count: alerts?.filter(a => a?.type === 'price')?.length },
    { value: 'sentiment', label: 'Sentiment', count: alerts?.filter(a => a?.type === 'sentiment')?.length }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Portfolio Alerts</h3>
          <p className="text-sm text-muted-foreground">Real-time notifications and opportunities</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">{alerts?.filter(a => !a?.isRead)?.length} new</span>
          </div>
        </div>
      </div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters?.map((f) => (
          <button
            key={f?.value}
            onClick={() => setFilter(f?.value)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center space-x-2 ${
              filter === f?.value 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <span>{f?.label}</span>
            {f?.count > 0 && (
              <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                filter === f?.value 
                  ? 'bg-primary-foreground/20 text-primary-foreground' 
                  : 'bg-background text-foreground'
              }`}>
                {f?.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {/* Alerts list */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredAlerts?.map((alert) => (
          <div
            key={alert?.id}
            className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-sm ${
              alert?.isRead ? 'opacity-70' : ''
            } ${getAlertColor(alert?.severity)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start space-x-3">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={getSeverityIcon(alert?.severity)} 
                    size={16} 
                    color={`var(--color-${alert?.severity === 'high' ? 'error' : alert?.severity === 'medium' ? 'warning' : 'success'})`}
                  />
                  <Icon 
                    name={getAlertIcon(alert?.type)} 
                    size={14} 
                    color="var(--color-muted-foreground)"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-foreground">{alert?.title}</span>
                    {alert?.symbol !== 'PORTFOLIO' && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-background/50 rounded">
                        {alert?.symbol}
                      </span>
                    )}
                    {!alert?.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-foreground/80 mb-2">{alert?.message}</p>
                  {alert?.action && (
                    <div className="flex items-center space-x-2">
                      <Icon name="Lightbulb" size={12} color="var(--color-muted-foreground)" />
                      <span className="text-xs text-muted-foreground font-medium">{alert?.action}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {getTimeAgo(alert?.timestamp)}
                </span>
                <div className="flex items-center space-x-1">
                  {!alert?.isRead && (
                    <button
                      onClick={() => markAsRead(alert?.id)}
                      className="p-1 text-muted-foreground hover:text-primary transition-colors"
                      title="Mark as read"
                    >
                      <Icon name="Check" size={12} />
                    </button>
                  )}
                  <button
                    onClick={() => dismissAlert(alert?.id)}
                    className="p-1 text-muted-foreground hover:text-error transition-colors"
                    title="Dismiss"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              </div>
            </div>

            {alert?.change !== null && (
              <div className="flex items-center justify-between text-xs pt-2 border-t border-current/10">
                <span className="text-muted-foreground">Change:</span>
                <span className={`font-medium ${
                  alert?.change > 0 ? 'text-success' : alert?.change < 0 ? 'text-error' : 'text-foreground'
                }`}>
                  {alert?.type === 'risk' ? alert?.change : 
                   alert?.change > 0 ? `+${alert?.change}%` : `${alert?.change}%`}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      {filteredAlerts?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Bell" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No alerts match the current filter</p>
          <p className="text-sm text-muted-foreground">Your portfolio is running smoothly</p>
        </div>
      )}
      {/* Alert settings */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
              <Icon name="Settings" size={16} />
              <span>Alert Settings</span>
            </button>
            <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
              <Icon name="Bell" size={16} />
              <span>Notification Preferences</span>
            </button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>Auto-refresh: 30s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;