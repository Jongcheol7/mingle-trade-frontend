"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUserStore } from "@/store/useUserStore";
import { portfolio } from "@/types/portfolio";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import PortfolioDetail from "./PortfolioDetail";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCryptoMarketStore } from "@/store/useCryptoMarketStore";

export default function PortfolioMain() {
  const { email } = useUserStore();
  const [portfolio, setPortfolio] = useState<portfolio[]>([]);
  const { market, setMarket } = useCryptoMarketStore();
  const [totalValue, setTotalValue] = useState<number>();

  const handleValueChange = useCallback((id, value) => {
    setTotalValue((prev) => {
      valueMap.set(id, value);
      let sum = 0;
      valueMap.forEach((v) => (sum += v));
      return sum;
    });
  }, []);

  const valueMap = new Map<number, number>();

  useEffect(() => {
    if (!email) return;

    try {
      const getMyPortfolio = async () => {
        const res = await axios.get(
          "http://localhost:8080/api/portfolio/select",
          {
            params: { email },
          }
        );
        console.log(res.data);
        setPortfolio(res.data);
        return res.data;
      };
      getMyPortfolio();
    } catch (err) {
      toast.error("포트폴리오 조회 실패 " + err);
    }
  }, [email]);

  return (
    <div>
      <Card>
        <CardHeader>
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
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            {portfolio.map((p) => (
              <PortfolioDetail key={p.id} portfolio={p} market={market} />
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
