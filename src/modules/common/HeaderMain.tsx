"use client";
import Image from "next/image";
import NavLink from "./NavLink";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthPopup from "../auth/AuthPopup";
import { AnimatePresence } from "framer-motion";
import { useUserStore } from "@/store/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

export default function HeaderMain() {
  const router = useRouter();
  const [authVisible, setAuthVisible] = useState(false);
  const { nickname, profileImage, clearUser } = useUserStore();

  const handleClickAuth = async () => {
    if (nickname) {
      try {
        await axios.post("http://localhost:8080/api/auth/logout", null, {
          withCredentials: true, //쿠키포함
        });
        clearUser();
        router.push("/");
      } catch (err) {
        toast.error("로그아웃 실패");
        console.error("로그아웃 실패 : ", err);
      }
    } else {
      setAuthVisible(true);
    }
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image src={"/mingle_logo.png"} alt="로고" width={50} height={50} />
        <h1 className="font-bold text-2xl">MingleTrade</h1>
      </div>
      <div className="flex gap-3 absolute left-1/2 -translate-x-1/2">
        <NavLink href={"/crypto"}>Crypto</NavLink>
        <NavLink href={"/stock"}>Stock</NavLink>
      </div>
      <div className="flex items-center gap-3">
        <Link href={"/chat"}>
          <MessageSquare className="w-5 h-5 text-gray-600" />
        </Link>
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
          onClick={handleClickAuth}
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
