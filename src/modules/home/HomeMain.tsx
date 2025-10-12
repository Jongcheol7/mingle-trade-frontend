import BinanceRealtimePrice from "../price/BinanceRealtimePrice";
import HeaderMain from "../common/HeaderMain";

export default function HomeMain() {
  return (
    <div>
      <HeaderMain />
      <BinanceRealtimePrice />
    </div>
  );
}
