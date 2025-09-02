import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const TabNavigation = ({ className = '' }) => {
  const location = useLocation();

  const navigationItems = [
    {
      id: 'trading',
      label: 'Trading',
      path: '/main-trading-dashboard',
      icon: 'TrendingUp',
      tooltip: 'Real-time analysis and AI forecasting'
    },
    {
      id: 'models',
      label: 'Models',
      path: '/model-performance-analytics-dashboard',
      icon: 'BarChart3',
      tooltip: 'ML model performance validation and backtesting'
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      path: '/portfolio-monitoring-dashboard',
      icon: 'PieChart',
      tooltip: 'Multi-stock tracking and risk assessment'
    },
    {
      id: 'sentiment',
      label: 'Sentiment',
      path: '/sentiment-analysis-dashboard',
      icon: 'MessageSquare',
      tooltip: 'Social media intelligence and sentiment analysis'
    }
  ];

  const isActive = (path) => {
    return location?.pathname === path;
  };

  return (
    <nav className={`sticky top-16 z-[900] bg-background border-b border-border ${className}`}>
      <div className="px-6">
        <div className="flex space-x-8">
          {navigationItems?.map((item) => (
            <Link
              key={item?.id}
              to={item?.path}
              className={`
                relative flex items-center space-x-2 px-4 py-4 text-sm font-medium transition-all duration-200 ease-smooth
                hover:text-primary group
                ${isActive(item?.path) 
                  ? 'text-primary border-b-2 border-primary' :'text-muted-foreground border-b-2 border-transparent'
                }
              `}
              title={item?.tooltip}
            >
              <Icon 
                name={item?.icon} 
                size={18} 
                color={isActive(item?.path) ? 'var(--color-primary)' : 'currentColor'}
                className="transition-colors duration-200"
              />
              <span className="hidden sm:block">{item?.label}</span>
              
              {/* Active indicator */}
              {isActive(item?.path) && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
              )}
              
              {/* Hover tooltip for mobile */}
              <div className="sm:hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {item?.tooltip}
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[900] bg-background border-t border-border">
        <div className="flex">
          {navigationItems?.map((item) => (
            <Link
              key={`mobile-${item?.id}`}
              to={item?.path}
              className={`
                flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-all duration-200
                ${isActive(item?.path) 
                  ? 'text-primary bg-primary/5' :'text-muted-foreground'
                }
              `}
            >
              <Icon 
                name={item?.icon} 
                size={20} 
                color={isActive(item?.path) ? 'var(--color-primary)' : 'currentColor'}
                className="mb-1"
              />
              <span className="truncate">{item?.label}</span>
              
              {/* Active indicator for mobile */}
              {isActive(item?.path) && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default TabNavigation;