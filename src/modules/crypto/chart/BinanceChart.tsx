import { createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";

export default function BinanceChart() {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    // 차트생성
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: { background: { color: "#ffffff" }, textColor: "#222" },
      grid: { vertLines: { color: "#eee" }, horzLines: { color: "#eee" } },
      timeScale: { timeVisible: true, borderVisible: false },
    });

    // 캔들 시리즈 생성
    const candleSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderDownColor: "#ef5350",
      borderUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      wickUpColor: "#26a69a",
    });
  });

  return (
    <div>
      <h1>바이낸스 차트 공간</h1>
    </div>
  );
}
