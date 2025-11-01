"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUserStore } from "@/store/useUserStore";
import { portfolio } from "@/types/portfolio";
import { useCallback, useMemo, useState } from "react";
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
  const {
    data: portfolio = [],
    isLoading,
    isError,
    error,
  } = usePortfolioSelect(email ?? "");
  const { mutate } = usePortfolioDelete();

  const myEvalSet = useMemo(() => {
    return new Map<number, number>();
  }, []);
  const myBuySet = useMemo(() => {
    return new Map<number, number>();
  }, []);

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
        <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
      </div>
    );
  }

  if (isError) {
    return <div>에러발생: {error.message}</div>;
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div className="text-[18px]">
              <div className="flex gap-3">
                <label>투자금액</label>
                {totalInvValue.toLocaleString()}
              </div>
              <div className="flex gap-3">
                <label>평가금액</label>
                {totalNowValue.toLocaleString()}
              </div>
              <div className="flex gap-3">
                <label>수익률</label>
                {(
                  ((totalNowValue - totalInvValue) / totalInvValue) *
                  100
                ).toFixed(2)}{" "}
                %
              </div>
            </div>
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {portfolio.map((p: portfolio) => (
              <PortfolioDetail
                key={p.id}
                portfolio={p}
                market={market}
                onValueChange={handleValueChange}
                onDelete={() => mutate({ email: email ?? "", id: p.id })}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
