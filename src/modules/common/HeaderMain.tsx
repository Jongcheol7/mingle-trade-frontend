"use client";
import Image from "next/image";
import NavLink from "./NavLink";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthPopup from "../auth/AuthPopup";
import { AnimatePresence } from "framer-motion";
import { useUserStore } from "@/store/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HeaderMain() {
  const router = useRouter();
  const [authVisible, setAuthVisible] = useState(false);
  const { nickname, profileImage } = useUserStore();

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
      <div className="flex items-center gap-3">
        <div
          className="flex gap-1 items-center cursor-pointer"
          onClick={() => router.push("/auth/mypage")}
        >
          <Avatar>
            <AvatarImage src={profileImage ?? undefined} />
            <AvatarFallback> </AvatarFallback>
          </Avatar>
          <p>{nickname ? nickname + "님" : ""}</p>
        </div>
        <button
          className="font-bold text-xl cursor-pointer"
          onClick={() => setAuthVisible(true)}
        >
          {nickname ? "Logout" : "Login"}
        </button>
      </div>
      <AnimatePresence>
        {authVisible && <AuthPopup setAuthVisible={setAuthVisible} />}
      </AnimatePresence>
    </div>
  );
}
