"use client";
import { useEffect, useState } from "react";

export default function BinanceRealtimePrice() {
  const [tickers, setTickers] = useState([]);

  useEffect(() => {
    // Binance 전체 코인 실시간 가격 스트림
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // usdt 코인만 filtering
      const usdtPairs = data.filter((coin) => coin.s.endsWith("USDT"));
      setTickers(usdtPairs);
    };
    console.log(tickers);
    return () => ws.close();
  });

  return (
    <div>
      <h1>Binance Api</h1>
    </div>
  );
}
