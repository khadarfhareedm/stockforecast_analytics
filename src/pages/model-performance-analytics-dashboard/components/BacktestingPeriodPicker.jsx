import React from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const BacktestingPeriodPicker = ({ selectedPeriod, onPeriodChange, className = '' }) => {
  const periodOptions = [
    { value: '1M', label: '1 Month', description: 'Last 30 days of trading data' },
    { value: '3M', label: '3 Months', description: 'Last 90 days of trading data' },
    { value: '6M', label: '6 Months', description: 'Last 180 days of trading data' },
    { value: '1Y', label: '1 Year', description: 'Last 365 days of trading data' },
    { value: '2Y', label: '2 Years', description: 'Last 730 days of trading data' },
    { value: '5Y', label: '5 Years', description: 'Last 1825 days of trading data' }
  ];

  return (
    <div className={`bg-card rounded-lg border border-border p-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Calendar" size={20} color="var(--color-primary)" />
        <h3 className="text-lg font-semibold text-foreground">Backtesting Period</h3>
      </div>
      
      <Select
        options={periodOptions}
        value={selectedPeriod}
        onChange={onPeriodChange}
        placeholder="Select backtesting period"
        className="w-full"
      />
      
      <div className="mt-3 p-3 bg-muted/20 rounded-lg">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Info" size={16} />
          <span>Longer periods provide more robust validation but require more computation time</span>
        </div>
      </div>
    </div>
  );
};

export default BacktestingPeriodPicker;