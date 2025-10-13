"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  children: string;
  href: string;
};

export default function NavLink({ children, href }: Props) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`relative font-medium text-xl text-amber-800 transition-all duration-200 hover:text-amber-600 
        ${pathname.includes(href) ? "text-amber-600 font-semibold" : ""}`}
    >
      {children}
    </Link>
  );
}
