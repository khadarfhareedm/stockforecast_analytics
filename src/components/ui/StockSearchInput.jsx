import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

import Icon from '../AppIcon';

const StockSearchInput = ({ 
  onStockSelect, 
  selectedStock, 
  placeholder = "Search 100+ stocks...",
  className = "" 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Extended stock database with 100+ stocks
  const stockDatabase = [
    // Tech Giants
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', price: 175.23 },
    { symbol: 'GOOGL', name: 'Alphabet Inc. Class A', sector: 'Technology', price: 142.56 },
    { symbol: 'GOOG', name: 'Alphabet Inc. Class C', sector: 'Technology', price: 141.89 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', price: 378.45 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', price: 145.67 },
    { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary', price: 234.89 },
    { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', price: 312.45 },
    { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services', price: 487.23 },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', price: 789.12 },
    { symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology', price: 156.78 },
    
    // Financial Services
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial Services', price: 167.89 },
    { symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Financial Services', price: 34.56 },
    { symbol: 'WFC', name: 'Wells Fargo & Company', sector: 'Financial Services', price: 45.67 },
    { symbol: 'GS', name: 'Goldman Sachs Group Inc.', sector: 'Financial Services', price: 378.90 },
    { symbol: 'MS', name: 'Morgan Stanley', sector: 'Financial Services', price: 89.45 },
    { symbol: 'V', name: 'Visa Inc.', sector: 'Financial Services', price: 245.67 },
    { symbol: 'MA', name: 'Mastercard Inc.', sector: 'Financial Services', price: 398.12 },
    { symbol: 'AXP', name: 'American Express Company', sector: 'Financial Services', price: 167.34 },
    { symbol: 'C', name: 'Citigroup Inc.', sector: 'Financial Services', price: 56.78 },
    { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc. Class B', sector: 'Financial Services', price: 345.67 },
    
    // Healthcare & Pharma
    { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', price: 167.89 },
    { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', price: 43.21 },
    { symbol: 'ABBV', name: 'AbbVie Inc.', sector: 'Healthcare', price: 145.67 },
    { symbol: 'MRK', name: 'Merck & Co. Inc.', sector: 'Healthcare', price: 109.45 },
    { symbol: 'UNH', name: 'UnitedHealth Group Inc.', sector: 'Healthcare', price: 523.78 },
    { symbol: 'LLY', name: 'Eli Lilly and Company', sector: 'Healthcare', price: 567.89 },
    { symbol: 'BMY', name: 'Bristol-Myers Squibb Co.', sector: 'Healthcare', price: 67.45 },
    { symbol: 'AMGN', name: 'Amgen Inc.', sector: 'Healthcare', price: 289.12 },
    { symbol: 'GILD', name: 'Gilead Sciences Inc.', sector: 'Healthcare', price: 78.34 },
    { symbol: 'CVS', name: 'CVS Health Corporation', sector: 'Healthcare', price: 89.56 },
    
    // Energy
    { symbol: 'XOM', name: 'Exxon Mobil Corporation', sector: 'Energy', price: 123.45 },
    { symbol: 'CVX', name: 'Chevron Corporation', sector: 'Energy', price: 156.78 },
    { symbol: 'COP', name: 'ConocoPhillips', sector: 'Energy', price: 98.34 },
    { symbol: 'SLB', name: 'Schlumberger NV', sector: 'Energy', price: 56.78 },
    { symbol: 'EOG', name: 'EOG Resources Inc.', sector: 'Energy', price: 134.56 },
    { symbol: 'PSX', name: 'Phillips 66', sector: 'Energy', price: 123.89 },
    { symbol: 'VLO', name: 'Valero Energy Corporation', sector: 'Energy', price: 145.67 },
    { symbol: 'MPC', name: 'Marathon Petroleum Corp.', sector: 'Energy', price: 167.89 },
    
    // Industrial
    { symbol: 'BA', name: 'Boeing Company', sector: 'Industrial', price: 234.56 },
    { symbol: 'CAT', name: 'Caterpillar Inc.', sector: 'Industrial', price: 267.89 },
    { symbol: 'GE', name: 'General Electric Company', sector: 'Industrial', price: 123.45 },
    { symbol: 'MMM', name: '3M Company', sector: 'Industrial', price: 145.67 },
    { symbol: 'HON', name: 'Honeywell International Inc.', sector: 'Industrial', price: 198.34 },
    { symbol: 'UPS', name: 'United Parcel Service Inc.', sector: 'Industrial', price: 189.45 },
    { symbol: 'RTX', name: 'Raytheon Technologies Corp.', sector: 'Industrial', price: 98.67 },
    { symbol: 'LMT', name: 'Lockheed Martin Corporation', sector: 'Industrial', price: 456.78 },
    
    // Consumer Goods
    { symbol: 'KO', name: 'Coca-Cola Company', sector: 'Consumer Staples', price: 62.34 },
    { symbol: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer Staples', price: 167.89 },
    { symbol: 'PG', name: 'Procter & Gamble Company', sector: 'Consumer Staples', price: 145.67 },
    { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Staples', price: 167.45 },
    { symbol: 'HD', name: 'Home Depot Inc.', sector: 'Consumer Discretionary', price: 345.67 },
    { symbol: 'MCD', name: 'McDonald\'s Corporation', sector: 'Consumer Discretionary', price: 289.45 },
    { symbol: 'DIS', name: 'Walt Disney Company', sector: 'Communication Services', price: 123.78 },
    { symbol: 'NKE', name: 'Nike Inc.', sector: 'Consumer Discretionary', price: 134.56 },
    { symbol: 'SBUX', name: 'Starbucks Corporation', sector: 'Consumer Discretionary', price: 98.45 },
    
    // Telecommunications
    { symbol: 'VZ', name: 'Verizon Communications Inc.', sector: 'Communication Services', price: 43.21 },
    { symbol: 'T', name: 'AT&T Inc.', sector: 'Communication Services', price: 18.45 },
    { symbol: 'TMUS', name: 'T-Mobile US Inc.', sector: 'Communication Services', price: 167.89 },
    { symbol: 'CMCSA', name: 'Comcast Corporation', sector: 'Communication Services', price: 45.67 },
    
    // Retail & E-commerce
    { symbol: 'TGT', name: 'Target Corporation', sector: 'Consumer Discretionary', price: 156.78 },
    { symbol: 'COST', name: 'Costco Wholesale Corporation', sector: 'Consumer Staples', price: 678.90 },
    { symbol: 'LOW', name: 'Lowe\'s Companies Inc.', sector: 'Consumer Discretionary', price: 234.56 },
    { symbol: 'TJX', name: 'TJX Companies Inc.', sector: 'Consumer Discretionary', price: 98.45 },
    
    // Software & Cloud
    { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', price: 234.56 },
    { symbol: 'ORCL', name: 'Oracle Corporation', sector: 'Technology', price: 123.45 },
    { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', price: 567.89 },
    { symbol: 'INTC', name: 'Intel Corporation', sector: 'Technology', price: 45.67 },
    { symbol: 'IBM', name: 'International Business Machines', sector: 'Technology', price: 167.89 },
    { symbol: 'CSCO', name: 'Cisco Systems Inc.', sector: 'Technology', price: 56.78 },
    
    // Semiconductors
    { symbol: 'TSM', name: 'Taiwan Semiconductor Mfg.', sector: 'Technology', price: 123.45 },
    { symbol: 'QCOM', name: 'QUALCOMM Incorporated', sector: 'Technology', price: 156.78 },
    { symbol: 'AVGO', name: 'Broadcom Inc.', sector: 'Technology', price: 890.12 },
    { symbol: 'TXN', name: 'Texas Instruments Inc.', sector: 'Technology', price: 178.45 },
    
    // Biotech
    { symbol: 'BIIB', name: 'Biogen Inc.', sector: 'Healthcare', price: 267.89 },
    { symbol: 'REGN', name: 'Regeneron Pharmaceuticals', sector: 'Healthcare', price: 789.12 },
    { symbol: 'VRTX', name: 'Vertex Pharmaceuticals Inc.', sector: 'Healthcare', price: 456.78 },
    { symbol: 'CELG', name: 'Celgene Corporation', sector: 'Healthcare', price: 123.45 },
    
    // Electric Vehicles & Clean Energy
    { symbol: 'RIVN', name: 'Rivian Automotive Inc.', sector: 'Consumer Discretionary', price: 23.45 },
    { symbol: 'LCID', name: 'Lucid Group Inc.', sector: 'Consumer Discretionary', price: 8.67 },
    { symbol: 'NIO', name: 'NIO Inc.', sector: 'Consumer Discretionary', price: 12.34 },
    { symbol: 'XPEV', name: 'XPeng Inc.', sector: 'Consumer Discretionary', price: 15.67 },
    
    // Fintech & Digital Payments
    { symbol: 'PYPL', name: 'PayPal Holdings Inc.', sector: 'Financial Services', price: 67.89 },
    { symbol: 'SQ', name: 'Block Inc.', sector: 'Financial Services', price: 89.45 },
    { symbol: 'COIN', name: 'Coinbase Global Inc.', sector: 'Financial Services', price: 123.78 },
    
    // Real Estate & REITs
    { symbol: 'SPG', name: 'Simon Property Group Inc.', sector: 'Real Estate', price: 134.56 },
    { symbol: 'AMT', name: 'American Tower Corporation', sector: 'Real Estate', price: 234.78 },
    { symbol: 'PLD', name: 'Prologis Inc.', sector: 'Real Estate', price: 145.67 },
    
    // Utilities
    { symbol: 'NEE', name: 'NextEra Energy Inc.', sector: 'Utilities', price: 78.45 },
    { symbol: 'DUK', name: 'Duke Energy Corporation', sector: 'Utilities', price: 98.67 },
    { symbol: 'SO', name: 'Southern Company', sector: 'Utilities', price: 67.89 },
    
    // Airlines
    { symbol: 'DAL', name: 'Delta Air Lines Inc.', sector: 'Industrial', price: 45.67 },
    { symbol: 'AAL', name: 'American Airlines Group Inc.', sector: 'Industrial', price: 18.45 },
    { symbol: 'UAL', name: 'United Airlines Holdings Inc.', sector: 'Industrial', price: 56.78 },
    { symbol: 'LUV', name: 'Southwest Airlines Co.', sector: 'Industrial', price: 34.56 },
    
    // Hotels & Entertainment
    { symbol: 'MAR', name: 'Marriott International Inc.', sector: 'Consumer Discretionary', price: 234.56 },
    { symbol: 'HLT', name: 'Hilton Worldwide Holdings Inc.', sector: 'Consumer Discretionary', price: 167.89 },
    { symbol: 'CCL', name: 'Carnival Corporation', sector: 'Consumer Discretionary', price: 23.45 },
    
    // Food & Beverage
    { symbol: 'KHC', name: 'Kraft Heinz Company', sector: 'Consumer Staples', price: 45.67 },
    { symbol: 'GIS', name: 'General Mills Inc.', sector: 'Consumer Staples', price: 67.89 },
    { symbol: 'K', name: 'Kellogg Company', sector: 'Consumer Staples', price: 56.78 },
    
    // Streaming & Media
    { symbol: 'ROKU', name: 'Roku Inc.', sector: 'Communication Services', price: 78.45 },
    { symbol: 'SPOT', name: 'Spotify Technology SA', sector: 'Communication Services', price: 167.89 },
    
    // Gaming
    { symbol: 'ATVI', name: 'Activision Blizzard Inc.', sector: 'Communication Services', price: 89.45 },
    { symbol: 'EA', name: 'Electronic Arts Inc.', sector: 'Communication Services', price: 134.56 },
    
    // Cloud & Data
    { symbol: 'SNOW', name: 'Snowflake Inc.', sector: 'Technology', price: 234.56 },
    { symbol: 'PLTR', name: 'Palantir Technologies Inc.', sector: 'Technology', price: 23.45 },
  ];

  useEffect(() => {
    if (searchTerm?.length >= 1) {
      const filtered = stockDatabase?.filter(stock =>
        stock?.symbol?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        stock?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        stock?.sector?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )?.slice(0, 20); // Show max 20 results
      
      setFilteredStocks(filtered);
      setIsOpen(true);
    } else {
      setFilteredStocks([]);
      setIsOpen(false);
    }
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef?.current && 
        !dropdownRef?.current?.contains(event?.target) &&
        searchRef?.current &&
        !searchRef?.current?.contains(event?.target)
      ) {
        setIsOpen(false);
      }
    };

    document?.addEventListener('mousedown', handleClickOutside);
    return () => document?.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStockSelect = (stock) => {
    onStockSelect?.(stock?.symbol);
    setSearchTerm('');
    setIsOpen(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsOpen(false);
  };

  const getSectorColor = (sector) => {
    const colors = {
      'Technology': 'text-blue-600 bg-blue-50',
      'Healthcare': 'text-green-600 bg-green-50',
      'Financial Services': 'text-purple-600 bg-purple-50',
      'Energy': 'text-orange-600 bg-orange-50',
      'Consumer Discretionary': 'text-pink-600 bg-pink-50',
      'Consumer Staples': 'text-amber-600 bg-amber-50',
      'Industrial': 'text-gray-600 bg-gray-50',
      'Communication Services': 'text-indigo-600 bg-indigo-50',
      'Utilities': 'text-teal-600 bg-teal-50',
      'Real Estate': 'text-cyan-600 bg-cyan-50'
    };
    return colors?.[sector] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="relative">
        <Icon 
          name="Search" 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          placeholder={placeholder}
          className="w-full h-10 pl-10 pr-10 border border-input rounded-md bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>

      {/* Current Selection Display */}
      {selectedStock && !isOpen && (
        <div className="mt-2 p-2 bg-muted rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Selected: {selectedStock}
            </span>
            <span className="text-xs text-muted-foreground">
              {stockDatabase?.find(s => s?.symbol === selectedStock)?.name}
            </span>
          </div>
        </div>
      )}

      {/* Dropdown Results */}
      {isOpen && filteredStocks?.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          <div className="p-2 border-b border-border">
            <span className="text-xs text-muted-foreground">
              {filteredStocks?.length} stocks found
            </span>
          </div>
          
          {filteredStocks?.map((stock) => (
            <button
              key={stock?.symbol}
              onClick={() => handleStockSelect(stock)}
              className="w-full p-3 hover:bg-accent/50 border-b border-border last:border-b-0 text-left transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-foreground text-sm">
                      {stock?.symbol}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getSectorColor(stock?.sector)}`}>
                      {stock?.sector}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {stock?.name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-foreground">
                    ${stock?.price?.toFixed(2)}
                  </span>
                </div>
              </div>
            </button>
          ))}
          
          {searchTerm && filteredStocks?.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              <Icon name="Search" size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No stocks found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}

      {/* Show popular stocks when focused but no search */}
      {isOpen && !searchTerm && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50"
        >
          <div className="p-2 border-b border-border">
            <span className="text-xs text-muted-foreground">Popular Stocks</span>
          </div>
          
          {stockDatabase?.slice(0, 10)?.map((stock) => (
            <button
              key={stock?.symbol}
              onClick={() => handleStockSelect(stock)}
              className="w-full p-3 hover:bg-accent/50 border-b border-border last:border-b-0 text-left transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-foreground text-sm">
                      {stock?.symbol}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getSectorColor(stock?.sector)}`}>
                      {stock?.sector}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {stock?.name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-foreground">
                    ${stock?.price?.toFixed(2)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockSearchInput;