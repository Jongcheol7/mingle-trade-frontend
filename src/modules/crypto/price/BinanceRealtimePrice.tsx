"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "@/lib/api";
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
import { Loader2 } from "lucide-react";
import { useReconnectingWebSocket } from "@/lib/useReconnectingWebSocket";

const today = new Date();
const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
const formatted =
  yesterday.getFullYear() +
  "-" +
  String(yesterday.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(yesterday.getDate()).padStart(2, "0");

const THROTTLE_MS = 500;

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

  const sortKeyRef = useRef(sortKey);
  const sortOrderRef = useRef(sortOrder);
  sortKeyRef.current = sortKey;
  sortOrderRef.current = sortOrder;

  useEffect(() => {
    const getPrevCloseInfo = async () => {
      try {
        const res = await api.get(
          `/api/prev-price/selectAll/${formatted}`
        );
        setPrevCloseInfo(res.data);
      } catch {
        // API 인터셉터에서 에러 처리됨
      }
    };
    getPrevCloseInfo();
  }, []);

  // 쓰로틀된 업데이트
  const lastUpdateRef = useRef(0);
  const pendingDataRef = useRef<BinanceStreamTicker[] | null>(null);
  const rafRef = useRef<number>(undefined);

  const processUpdate = useCallback(
    (usdtPairs: BinanceStreamTicker[]) => {
      if (prevCloseInfo.length === 0) return;

      const sk = sortKeyRef.current;
      const so = sortOrderRef.current;

      setCoinInfo(
        prevCloseInfo
          .map((p: CoinInfo) => {
            const match = usdtPairs.find(
              (pair: BinanceStreamTicker) => pair.s === p.symbol
            );

            if (!match)
              return {
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
              rate,
              volume,
              logoUrl: p.logoUrl,
            };
          })
          .filter(Boolean)
          .sort((a, b) =>
            so === "asc"
              ? (b[sk] as number) - (a[sk] as number)
              : (a[sk] as number) - (b[sk] as number)
          )
      );
    },
    [prevCloseInfo]
  );

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      const usdtPairs = data.filter((coin: BinanceStreamTicker) =>
        coin.s.endsWith("USDT")
      );

      const now = Date.now();
      if (now - lastUpdateRef.current >= THROTTLE_MS) {
        lastUpdateRef.current = now;
        cancelAnimationFrame(rafRef.current!);
        rafRef.current = requestAnimationFrame(() => processUpdate(usdtPairs));
      } else {
        pendingDataRef.current = usdtPairs;
      }
    },
    [processUpdate]
  );

  // 대기 중인 데이터 처리
  useEffect(() => {
    const interval = setInterval(() => {
      if (pendingDataRef.current) {
        processUpdate(pendingDataRef.current);
        pendingDataRef.current = null;
      }
    }, THROTTLE_MS);
    return () => clearInterval(interval);
  }, [processUpdate]);

  useReconnectingWebSocket({
    url: "wss://stream.binance.com:9443/ws/!ticker@arr",
    onMessage: handleMessage,
    enabled: prevCloseInfo.length > 0,
  });

  // 정렬 변경 시 즉시 반영
  useEffect(() => {
    if (coinInfo.length === 0) return;
    setCoinInfo((prev) =>
      [...prev].sort((a, b) =>
        sortOrder === "asc"
          ? (b[sortKey] as number) - (a[sortKey] as number)
          : (a[sortKey] as number) - (b[sortKey] as number)
      )
    );
  }, [sortKey, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredCoins = useMemo(
    () =>
      coinInfo.filter(
        (coin) =>
          keyword === "" ||
          coin.symbol.toLowerCase().includes(keyword.toLowerCase())
      ),
    [coinInfo, keyword]
  );

  return (
    <div className="p-4 relative rounded-2xl border border-border bg-card shadow-sm text-foreground">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">실시간 USDT 시세</h1>
          <Select
            onValueChange={(value: "Upbit" | "Binance") => setMarket(value)}
          >
            <SelectTrigger className="w-[110px] font-semibold">
              <SelectValue placeholder={market} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Upbit">Upbit</SelectItem>
              <SelectItem value="Binance">Binance</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">09:00기준</span>
        </div>
        <SearchComponent setKeyword={setKeyword} />
      </div>
      <ul className="relative h-screen overflow-auto text-sm scrollbar-none">
        <li
          className={
            "sticky grid grid-cols-[130px_100px_70px_80px] py-1 font-bold text-[14px]"
          }
        >
          <span>자산명</span>

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
        {filteredCoins.length > 0 ? (
          filteredCoins.map((coin) => (
            <li
              key={coin.symbol}
              className="grid grid-cols-[130px_100px_70px_80px] py-1 border-b border-border"
            >
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6 border border-border shadow-sm">
                  <AvatarImage src={coin.logoUrl || "/default_profile.png"} />
                  <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                    {""}
                  </AvatarFallback>
                </Avatar>
                <span
                  className="text-left text-[16px] font-bold cursor-pointer line-clamp-1 hover:text-primary transition-colors"
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
                  coin.rate >= 0 ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {coin.rate.toFixed(2)}%
              </span>
              <span className="text-right text-[16px] font-bold">
                {formatVolume(coin.volume ? coin.volume : 0)}
              </span>
            </li>
          ))
        ) : (
          <Loader2 className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 animate-spin text-muted-foreground" />
        )}
      </ul>
    </div>
  );
}
