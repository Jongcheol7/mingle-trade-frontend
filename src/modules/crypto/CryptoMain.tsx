import HeaderMain from "../common/HeaderMain";
import CrytpNav from "./CryptoNav";
import BinanceRealtimePrice from "./price/BinanceRealtimePrice";

export default function CryptoMain() {
  return (
    <div>
      <HeaderMain />
      <CrytpNav />
      <BinanceRealtimePrice />
    </div>
  );
}
