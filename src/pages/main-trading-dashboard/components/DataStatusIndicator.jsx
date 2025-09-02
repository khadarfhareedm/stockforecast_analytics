import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const DataStatusIndicator = ({ className = '' }) => {
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate occasional connection issues
      const random = Math.random();
      if (random > 0.95) {
        setConnectionStatus('reconnecting');
        setTimeout(() => setConnectionStatus('connected'), 2000);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          color: 'var(--color-success)',
          bgColor: 'bg-success/10',
          icon: 'Wifi',
          text: 'Live Data',
          pulse: true
        };
      case 'reconnecting':
        return {
          color: 'var(--color-warning)',
          bgColor: 'bg-warning/10',
          icon: 'WifiOff',
          text: 'Reconnecting',
          pulse: false
        };
      default:
        return {
          color: 'var(--color-error)',
          bgColor: 'bg-error/10',
          icon: 'AlertCircle',
          text: 'Disconnected',
          pulse: false
        };
    }
  };

  const status = getStatusConfig();
  const timeAgo = Math.floor((new Date() - lastUpdate) / 1000);

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${status?.bgColor}`}>
        <div className="relative">
          <Icon name={status?.icon} size={16} color={status?.color} />
          {status?.pulse && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse"></div>
          )}
        </div>
        <span className="text-sm font-medium" style={{ color: status?.color }}>
          {status?.text}
        </span>
      </div>
      <div className="flex items-center space-x-2 text-muted-foreground">
        <Icon name="Clock" size={14} />
        <span className="text-xs">
          Updated {timeAgo < 60 ? `${timeAgo}s` : `${Math.floor(timeAgo / 60)}m`} ago
        </span>
      </div>
      <div className="flex items-center space-x-2 text-muted-foreground">
        <Icon name="Database" size={14} />
        <span className="text-xs">Yahoo Finance API</span>
      </div>
    </div>
  );
};

export default DataStatusIndicator;