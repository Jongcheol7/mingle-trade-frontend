import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUserStore } from "@/store/useUserStore";
import { UpbitCoinPairs } from "@/types/coin";
import { portfolio } from "@/types/portfolio";
import axios from "axios";
import { useEffect, useState } from "react";
import PortfolioEdit from "./PortfolioEdit";
import { AnimatePresence } from "framer-motion";

type Props = {
  portfolio: portfolio;
  market: "Upbit" | "Binance";
  onValueChange: (obj: {
    evalAmount: { id: number; evalAmount: number };
    buyAmount: { id: number; buyAmount: number };
  }) => void;
  onDelete: (val1: string, val2: number, val3: string) => void;
};

type Info = {
  label: string;
  value: string | number;
};

export default function PortfolioDetail({
  portfolio,
  market,
  onValueChange,
  onDelete,
}: Props) {
  const [infos, setInfos] = useState<Info[]>([]);
  const [korName, setKorName] = useState("");
  const [engName, setEngName] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [changeRate, setChangeRate] = useState<number | null>(null); // 전일 대비 등락률
  const { email } = useUserStore();
  const [visibleEdit, setVisibleEdit] = useState(false);

  useEffect(() => {
    const getPriceInfo = async () => {
      try {
        let currentPrice = 0;
        let kor = "";
        let eng = "";
        let rate = 0;

        if (market === "Upbit") {
          // 1️⃣ 심볼명 매칭
          const namePairs = await axios.get(
            "https://api.upbit.com/v1/market/all?isDetails=false"
          );
          const myPair = namePairs.data.find(
            (pair: UpbitCoinPairs) =>
              pair.market === `KRW-${portfolio.symbol.toUpperCase()}`
          );

          if (myPair) {
            kor = myPair.korean_name;
            eng = myPair.english_name;
          }

          // 2️⃣ 가격 및 변동률 조회
          const res = await axios.get(
            `https://api.upbit.com/v1/ticker?markets=KRW-${portfolio.symbol}`
          );
          const data = res.data[0];
          currentPrice = data.trade_price;
          rate = data.signed_change_rate * 100; // 전일대비 등락률(%)
        } else if (market === "Binance") {
          const symbol =
            portfolio.symbol.toUpperCase().replace(/[-/]/g, "") + "USDT";
          const res = await axios.get(
            `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
          );
          currentPrice = parseFloat(res.data.lastPrice);
          rate = parseFloat(res.data.priceChangePercent); // 24시간 변동률(%)
          eng = portfolio.symbol.replace("USDT", ""); // 예: BTCUSDT → BTC
        }

        // 📊 계산
        const buyAmount = portfolio.quantity * portfolio.enterPrice;
        const evalAmount = portfolio.quantity * currentPrice;
        const profit = evalAmount - buyAmount;
        const profitRate = ((profit / buyAmount) * 100).toFixed(2);

        setKorName(kor);
        setEngName(eng);
        setPrice(currentPrice);
        setChangeRate(rate);

        setInfos([
          { label: "현재가", value: currentPrice.toLocaleString() },
          { label: "평가손익", value: profit.toLocaleString() },
          { label: "수익률", value: `${profitRate}%` },
          { label: "보유수량", value: portfolio.quantity.toLocaleString() },
          { label: "평균매수가", value: portfolio.enterPrice.toLocaleString() },
          { label: "매수금액", value: buyAmount.toLocaleString() },
          { label: "평가금액", value: evalAmount.toLocaleString() },
        ]);

        onValueChange({
          evalAmount: { id: portfolio.id, evalAmount },
          buyAmount: { id: portfolio.id, buyAmount },
        });
      } catch (err) {
        console.error("시세 불러오기 실패:", err);
      }
    };

    getPriceInfo();
  }, [market, portfolio, onValueChange]);

  // 전일 대비 색상
  const rateColor =
    changeRate === null
      ? "text-gray-400"
      : changeRate > 0
      ? "text-red-500"
      : changeRate < 0
      ? "text-blue-500"
      : "text-gray-400";

  return (
    <Card className="group relative">
      <CardHeader className="flex justify-between items-center">
        {/* 왼쪽 영역: 코인 심볼 이미지 + 이름 */}
        <div className="flex items-center space-x-3">
          <Avatar className=" w-6 h-6 border-1 border-white shadow-md">
            <AvatarImage
              src={
                `https://static.upbit.com/logos/${portfolio.symbol.toUpperCase()}.png` ||
                "/default_profile.png"
              }
            />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-amber-300 to-yellow-400 text-white">
              {""}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg">
              {market === "Upbit" ? korName : engName}
            </p>
            <p className="text-sm text-gray-500">{portfolio.symbol}</p>
          </div>
        </div>

        {/* 오른쪽 영역: 현재가 + 전일대비 */}
        <div className="text-right">
          <p className="font-semibold text-lg">
            {price ? price.toLocaleString() : "-"}{" "}
            {market === "Upbit" ? "KRW" : "USDT"}
          </p>
          <p className={`text-sm ${rateColor}`}>
            {changeRate !== null ? `${changeRate.toFixed(2)}%` : "-"}
          </p>
        </div>
      </CardHeader>

      <CardContent className="">
        {infos.map((info) => (
          <div
            key={info.label}
            className="flex justify-between py-1 group-hover:blur-xs group-hover:bg-black/20 transition-all"
          >
            <label className="text-gray-500">{info.label}</label>
            <p className="font-medium">{info.value}</p>
          </div>
        ))}
      </CardContent>

      <div className="absolute flex gap-2 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all">
        <button
          className="p-2 rounded-md font-bold bg-black text-white hover:cursor-pointer"
          onClick={() => {
            console.log("수정 클릭됨");
            setVisibleEdit(true);
          }}
        >
          수정
        </button>
        <button
          className="p-2 rounded-md font-bold bg-red-300 hover:cursor-pointer"
          onClick={() =>
            onDelete(
              email ?? "",
              portfolio.id,
              market === "Upbit" ? "KRW" : "USD"
            )
          }
        >
          삭제
        </button>
      </div>

      <AnimatePresence>
        {visibleEdit && (
          <PortfolioEdit
            portfolio={portfolio}
            name={market === "Upbit" ? korName : engName}
            setVisibleEdit={setVisibleEdit}
            currency={market === "Upbit" ? "KRW" : "USD"}
          />
        )}
      </AnimatePresence>
    </Card>
  );
}
