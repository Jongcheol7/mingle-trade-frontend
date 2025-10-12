import HeaderMain from "../common/HeaderMain";
import StockNav from "./StockNav";

export default function StockMain() {
  return (
    <div>
      <HeaderMain />
      <StockNav />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">
        <p>작업 준비중입니다...</p>
      </div>
    </div>
  );
}
