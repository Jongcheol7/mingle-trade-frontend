import { ChevronDown, ChevronUp } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type SortButtonProps = {
  children: string; // 화면에 표시될 컬럼명 ex) "현재가"
  column: "symbol" | "price" | "rate" | "volume"; // 실제 정렬 기준 key ex) "price"
  sortKey: "symbol" | "price" | "rate" | "volume";
  sortOrder: string;
  setSortKey: Dispatch<SetStateAction<"symbol" | "price" | "rate" | "volume">>;
  setSortOrder: (val: string) => void;
};

export default function BinanceRealTimeLabel({
  children,
  column,
  sortKey,
  sortOrder,
  setSortKey,
  setSortOrder,
}: SortButtonProps) {
  const handleClick = () => {
    if (sortKey === column) {
      // 이미 선택된 컬럼이면 방향만 토글
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // 다른 컬럼 클릭 시 정렬 기준 변경
      setSortKey(column);
      setSortOrder("asc");
    }
  };

  const isActive = sortKey === column;

  return (
    <div
      className="flex gap-1 cursor-pointer hover:text-blue-600 transition select-none justify-end"
      onClick={handleClick}
    >
      <span>{children}</span>
      {isActive ? (
        sortOrder === "asc" ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronUp className="w-3 h-3" />
        )
      ) : (
        <ChevronDown className="w-3 h-3 opacity-20" /> // 비활성 상태 표시
      )}
    </div>
  );
}
