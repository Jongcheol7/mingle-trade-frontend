"use client";
import { useEffect, useState } from "react";
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

export default function UpbitRealtimePrice() {
  const [upbitCoinParis, setUpbitCoinParis] = useState<UpbitCoinPairs[]>([]);
  const [coinInfo, setCoinInfo] = useState<CoinInfo[]>([]);
  const [keyword, setKeyword] = useState("");
  const [sortKey, setSortKey] = useState<
    "symbol" | "price" | "rate" | "volume"
  >("volume");
  const [sortOrder, setSortOrder] = useState("asc");
  const router = useRouter();
  const { market, setMarket } = useCryptoMarketStore();

  // 업비트 모든 코인 pair 가져오기.
  useEffect(() => {
    const getUpbitMarkets = async () => {
      const res = await fetch("https://api.upbit.com/v1/market/all");
      const data = await res.json();
      setUpbitCoinParis(
        data.filter((m: UpbitCoinPairs) => m.market.startsWith("KRW-"))
      );
    };
    getUpbitMarkets();
  }, []);

  // 실시간 데이터 스트림으로 가져오기
  useEffect(() => {
    if (!upbitCoinParis) return;

    //웹소켓 연결
    const ws = new WebSocket("wss://api.upbit.com/websocket/v1");
    ws.onopen = () => {
      const codes = upbitCoinParis.map((m) => m.market); // ✅ 문자열 배열로 변환
      ws.send(
        JSON.stringify([{ ticket: "client" }, { type: "ticker", codes }])
      );
    };

    const latestPrices = new Map<string, UpbitStreamTicker>();
    ws.onmessage = async (event) => {
      const text = await event.data.text();
      const ticker = JSON.parse(text);

      latestPrices.set(ticker.code, ticker);
      //console.log("latestPrices : ", latestPrices);
      const latestPricesList = Array.from(latestPrices.values());
      const coinInfoList: CoinInfo[] = latestPricesList.map((a) => ({
        symbol: a.code,
        price: a.trade_price,
        rate: a.signed_change_rate,
        volume: a.acc_trade_price_24h,
        closeDate: "",
        prevClosePrice: 0,
        logoUrl: "",
      }));

      const sortedCoinList = coinInfoList.sort((a, b) =>
        sortOrder === "asc"
          ? (b[sortKey] as number) - (a[sortKey] as number)
          : (a[sortKey] as number) - (b[sortKey] as number)
      );

      setCoinInfo(sortedCoinList);
    };

    ws.onclose = () => console.log("업비트 WS 종료됨");
    return () => ws.close();
  }, [upbitCoinParis, sortKey, sortOrder]);

  return (
    <div className="p-4 relative  rounded-2xl border-gray-400 bg-white shadow-lg  text-black">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">📈 실시간 KRW 시세</h1>
          <Select
            onValueChange={(value: "Upbit" | "Binance") => setMarket(value)}
          >
            <SelectTrigger className="w-[110px] text-black font-bold">
              <SelectValue placeholder={market} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Upbit">Upbit</SelectItem>
              <SelectItem value="Binance">Binance</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm font-bold">09:00기준</span>
        </div>
        <SearchComponent setKeyword={setKeyword} />
      </div>
      <ul className="relative h-[calc(100vh-300px)] overflow-auto text-sm scrollbar-none">
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
        {coinInfo.length > 0 ? (
          coinInfo
            .filter((coin) => {
              const matchedCoin = upbitCoinParis.find(
                (upbitPair) => upbitPair.market === coin.symbol
              );
              return (
                keyword === "" ||
                coin.symbol.includes(keyword) ||
                matchedCoin?.korean_name.includes(keyword)
              );
            })
            .map((coin) => {
              const matchedCoin = upbitCoinParis.find(
                (upbitPair) => upbitPair.market === coin.symbol
              );
              return (
                <li
                  key={`${coin.symbol}-${Math.round(coin.price)}`}
                  className={`grid grid-cols-[130px_100px_70px_80px] py-1 border-b border-gray-300`}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className=" w-6 h-6 border-1 border-white shadow-md">
                      <AvatarImage
                        src={`https://static.upbit.com/logos/${coin.symbol?.replace(
                          /KRW-/,
                          ""
                        )}.png`}
                      />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-amber-300 to-yellow-400 text-white">
                        {""}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className="text-left text-[16px] font-bold cursor-pointer line-clamp-1"
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
                      coin.rate >= 0 ? "text-green-500" : "text-red-500"
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
          <Loader2 className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 animate-spin text-gray-500" />
        )}
      </ul>
    </div>
  );
}
