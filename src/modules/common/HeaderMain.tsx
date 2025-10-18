"use client";
import Image from "next/image";
import NavLink from "./NavLink";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthPopup from "../auth/AuthPopup";
import { AnimatePresence } from "framer-motion";

export default function HeaderMain() {
  const router = useRouter();
  const [authVisible, setAuthVisible] = useState(false);
  return (
    <div className="flex items-center justify-between mb-8">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image src={"/mingle_logo.png"} alt="로고" width={50} height={50} />
        <h1 className="font-bold text-2xl">Mingle Trade</h1>
      </div>
      <div className="flex gap-3 absolute left-1/2 -translate-x-1/2">
        <NavLink href={"/crypto"}>Crypto</NavLink>
        <NavLink href={"/stock"}>Stock</NavLink>
      </div>
      <button
        className="font-bold text-xl cursor-pointer"
        onClick={() => setAuthVisible(true)}
      >
        Login
      </button>
      <AnimatePresence>
        {authVisible && <AuthPopup setAuthVisible={setAuthVisible} />}
      </AnimatePresence>
    </div>
  );
}
