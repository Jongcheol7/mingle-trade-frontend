"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Check, X } from "lucide-react";
import { usePortfolioInsert } from "@/hooks/crypto/portfolio/usePortfolioReactQuery";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import axios from "axios";
import { UpbitCoinPairs } from "@/types/coin";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type Props = {
  setVisibleNew: (val: boolean) => void;
  market: string;
  email: string;
};
type FormData = {
  enterPrice: number;
  quantity: number;
  email: string;
  symbol: string;
  currency: string;
};

export default function PortfolioNew({ setVisibleNew, market, email }: Props) {
  const { mutate: savingMutate, isSuccess } = usePortfolioInsert();
  const [coinList, setCoinList] = useState<UpbitCoinPairs[]>([]);
  const { register, handleSubmit, setValue, getValues, watch } = useForm({
    defaultValues: {
      email,
      symbol: "",
      enterPrice: 0,
      currency: market === "Upbit" ? "KRW" : "USD",
      quantity: 0,
    },
  });
  const symbolValue = watch("symbol");

  useEffect(() => {
    if (isSuccess) setVisibleNew(false);
  }, [isSuccess, setVisibleNew]);

  // ✅ 코인 심볼 리스트 불러오기 (Upbit or Binance)
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        if (market === "Upbit") {
          const res = await axios.get<UpbitCoinPairs[]>(
            "https://api.upbit.com/v1/market/all?isDetails=false"
          );
          const krwMarkets = res.data.filter((c) =>
            c.market.startsWith("KRW-")
          );
          setCoinList(
            krwMarkets.map((c) => ({
              market: c.market,
              korean_name: c.korean_name,
              english_name: c.english_name,
            }))
          );
        } else if (market === "Binance") {
          const res = await axios.get<{ symbol: string; price: string }[]>(
            "https://api.binance.com/api/v3/ticker/price"
          );

          // USDT 마켓만 필터링 (예: BTCUSDT, ETHUSDT)
          const usdtMarkets = res.data.filter((c) => c.symbol.endsWith("USDT"));

          // 업비트 타입과 맞춰서 일관성 있게 변환
          const formatted = usdtMarkets.map((c) => ({
            market: c.symbol,
            korean_name: "",
            english_name: c.symbol.replace("USDT", ""),
          }));

          setCoinList(formatted);
        }
      } catch (err) {
        console.error(err);
        toast.error(`${market} 코인 목록 불러오기 실패`);
      }
    };

    fetchMarkets();
  }, [market]);

  const handleSave = (data: FormData) => {
    if (!email) {
      toast.error("이메일이 없습니다.");
      return;
    }
    savingMutate({
      enterPrice: data.enterPrice,
      quantity: data.quantity,
      email: data.email,
      symbol: data.symbol,
      currency: data.currency,
    });
  };

  return (
    <div>
      <motion.div
        className="fixed z-50 top-1/2 left-1/2 w-[380px] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Card className="relative bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl">
          <form onSubmit={handleSubmit(handleSave)}>
            {/* 닫기 버튼 */}
            <button
              onClick={() => setVisibleNew(false)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <CardHeader>
              <h2 className="text-xl font-semibold text-center">
                신규 코인 추가
              </h2>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <label className="w-[100px] text-sm text-gray-600">
                  거래소
                </label>
                <Input value={market} readOnly className="bg-gray-100 flex-1" />
              </div>

              {/* ✅ 심볼 셀렉트 */}
              <div className="flex items-start gap-3">
                <label className="w-[100px] text-sm text-gray-600 mt-2">
                  심볼
                </label>
                <div className="flex-1">
                  <Command className="border rounded-md">
                    <CommandInput
                      placeholder="코인명 또는 심볼 검색..."
                      value={symbolValue}
                      onValueChange={(val) => setValue("symbol", val)}
                    />
                    <CommandList className="max-h-[200px] overflow-y-auto">
                      <CommandEmpty>결과가 없습니다.</CommandEmpty>
                      {coinList.map((coin) => (
                        <CommandItem
                          key={coin.market}
                          onSelect={() => {
                            const value =
                              market === "Upbit"
                                ? coin.market.replace(/^KRW-/, "")
                                : coin.market.replace(/USDT$/, "");
                            setValue("symbol", value);
                          }}
                        >
                          <div className="flex justify-between w-full">
                            <span>
                              {coin.korean_name ||
                                coin.english_name ||
                                coin.market}
                            </span>
                            <span className="text-gray-400 text-xs">
                              {market === "Upbit"
                                ? coin.market.replace(/^KRW-/, "")
                                : coin.market.replace(/USDT$/, "")}
                            </span>
                          </div>
                          {getValues("symbol") ===
                            (market === "Upbit"
                              ? coin.market.replace(/^KRW-/, "")
                              : coin.market.replace(/USDT$/, "")) && (
                            <Check className="ml-2 h-4 w-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="w-[100px] text-sm text-gray-600">
                  평균매수가
                </label>
                <Input
                  required
                  {...register("enterPrice")}
                  className=" flex-1"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="w-[100px] text-sm text-gray-600">수량</label>
                <Input required {...register("quantity")} className=" flex-1" />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setVisibleNew(false)}
                className="rounded-lg"
              >
                취소
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                추가
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>

      <motion.div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={() => setVisibleNew(false)}
      />
    </div>
  );
}
