"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { BinanceStreamTicker, CoinInfo } from "@/types/coin";
import SearchComponent from "@/modules/common/SearchComponent";
import { formatVolume } from "./formatVolume";
import BinanceRealTimeLabel from "./BinanceRealtimeLabel";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCryptoMarketStore } from "@/store/useCryptoMarketStore";

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
  const router = useRouter();
  const { market, setMarket } = useCryptoMarketStore();

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
                    logoUrl: p.logoUrl,
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
              logoUrl: p.logoUrl,
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
    <div className="p-4 relative w-[600px] rounded-2xl border-gray-400 bg-gray-100 shadow-lg  text-black">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">📈 실시간 USDT 시세</h1>
          <Select
            onValueChange={(value: "Upbit" | "Binance") => setMarket(value)}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder={market} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Upbit">Upbit</SelectItem>
              <SelectItem value="Binance">Binance</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm">09:00기준</span>
        </div>
        <SearchComponent setKeyword={setKeyword} />
      </div>
      <ul className="min-h-[350px] max-h-[450px] overflow-auto text-sm scrollbar-none">
        <li
          className={
            "sticky grid grid-cols-[130px_100px_70px_80px] py-1 font-bold text-[14px]"
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
              className={`grid grid-cols-[130px_100px_70px_80px] py-1 border-b border-gray-300`}
            >
              <div className="flex items-center gap-2">
                <Avatar className=" w-6 h-6 border-1 border-white shadow-md">
                  <AvatarImage src={coin.logoUrl || "/default_profile.png"} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-amber-300 to-yellow-400 text-white">
                    {""}
                  </AvatarFallback>
                </Avatar>
                <span
                  className="text-left text-[16px] font-bold cursor-pointer line-clamp-1"
                  onClick={() => router.push(`/crypto/chart/${coin.symbol}`)}
                >
                  {coin.symbol}
                </span>
              </div>
              <span className="text-right text-[16px] font-bold">
                {coin.price}
              </span>
              <span
                className={`text-right text-[16px] ${
                  coin.rate >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {coin.rate.toFixed(2)}%
              </span>
              <span className="text-right text-[16px] font-bold">
                {formatVolume(coin.volume ? coin.volume : 0)}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}
