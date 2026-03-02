"use client";

import React, { useEffect, useRef, memo } from 'react';

const TradingViewWidget = memo(() => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only inject the script once
        if (container.current && container.current.children.length === 0) {
            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = `
        {
          "autosize": true,
          "symbol": "OANDA:XAUUSD",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "backgroundColor": "rgba(17, 24, 39, 1)",
          "gridColor": "rgba(31, 41, 55, 1)",
          "hide_top_toolbar": false,
          "hide_legend": false,
          "save_image": false,
          "container_id": "tradingview_widget",
          "support_host": "https://www.tradingview.com"
        }`;
            container.current.appendChild(script);
        }
    }, []);

    return (
        <div className="tradingview-widget-container h-full w-full" ref={container}>
            {/* The widget will be injected here */}
        </div>
    );
});

TradingViewWidget.displayName = 'TradingViewWidget';

export default function ToolsPage() {
    return (
        <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6 lg:p-8 font-sans">
            {/* Header */}
            <div className="mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                    Advanced Trading Tools
                </h1>
                <p className="text-gray-400 mt-2 text-sm md:text-base">
                    Professional-grade charting with real-time data to analyze markets using advanced indicators.
                </p>
            </div>

            {/* Main Content Area: Chart and Sidebar */}
            <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-180px)] min-h-[800px] xl:min-h-0">

                {/* Chart Section */}
                <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[500px] xl:min-h-0">
                    <TradingViewWidget />
                </div>

                {/* Sidebar for Indicators */}
                <div className="w-full xl:w-96 flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">

                    {/* ATR Section */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-500/20 text-blue-400 p-2 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            </div>
                            <h2 className="text-xl font-bold text-white">ATR Indicator</h2>
                        </div>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                            <strong className="text-gray-300">Average True Range (ATR)</strong> measures market volatility. It indicates the degree of price movement rather than direction.
                        </p>
                        <ul className="text-sm text-gray-400 space-y-3">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 font-bold mt-0.5">•</span>
                                <span><span className="text-gray-300 font-medium">High ATR:</span> Indicates high volatility. Consider widening stop losses.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 font-bold mt-0.5">•</span>
                                <span><span className="text-gray-300 font-medium">Low ATR:</span> Indicates low volatility, often seen in sideways markets.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 font-bold mt-0.5">•</span>
                                <span><span className="text-gray-300 font-medium">Use Case:</span> Perfect for setting dynamic Stop Loss (e.g., 1.5x ATR).</span>
                            </li>
                        </ul>
                    </div>

                    {/* Fibonacci Section */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg hover:border-emerald-500/50 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                            </div>
                            <h2 className="text-xl font-bold text-white">Fibonacci Retracement</h2>
                        </div>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                            <strong className="text-gray-300">Fibonacci Retracement</strong> helps identify potential support and resistance levels based on the golden ratio sequence.
                        </p>
                        <ul className="text-sm text-gray-400 space-y-3">
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                                <span><span className="text-gray-300 font-medium">Key Levels:</span> 38.2%, 50.0%, and 61.8% are the most watched bounce zones.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                                <span><span className="text-gray-300 font-medium">Uptrend:</span> Draw from Swing Low to Swing High to find buy/support zones.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                                <span><span className="text-gray-300 font-medium">Downtrend:</span> Draw from Swing High to Swing Low to find sell/resistance zones.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Pro Tip */}
                    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-6 shadow-lg mt-auto hover:border-indigo-500/60 transition-colors">
                        <h3 className="text-indigo-300 font-bold mb-2 flex items-center gap-2">
                            <span>💡</span> Pro Tip
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Combine <strong className="text-white">ATR</strong> for risk management (sizing your stop loss) and <strong className="text-white">Fibonacci</strong> for entry points to create a robust and reliable trading strategy.
                        </p>
                    </div>

                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #374151;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #4B5563;
        }
      `}} />
        </div>
    );
}
