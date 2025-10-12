import { Search } from "lucide-react";

type Props = {
  setKeyword: (val: string) => void;
};

export default function SearchComponent({ setKeyword }: Props) {
  return (
    <div
      className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded-lg border border-gray-300 focus-within:border-blue-400 transition"
      style={{ width: "calc(100% - 10px)" }}
    >
      <Search className="w-4 h-4 text-gray-400" />
      <input
        className="flex-1 outline-none text-sm placeholder-gray-400 bg-transparent uppercase"
        type="text"
        placeholder="Search coin..."
        onChange={(e) => setKeyword(e.target.value.toUpperCase())}
      />
    </div>
  );
}
