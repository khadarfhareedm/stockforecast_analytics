import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const NavigationHeader = ({ className = '' }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[1000] bg-background border-b border-border ${className}`}>
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/main-trading-dashboard" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Icon name="TrendingUp" size={20} color="white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-foreground">StockForecast</span>
              <span className="text-xs text-muted-foreground -mt-1">Analytics</span>
            </div>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Data Connection Status */}
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-success/10 rounded-lg">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-success font-medium">Live Data</span>
          </div>

          {/* Market Status */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-card rounded-lg">
            <Icon name="Clock" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm text-muted-foreground">Market Open</span>
          </div>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleUserMenu}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="var(--color-primary)" />
              </div>
              <span className="hidden md:block text-sm text-foreground">Analyst</span>
              <Icon name="ChevronDown" size={16} color="var(--color-muted-foreground)" />
            </Button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevation-3 py-2 z-[1100]">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium text-foreground">Trading Account</p>
                  <p className="text-xs text-muted-foreground">analyst@stockforecast.com</p>
                </div>
                <div className="py-1">
                  <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted/50 flex items-center space-x-2">
                    <Icon name="Settings" size={16} />
                    <span>Settings</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted/50 flex items-center space-x-2">
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted/50 flex items-center space-x-2">
                    <Icon name="Shield" size={16} />
                    <span>Admin Panel</span>
                  </button>
                  <div className="border-t border-border my-1"></div>
                  <button className="w-full px-4 py-2 text-left text-sm text-error hover:bg-error/10 flex items-center space-x-2">
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;