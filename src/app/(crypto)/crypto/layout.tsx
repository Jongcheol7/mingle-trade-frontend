import CryptoNav from "@/modules/crypto/CryptoNav";
import BinanceRealtimePrice from "@/modules/crypto/price/BinanceRealtimePrice";
import { LayoutProp } from "@/types/common";

export default function Layout({ children }: LayoutProp) {
  return (
    <div>
      <CryptoNav />
      <div className="flex gap-3">
        <BinanceRealtimePrice />
        {children}
      </div>
    </div>
  );
}
