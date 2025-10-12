import Link from "next/link";

type Props = {
  children: string;
  href: string;
  main: string;
  setMain: (val: string) => void;
};

export default function NavLink({ children, href, main, setMain }: Props) {
  return (
    <Link
      href={href}
      className={`${
        main === children ? "font-bold text-blue-500 text-xl" : ""
      }`}
      onClick={() => setMain(children)}
    >
      {children}
    </Link>
  );
}
