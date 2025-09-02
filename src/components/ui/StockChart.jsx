import React, { useEffect, useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import { cn } from '../../utils/cn';

const StockChart = ({ 
  data = [], 
  predictions = [], 
  sentiment = null,
  symbol = '',
  timeframe = '1y',
  className = "",
  showPredictions = false,
  showSentiment = false,
  height = 400,
  loading = false 
}) => {
  const [plotlyData, setPlotlyData] = useState([]);
  const [layout, setLayout] = useState({});

  const processedData = useMemo(() => {
    if (!data?.length) return [];

    return data?.map(item => ({
      date: new Date(item?.date),
      open: parseFloat(item?.open || 0),
      high: parseFloat(item?.high || 0),
      low: parseFloat(item?.low || 0),
      close: parseFloat(item?.close || 0),
      volume: parseInt(item?.volume || 0)
    }))?.sort((a, b) => new Date(a?.date) - new Date(b?.date));
  }, [data]);

  useEffect(() => {
    if (!processedData?.length) return;

    const traces = [];
    
    // Main candlestick/line chart
    const mainTrace = {
      type: 'candlestick',
      x: processedData?.map(d => d?.date),
      open: processedData?.map(d => d?.open),
      high: processedData?.map(d => d?.high),
      low: processedData?.map(d => d?.low),
      close: processedData?.map(d => d?.close),
      name: symbol,
      increasing: {
        fillcolor: '#10B981',
        line: { color: '#10B981' }
      },
      decreasing: {
        fillcolor: '#EF4444',
        line: { color: '#EF4444' }
      },
      xaxis: 'x',
      yaxis: 'y'
    };
    traces?.push(mainTrace);

    // Volume bar chart
    const volumeTrace = {
      type: 'bar',
      x: processedData?.map(d => d?.date),
      y: processedData?.map(d => d?.volume),
      name: 'Volume',
      yaxis: 'y2',
      marker: {
        color: processedData?.map((d, i) => {
          if (i === 0) return '#6B7280';
          return d?.close > processedData?.[i - 1]?.close ? '#10B981' : '#EF4444';
        }),
        opacity: 0.3
      },
      hovertemplate: '<b>Volume</b><br>%{y:,.0f}<br><extra></extra>'
    };
    traces?.push(volumeTrace);

    // Predictions if enabled
    if (showPredictions && predictions?.length) {
      const predictionTrace = {
        type: 'scatter',
        mode: 'lines+markers',
        x: predictions?.map(p => new Date(p?.date)),
        y: predictions?.map(p => p?.predicted),
        name: 'Forecast',
        line: {
          color: '#8B5CF6',
          width: 2,
          dash: 'dot'
        },
        marker: {
          color: '#8B5CF6',
          size: 6
        },
        hovertemplate: '<b>Forecast</b><br>$%{y:.2f}<br>%{x}<br><extra></extra>'
      };
      traces?.push(predictionTrace);

      // Confidence bands
      if (predictions?.some(p => p?.confidence)) {
        const upperBound = predictions?.map(p => 
          p?.predicted * (1 + (1 - p?.confidence) * 0.1)
        );
        const lowerBound = predictions?.map(p => 
          p?.predicted * (1 - (1 - p?.confidence) * 0.1)
        );

        traces?.push({
          type: 'scatter',
          mode: 'lines',
          x: predictions?.map(p => new Date(p?.date)),
          y: upperBound,
          fill: 'none',
          line: { color: 'transparent' },
          showlegend: false,
          hoverinfo: 'skip'
        });

        traces?.push({
          type: 'scatter',
          mode: 'lines',
          x: predictions?.map(p => new Date(p?.date)),
          y: lowerBound,
          fill: 'tonexty',
          fillcolor: 'rgba(139, 92, 246, 0.2)',
          line: { color: 'transparent' },
          name: 'Confidence Band',
          showlegend: false,
          hoverinfo: 'skip'
        });
      }
    }

    // Sentiment overlay if enabled
    if (showSentiment && sentiment?.data?.length) {
      const sentimentTrace = {
        type: 'scatter',
        mode: 'markers',
        x: sentiment?.data?.map(s => new Date(s?.date)),
        y: sentiment?.data?.map(s => s?.price), // Price at sentiment date
        marker: {
          size: sentiment?.data?.map(s => Math.abs(s?.score) * 20 + 5),
          color: sentiment?.data?.map(s => s?.sentiment === 'positive' ? '#10B981' : s?.sentiment === 'negative' ? '#EF4444' : '#6B7280'),
          symbol: 'circle',
          opacity: 0.7,
          line: {
            color: 'white',
            width: 1
          }
        },
        name: 'Sentiment',
        hovertemplate: '<b>Sentiment</b><br>%{text}<br>Score: %{customdata:.2f}<br><extra></extra>',
        text: sentiment?.data?.map(s => s?.sentiment?.charAt(0)?.toUpperCase() + s?.sentiment?.slice(1)),
        customdata: sentiment?.data?.map(s => s?.score)
      };
      traces?.push(sentimentTrace);
    }

    setPlotlyData(traces);
  }, [processedData, predictions, sentiment, symbol, showPredictions, showSentiment]);

  useEffect(() => {
    const newLayout = {
      title: {
        text: `${symbol} Stock Price ${timeframe?.toUpperCase()}`,
        font: { size: 18, family: 'Inter, system-ui, sans-serif' },
        x: 0.05
      },
      xaxis: {
        title: 'Date',
        type: 'date',
        rangeslider: { visible: false },
        showgrid: true,
        gridcolor: '#E5E7EB',
        showline: true,
        linecolor: '#D1D5DB'
      },
      yaxis: {
        title: 'Price ($)',
        side: 'right',
        showgrid: true,
        gridcolor: '#E5E7EB',
        showline: true,
        linecolor: '#D1D5DB'
      },
      yaxis2: {
        title: 'Volume',
        overlaying: 'y',
        side: 'left',
        showgrid: false,
        range: [0, Math.max(...(processedData?.map(d => d?.volume) || [1])) * 4]
      },
      plot_bgcolor: 'white',
      paper_bgcolor: 'white',
      font: {
        family: 'Inter, system-ui, sans-serif',
        size: 12,
        color: '#374151'
      },
      legend: {
        orientation: 'h',
        yanchor: 'bottom',
        y: 1.02,
        xanchor: 'right',
        x: 1,
        bgcolor: 'rgba(255,255,255,0.8)',
        bordercolor: '#E5E7EB',
        borderwidth: 1
      },
      margin: {
        l: 60,
        r: 60,
        t: 80,
        b: 60
      },
      hovermode: 'x unified',
      showlegend: true
    };

    setLayout(newLayout);
  }, [symbol, timeframe, processedData]);

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center bg-background rounded-lg border", className)} style={{ height }}>
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (!processedData?.length) {
    return (
      <div className={cn("flex items-center justify-center bg-background rounded-lg border", className)} style={{ height }}>
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
            <span className="text-muted-foreground text-xl">📈</span>
          </div>
          <h3 className="font-medium text-foreground">No Chart Data</h3>
          <p className="text-sm text-muted-foreground">Please select a stock symbol to view the chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-background rounded-lg border p-4", className)}>
      <Plot
        data={plotlyData}
        layout={{
          ...layout,
          height: height,
          autosize: true
        }}
        config={{
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: [
            'pan2d',
            'lasso2d',
            'select2d',
            'hoverClosestCartesian',
            'hoverCompareCartesian',
            'toggleSpikelines'
          ],
          responsive: true
        }}
        style={{ width: '100%' }}
        useResizeHandler={true}
      />
    </div>
  );
};

export default StockChart;