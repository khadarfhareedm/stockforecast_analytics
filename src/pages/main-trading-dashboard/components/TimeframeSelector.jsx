import React from 'react';
import Button from '../../../components/ui/Button';
import { useAnalyticalContext } from '../../../components/ui/ContextPreserver';

const TimeframeSelector = ({ className = '' }) => {
  const { timeframe, updateTimeframe } = useAnalyticalContext();

  const timeframes = [
    { value: '1D', label: '1D', description: '1 Day' },
    { value: '7D', label: '7D', description: '7 Days' },
    { value: '1M', label: '1M', description: '1 Month' },
    { value: '3M', label: '3M', description: '3 Months' },
    { value: '6M', label: '6M', description: '6 Months' },
    { value: '1Y', label: '1Y', description: '1 Year' }
  ];

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {timeframes?.map(tf => (
        <Button
          key={tf?.value}
          variant={timeframe === tf?.value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => updateTimeframe(tf?.value)}
          className="px-3 py-1.5 text-sm font-medium"
          title={tf?.description}
        >
          {tf?.label}
        </Button>
      ))}
    </div>
  );
};

export default TimeframeSelector;