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
    <nav className="flex justify-center border-b mb-3 bg-gradient-to-r from-amber-50 to-amber-100/70 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex gap-10 h-12 items-center">
        {menus.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            className={cn(
              "relative font-medium text-amber-800 transition-all duration-200 hover:text-amber-600",
              pathname.includes(menu.href) && "text-amber-600 font-semibold"
            )}
          >
            {menu.name}
            {/* 밑줄 애니메이션 */}
            <span
              className={cn(
                "absolute left-0 -bottom-1 h-[2px] w-0 bg-amber-600 transition-all duration-300",
                pathname.includes(menu.href) && "w-full"
              )}
            ></span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
