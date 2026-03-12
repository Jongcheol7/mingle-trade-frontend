"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CoinInfo, UpbitCoinPairs, UpbitStreamTicker } from "@/types/coin";
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

const THROTTLE_MS = 500;

export default function UpbitRealtimePrice() {
  const [upbitCoinPairs, setUpbitCoinPairs] = useState<UpbitCoinPairs[]>([]);
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
    const getUpbitMarkets = async () => {
      try {
        const res = await fetch("https://api.upbit.com/v1/market/all");
        const data = await res.json();
        setUpbitCoinPairs(
          data.filter((m: UpbitCoinPairs) => m.market.startsWith("KRW-"))
        );
      } catch {
        // 마켓 정보 로드 실패
      }
    };
    getUpbitMarkets();
  }, []);

  // 쓰로틀된 업데이트
  const latestPricesRef = useRef(new Map<string, UpbitStreamTicker>());
  const lastUpdateRef = useRef(0);
  const pendingRef = useRef(false);

  const processUpdate = useCallback(() => {
    const sk = sortKeyRef.current;
    const so = sortOrderRef.current;
    const latestPricesList = Array.from(latestPricesRef.current.values());

    const coinInfoList: CoinInfo[] = latestPricesList.map((a) => ({
      symbol: a.code,
      price: a.trade_price,
      rate: a.signed_change_rate,
      volume: a.acc_trade_price_24h,
      closeDate: "",
      prevClosePrice: 0,
      logoUrl: "",
    }));

    const sorted = coinInfoList.sort((a, b) =>
      so === "asc"
        ? (b[sk] as number) - (a[sk] as number)
        : (a[sk] as number) - (b[sk] as number)
    );

    setCoinInfo(sorted);
  }, []);

  const handleMessage = useCallback(
    async (event: MessageEvent) => {
      const text = await event.data.text();
      const ticker = JSON.parse(text);
      latestPricesRef.current.set(ticker.code, ticker);

      const now = Date.now();
      if (now - lastUpdateRef.current >= THROTTLE_MS) {
        lastUpdateRef.current = now;
        processUpdate();
      } else {
        pendingRef.current = true;
      }
    },
    [processUpdate]
  );

  // 대기 중인 데이터 처리
  useEffect(() => {
    const interval = setInterval(() => {
      if (pendingRef.current) {
        processUpdate();
        pendingRef.current = false;
      }
    }, THROTTLE_MS);
    return () => clearInterval(interval);
  }, [processUpdate]);

  const handleOpen = useCallback(
    (ws: WebSocket) => {
      const codes = upbitCoinPairs.map((m) => m.market);
      ws.send(
        JSON.stringify([{ ticket: "client" }, { type: "ticker", codes }])
      );
    },
    [upbitCoinPairs]
  );

  useReconnectingWebSocket({
    url: "wss://api.upbit.com/websocket/v1",
    onMessage: handleMessage,
    onOpen: handleOpen,
    enabled: upbitCoinPairs.length > 0,
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

  const filteredCoins = useMemo(() => {
    return coinInfo.filter((coin) => {
      if (keyword === "") return true;
      const lowerKeyword = keyword.toLowerCase();
      const matchedCoin = upbitCoinPairs.find(
        (upbitPair) => upbitPair.market === coin.symbol
      );
      return (
        coin.symbol.toLowerCase().includes(lowerKeyword) ||
        matchedCoin?.korean_name.includes(keyword)
      );
    });
  }, [coinInfo, keyword, upbitCoinPairs]);

  return (
    <div className="p-4 relative rounded-2xl border border-border bg-card shadow-sm text-foreground">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">실시간 KRW 시세</h1>
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
          <span className="text-xs text-muted-foreground font-semibold">
            09:00기준
          </span>
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
          filteredCoins.map((coin) => {
            const matchedCoin = upbitCoinPairs.find(
              (upbitPair) => upbitPair.market === coin.symbol
            );
            return (
              <li
                key={coin.symbol}
                className="grid grid-cols-[130px_100px_70px_80px] py-1 border-b border-border"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6 border border-border shadow-sm">
                    <AvatarImage
                      src={`https://static.upbit.com/logos/${coin.symbol?.replace(
                        /KRW-/,
                        ""
                      )}.png`}
                    />
                    <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                      {""}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className="text-left text-[16px] font-bold cursor-pointer line-clamp-1 hover:text-primary transition-colors"
                    onClick={() =>
                      router.push(
                        `/crypto/chart/${coin.symbol.replace(/KRW-/, "")}`
                      )
                    }
                  >
                    {matchedCoin ? matchedCoin.korean_name : coin.symbol}
                  </span>
                </div>
                <span className="text-right text-[16px] font-bold">
                  {coin.price ? coin.price.toFixed(1) : ""}
                </span>
                <span
                  className={`text-right text-[16px] ${
                    coin.rate >= 0 ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {(coin.rate * 100).toFixed(2)}%
                </span>
                <span className="text-right text-[16px] font-bold">
                  {formatVolume(coin.volume ? coin.volume : 0)}
                </span>
              </li>
            );
          })
        ) : (
          <Loader2 className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 animate-spin text-muted-foreground" />
        )}
      </ul>
    </div>
  );
}
