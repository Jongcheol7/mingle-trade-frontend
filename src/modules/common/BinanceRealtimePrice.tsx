"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { BinanceStreamTicker, CoinInfo } from "@/types/coin";

const today = new Date();
const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
const formatted =
  yesterday.getFullYear() +
  "-" +
  String(yesterday.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(yesterday.getDate()).padStart(2, "0");

export default function BinanceRealtimePrice() {
  const [prevCloseInfo, setPrevCloseInfo] = useState([]);
  const [coinInfo, setCoinInfo] = useState<CoinInfo[]>([]);

  useEffect(() => {
    const getPrevCloseInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/prev-price/selectAll/${formatted}`
        );
        setPrevCloseInfo(res.data);
      } catch (err) {
        console.error("전일 종가 조회 실패:", err);
      }
    };

    getPrevCloseInfo();
  }, []);

  // ✅ prevCloseInfo가 로드된 후 WebSocket 연결
  useEffect(() => {
    if (prevCloseInfo.length === 0) return; // 전일종가 없으면 실행 X

    const ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const usdtPairs = data.filter((coin: BinanceStreamTicker) =>
        coin.s.endsWith("USDT")
      );

      const mergeInfo = prevCloseInfo
        .map((p: CoinInfo) => {
          const match = usdtPairs.find(
            (pair: BinanceStreamTicker) => pair.s === p.symbol
          );
          if (!match)
            return {
              closeDate: p.closeDate,
              symbol: p.symbol.replace(/USDT$/, ""),
              prevClosePrice: Number(p.price),
              price: Number(p.price),
              rate: 0,
            };

          const prev = Number(p.price);
          const now = Number(match.c);
          const rate = ((now - prev) / prev) * 100;

          return {
            closeDate: p.closeDate,
            symbol: p.symbol.replace(/USDT$/, ""),
            prevClosePrice: prev,
            price: now,
            rate: rate,
          };
        })
        .filter(Boolean);

      setCoinInfo(mergeInfo);
    };

    return () => ws.close();
  }, [prevCloseInfo]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-3">📈 실시간 USDT 시세</h1>
      <ul className="max-h-[600px] overflow-auto text-sm">
        <li className={"grid grid-cols-[100px_80px_60px] py-1 font-bold"}>
          <span className="text-left">자산명</span>
          <span className="text-right">현재가</span>
          <span className="text-right">변동</span>
        </li>
        {coinInfo.map((coin) => (
          <li
            key={coin.symbol}
            className={`grid grid-cols-[100px_80px_60px] py-1 ${
              coin.rate >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            <span className="text-left">{coin.symbol}</span>
            <span className="text-right">{coin.price}</span>
            <span className="text-right">{coin.rate.toFixed(2)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
