"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { BinanceStreamTicker, CoinInfo } from "@/types/coin";
import SearchComponent from "../common/SearchComponent";
import { formatVolume } from "./formatVolume";
import BinanceRealTimeLabel from "./BinanceRealtimeLabel";

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
  const [keyword, setKeyword] = useState("");
  const [sortKey, setSortKey] = useState<
    "symbol" | "price" | "rate" | "volume"
  >("volume");
  const [sortOrder, setSortOrder] = useState("asc");

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

      setCoinInfo((prevState) =>
        prevCloseInfo
          .map((p: CoinInfo) => {
            const match = usdtPairs.find(
              (pair: BinanceStreamTicker) => pair.s === p.symbol
            );

            //이전 데이터 찾기
            const prevCoin = prevState.find(
              (c) => c.symbol === p.symbol.replace(/USDT(?=$)/, "")
            );

            if (!match)
              return prevCoin
                ? prevCoin
                : {
                    closeDate: p.closeDate,
                    symbol: p.symbol.replace(/USDT(?=$)/, ""),
                    prevClosePrice: Number(p.price),
                    price: Number(p.price),
                    rate: 0,
                    volume: 0,
                  };

            const prev = Number(p.price);
            const now = Number(match.c);
            const rate = ((now - prev) / prev) * 100;
            const volume = Number(match.q);

            return {
              closeDate: p.closeDate,
              symbol: p.symbol.replace(/USDT(?=$)/, ""),
              prevClosePrice: prev,
              price: now,
              rate: rate,
              volume: volume,
            };
          })
          .filter(Boolean)
          .sort((a, b) =>
            sortOrder === "asc"
              ? (b[sortKey] as number) - (a[sortKey] as number)
              : (a[sortKey] as number) - (b[sortKey] as number)
          )
      );
    };

    return () => ws.close();
  }, [prevCloseInfo, sortKey, sortOrder]);

  return (
    <div className="p-4 relative w-[380px] rounded-2xl border-gray-400 bg-gray-100 shadow-lg  text-black">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold">
          📈 실시간 USDT 시세 <span className="text-sm">binance 09:00기준</span>
        </h1>
        <SearchComponent setKeyword={setKeyword} />
      </div>
      <ul className="min-h-[350px] max-h-[350px] overflow-auto text-sm scrollbar-none">
        <li
          className={
            "sticky grid grid-cols-[100px_80px_60px_100px] py-1 font-bold"
          }
        >
          <span className="">자산명</span>

          <BinanceRealTimeLabel
            column="price"
            sortKey={sortKey}
            sortOrder={sortOrder}
            setSortKey={setSortKey}
            setSortOrder={setSortOrder}
          >
            현재가
          </BinanceRealTimeLabel>

          <BinanceRealTimeLabel
            column="rate"
            sortKey={sortKey}
            sortOrder={sortOrder}
            setSortKey={setSortKey}
            setSortOrder={setSortOrder}
          >
            변동
          </BinanceRealTimeLabel>

          <BinanceRealTimeLabel
            column="volume"
            sortKey={sortKey}
            sortOrder={sortOrder}
            setSortKey={setSortKey}
            setSortOrder={setSortOrder}
          >
            거래량
          </BinanceRealTimeLabel>
        </li>
        {coinInfo
          .filter((coin) => keyword === "" || coin.symbol.includes(keyword))
          .map((coin) => (
            <li
              key={coin.symbol}
              className={`grid grid-cols-[100px_80px_60px_100px] py-1 ${
                coin.rate >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              <span className="text-left">{coin.symbol}</span>
              <span className="text-right">{coin.price}</span>
              <span className="text-right">{coin.rate.toFixed(2)}%</span>
              <span className="text-right">{formatVolume(coin.volume)}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
