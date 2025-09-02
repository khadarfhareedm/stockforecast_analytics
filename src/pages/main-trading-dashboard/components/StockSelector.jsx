import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import { useAnalyticalContext } from '../../../components/ui/ContextPreserver';

const StockSelector = ({ className = '' }) => {
  const { selectedStocks, updateSelectedStocks } = useAnalyticalContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const availableStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary' },
    { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary' },
    { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial Services' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
    { symbol: 'V', name: 'Visa Inc.', sector: 'Financial Services' },
    { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Staples' },
    { symbol: 'UNH', name: 'UnitedHealth Group Inc.', sector: 'Healthcare' },
    { symbol: 'HD', name: 'Home Depot Inc.', sector: 'Consumer Discretionary' },
    { symbol: 'MA', name: 'Mastercard Inc.', sector: 'Financial Services' },
    { symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Financial Services' }
  ];

  const filteredStocks = availableStocks?.filter(stock =>
    stock?.symbol?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    stock?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const handleStockToggle = (symbol) => {
    if (selectedStocks?.includes(symbol)) {
      updateSelectedStocks(selectedStocks?.filter(s => s !== symbol));
    } else if (selectedStocks?.length < 5) {
      updateSelectedStocks([...selectedStocks, symbol]);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Search" size={20} color="var(--color-muted-foreground)" />
          <span className="text-sm font-medium text-foreground">Selected Stocks:</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <span className="text-sm text-foreground">
            {selectedStocks?.length} of 5 selected
          </span>
          <Icon 
            name={isOpen ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            color="var(--color-muted-foreground)" 
          />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {selectedStocks?.map(symbol => {
          const stock = availableStocks?.find(s => s?.symbol === symbol);
          return (
            <div
              key={symbol}
              className="flex items-center space-x-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg"
            >
              <span className="text-sm font-medium text-primary">{symbol}</span>
              <button
                onClick={() => handleStockToggle(symbol)}
                className="text-primary hover:text-primary/70 transition-colors"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          );
        })}
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-elevation-3 z-50 max-h-80 overflow-hidden">
          <div className="p-3 border-b border-border">
            <Input
              type="search"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full"
            />
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {filteredStocks?.map(stock => {
              const isSelected = selectedStocks?.includes(stock?.symbol);
              const canSelect = selectedStocks?.length < 5 || isSelected;
              
              return (
                <button
                  key={stock?.symbol}
                  onClick={() => canSelect && handleStockToggle(stock?.symbol)}
                  disabled={!canSelect}
                  className={`
                    w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0
                    ${isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : ''}
                    ${!canSelect ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-foreground">{stock?.symbol}</span>
                        {isSelected && (
                          <Icon name="Check" size={16} color="var(--color-primary)" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{stock?.name}</p>
                      <p className="text-xs text-muted-foreground">{stock?.sector}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="p-3 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground text-center">
              Select up to 5 stocks for analysis
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockSelector;