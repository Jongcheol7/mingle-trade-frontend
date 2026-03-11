"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  children: string;
  href: string;
};

export default function NavLink({ children, href }: Props) {
  const pathname = usePathname();
  const isActive = pathname.includes(href);

  return (
    <Link
      href={href}
      className={`relative text-sm font-medium transition-colors py-1
        ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
    >
      {children}
      {isActive && (
        <span className="absolute left-0 -bottom-[21px] w-full h-[2px] bg-primary" />
      )}
    </Link>
  );
}
