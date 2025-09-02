import React from 'react';
import { cn } from '../../utils/cn';
import Button from './Button';

const TimeframeSelector = ({ 
  selectedTimeframe, 
  onTimeframeChange, 
  className = "",
  options = [
    { value: '1w', label: '1W', fullLabel: '1 Week' },
    { value: '1m', label: '1M', fullLabel: '1 Month' },
    { value: '6m', label: '6M', fullLabel: '6 Months' },
    { value: '1y', label: '1Y', fullLabel: '1 Year' },
    { value: '5y', label: '5Y', fullLabel: '5 Years' }
  ]
}) => {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {options?.map((option) => (
        <Button
          key={option?.value}
          variant={selectedTimeframe === option?.value ? "default" : "outline"}
          size="sm"
          onClick={() => onTimeframeChange?.(option?.value)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium transition-all duration-200",
            selectedTimeframe === option?.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
          title={option?.fullLabel}
        >
          {option?.label}
        </Button>
      ))}
    </div>
  );
};

export default TimeframeSelector;