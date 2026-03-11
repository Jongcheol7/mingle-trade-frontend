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
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">
        <aside className="w-full lg:w-[420px] shrink-0 max-h-[300px] lg:max-h-none overflow-auto">
          {market === "Upbit" ? (
            <UpbitRealtimePrice />
          ) : (
            <BinanceRealtimePrice />
          )}
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
