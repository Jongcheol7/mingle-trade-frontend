"use client";
import CryptoNav from "@/modules/crypto/CryptoNav";
import BinanceRealtimePrice from "@/modules/crypto/price/BinanceRealtimePrice";
import UpbitRealtimePrice from "@/modules/crypto/price/UpbitRealtimePrice";
import { useCryptoMarketStore } from "@/store/useCryptoMarketStore";
import { LayoutProp } from "@/types/common";

export default function Layout({ children }: LayoutProp) {
  const { market } = useCryptoMarketStore();
  return (
    <div>
      <CryptoNav />
      <div className="flex gap-3">
        {market === "Upbit" ? <UpbitRealtimePrice /> : <BinanceRealtimePrice />}
        {children}
      </div>
    </div>
  );
}
