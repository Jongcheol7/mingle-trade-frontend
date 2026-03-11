"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUserStore } from "@/store/useUserStore";
import { portfolio } from "@/types/portfolio";
import { useCallback, useEffect, useState } from "react";
import PortfolioDetail from "./PortfolioDetail";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCryptoMarketStore } from "@/store/useCryptoMarketStore";
import {
  usePortfolioDelete,
  usePortfolioSelect,
} from "@/hooks/crypto/portfolio/usePortfolioReactQuery";
import { Loader2 } from "lucide-react";
import PortfolioNew from "./PortfolioNew";
import { AnimatePresence } from "framer-motion";

type ObjType = {
  evalAmount: {
    id: number;
    evalAmount: number;
  };
  buyAmount: {
    id: number;
    buyAmount: number;
  };
};

export default function PortfolioMain() {
  const { email } = useUserStore();
  const { market, setMarket } = useCryptoMarketStore();
  const [totalNowValue, setTotalNowValue] = useState<number>(0);
  const [totalInvValue, setTotalInvValue] = useState(0);
  const [myEvalSet, setMyEvalSet] = useState(new Map<number, number>());
  const [myBuySet, setMyBuySet] = useState(new Map<number, number>());
  const [visibleNew, setVisibleNew] = useState(false);
  const {
    data: portfolio = [],
    isLoading,
    isError,
    error,
    refetch,
  } = usePortfolioSelect(email ?? "", market == "Upbit" ? "KRW" : "USD");
  const { mutate } = usePortfolioDelete();

  useEffect(() => {
    setMyEvalSet(new Map());
    setMyBuySet(new Map());

    if (portfolio.length === 0) {
      setTotalNowValue(0);
      setTotalInvValue(0);
    }
  }, [market, portfolio]);

  const handleValueChange = useCallback(
    (obj: ObjType) => {
      myEvalSet.set(obj.evalAmount.id, obj.evalAmount.evalAmount);
      let evalSum = 0;
      myEvalSet.forEach((price) => (evalSum += price));
      setTotalNowValue(evalSum);

      myBuySet.set(obj.buyAmount.id, obj.buyAmount.buyAmount);
      let buySum = 0;
      myBuySet.forEach((price) => (buySum += price));
      setTotalInvValue(buySum);
    },
    [myEvalSet, myBuySet]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center w-full items-center">
        <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return <div>에러발생: {error.message}</div>;
  }

  return (
    <div>
      <Card className="pt-0">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted border-b border-border rounded-t-xl py-3 px-4 sm:px-5">
          {/* 왼쪽: 총 자산 요약 */}
          <div className="flex flex-col gap-1 text-[16px]">
            <div className="flex justify-between gap-6">
              <span className="text-muted-foreground font-medium">투자금액</span>
              <span className="font-semibold text-foreground">
                {totalInvValue.toLocaleString()} KRW
              </span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-muted-foreground font-medium">평가금액</span>
              <span className="font-semibold text-foreground">
                {totalNowValue.toLocaleString()} KRW
              </span>
            </div>

            <div className="flex justify-between gap-6">
              <span className="text-muted-foreground font-medium">수익률</span>
              <span
                className={`font-bold ${
                  totalNowValue - totalInvValue > 0
                    ? "text-emerald-500"
                    : totalNowValue - totalInvValue < 0
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {totalInvValue > 0
                  ? `${(
                      ((totalNowValue - totalInvValue) / totalInvValue) *
                      100
                    ).toFixed(2)} %`
                  : "-"}
              </span>
            </div>
          </div>

          {/* 오른쪽: 거래소 선택 */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground font-medium">
                거래소 선택
              </label>
              <Select
                onValueChange={(value: "Upbit" | "Binance") => {
                  setMarket(value);
                  refetch();
                }}
              >
                <SelectTrigger className="w-[120px] text-black font-bold border-border focus:ring-2 focus:ring-primary/30">
                  <SelectValue placeholder={market} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Upbit">Upbit</SelectItem>
                  <SelectItem value="Binance">Binance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <button
              className="self-end py-1.5 px-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 cursor-pointer transition-colors"
              onClick={() => setVisibleNew(true)}
            >
              신규추가
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {portfolio.map((p: portfolio) => (
              <PortfolioDetail
                key={p.id}
                portfolio={p}
                market={market}
                onValueChange={handleValueChange}
                onDelete={() =>
                  mutate({
                    email: email ?? "",
                    id: p.id,
                    currency: market === "Upbit" ? "KRW" : "USD",
                  })
                }
              />
            ))}
          </div>
        </CardContent>
      </Card>
      <AnimatePresence>
        {visibleNew && (
          <PortfolioNew
            setVisibleNew={setVisibleNew}
            market={market}
            email={email ?? ""}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
