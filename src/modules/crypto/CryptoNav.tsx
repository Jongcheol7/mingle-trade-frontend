"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function CryptoNav() {
  const pathname = usePathname();

  const menus = [
    { name: "코인뉴스", href: "/crypto/news" },
    { name: "자유게시판", href: "/crypto/freeboard" },
    { name: "차트", href: "/crypto/chart" },
    { name: "포트폴리오", href: "/crypto/portfolio" },
  ];

  return (
    <nav className="flex gap-1 mb-4 sm:mb-5 bg-muted/50 p-1 rounded-xl w-full sm:w-fit overflow-x-auto">
      {menus.map((menu) => (
        <Link
          key={menu.href}
          href={menu.href}
          className={cn(
            "flex-1 sm:flex-none text-center px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
            pathname.includes(menu.href)
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {menu.name}
        </Link>
      ))}
    </nav>
  );
}
