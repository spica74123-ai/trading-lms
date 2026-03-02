"use client";

import { useEffect, useRef } from "react";

export default function PriceTicker() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // อัปเดตเมื่อ component mount
        if (container.current && container.current.innerHTML === "") {
            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = `
                {
                    "symbols": [
                        {
                            "proName": "OANDA:XAUUSD",
                            "title": "Gold (XAU/USD)"
                        },
                        {
                            "proName": "BITSTAMP:BTCUSD",
                            "title": "Bitcoin (BTC/USD)"
                        }
                    ],
                    "showSymbolLogo": true,
                    "isTransparent": false,
                    "displayMode": "regular",
                    "colorTheme": "dark",
                    "locale": "en"
                }
            `;
            container.current.appendChild(script);
        }
    }, []);

    return (
        <div className="tradingview-widget-container z-50 relative" ref={container} style={{ width: "100%", height: "46px" }}></div>
    );
}
