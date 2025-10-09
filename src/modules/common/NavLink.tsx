import Link from "next/link";

export default function NavLink({ children, href }) {
  return <Link href={href}>{children}</Link>;
}
