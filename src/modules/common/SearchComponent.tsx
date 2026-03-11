import { Search } from "lucide-react";

type Props = {
  setKeyword: (val: string) => void;
};

export default function SearchComponent({ setKeyword }: Props) {
  return (
    <div
      className="flex items-center gap-2 bg-muted px-2 py-1 rounded-lg border border-border focus-within:border-primary transition"
      style={{ width: "calc(100% - 10px)" }}
    >
      <Search className="w-4 h-4 text-muted-foreground" />
      <input
        className="flex-1 outline-none text-sm placeholder-muted-foreground bg-transparent uppercase"
        type="text"
        placeholder="Search coin..."
        onChange={(e) => setKeyword(e.target.value.toUpperCase())}
      />
    </div>
  );
}
