"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  children: string;
  href: string;
};

export default function NavLink({ children, href }: Props) {
  const path = usePathname();
  console.log(path);
  return (
    <Link
      href={href}
      className={`className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium" ${
        path === href ? "font-bold text-blue-500 text-xl" : "text-[18px]"
      }`}
    >
      {children}
    </Link>
  );
}
