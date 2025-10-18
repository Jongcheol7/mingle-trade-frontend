"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axios from "axios";
import { createChart } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { tickLists } from "./TickLists";

type Props = {
  symbol: string;
};

export default function BinanceChart({ symbol }: Props) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [tick, setTick] = useState("1m");

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 차트 생성
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: { background: { color: "#ffffff" }, textColor: "#222" },
      grid: { vertLines: { color: "#eee" }, horzLines: { color: "#eee" } },
      timeScale: {
        timeVisible: true,
        borderVisible: false,
        // ✅ x축 라벨을 직접 포맷
        tickMarkFormatter: (time, tickMarkType, locale) => {
          const date = new Date(time * 1000);
          return date.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          });
        },
      },
    });

    // 캔들 시리즈
    const candleSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderDownColor: "#ef5350",
      borderUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      wickUpColor: "#26a69a",
    });

    // 초기 데이터 로드
    (async () => {
      try {
        const res = await axios.get(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${tick}&limit=5000`
        );
        console.log("res : ", res);
        const formatted = res.data.map((d: any) => ({
          time: d[0] / 1000,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));
        candleSeries.setData(formatted);
      } catch (err) {
        console.error("차트 데이터 로드 err ", err);
        toast.error("차트 데이터 로드 err : " + err);
      }
    })();

    // ✅ WebSocket 실시간 데이터 연결
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@kline_${tick}`
    );

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const k = message.k; // kline 데이터

      // 실시간으로 최신 캔들 갱신
      candleSeries.update({
        time: k.t / 1000, // timestamp (초 단위)
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
      });
    };

    return () => {
      ws.close();
      chart.remove();
    };
  }, [symbol, tick]);

  return (
    <div className="w-full mx-auto">
      <Card className="border borde-gray-200 p-0">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="font-bold text-2xl mt-2">{symbol}</div>
            <div className="flex gap-1 cursor-pointer mt-2">
              {tickLists.map((t) => (
                <div
                  key={t}
                  className={`p-1 border rounded-md ${
                    tick === t ? "bg-black text-white" : ""
                  }`}
                  onClick={() => setTick(t)}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div ref={chartContainerRef} className="h-[400px] block" />
        </CardContent>
      </Card>
    </div>
  );
}
