import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UpbitCoinPairs } from "@/types/coin";
import { portfolio } from "@/types/portfolio";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  portfolio: portfolio;
  market: "Upbit" | "Binance";
};

type Info = {
  label: string;
  value: string | number;
};

export default function PortfolioDetail({ portfolio, market }: Props) {
  const [infos, setInfos] = useState<Info[]>([]);
  const [korName, setKorName] = useState("");
  const [engName, setEngName] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [changeRate, setChangeRate] = useState<number | null>(null); // 전일 대비 등락률

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
              pair.market.startsWith("KRW-") &&
              pair.market.endsWith(portfolio.symbol.toUpperCase())
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
          const res = await axios.get(
            `https://api.binance.com/api/v3/ticker/24hr?symbol=${portfolio.symbol}`
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
      } catch (err) {
        console.error("시세 불러오기 실패:", err);
      }
    };

    getPriceInfo();
  }, [market, portfolio]);

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
    <Card>
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

      <CardContent>
        {infos.map((info) => (
          <div key={info.label} className="flex justify-between py-1">
            <label className="text-gray-500">{info.label}</label>
            <p className="font-medium">{info.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
