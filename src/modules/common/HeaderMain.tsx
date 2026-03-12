"use client";
import Image from "next/image";
import NavLink from "./NavLink";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthPopup from "../auth/AuthPopup";
import { AnimatePresence } from "framer-motion";
import { useUserStore } from "@/store/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/lib/api";
import { toast } from "sonner";
import { MessageSquare, Menu, X } from "lucide-react";
import Link from "next/link";

export default function HeaderMain() {
  const router = useRouter();
  const [authVisible, setAuthVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { nickname, profileImage, clearUser } = useUserStore();

  const handleClickAuth = async () => {
    setMobileMenuOpen(false);
    if (nickname) {
      try {
        await api.post("/api/auth/logout");
        clearUser();
        router.push("/");
      } catch {
        toast.error("로그아웃에 실패했습니다.");
      }
    } else {
      setAuthVisible(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image src={"/mingle_logo.png"} alt="로고" width={32} height={32} className="sm:w-9 sm:h-9" />
          <h1 className="font-bold text-lg sm:text-xl text-foreground tracking-tight">
            MingleTrade
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          <NavLink href={"/crypto"}>Crypto</NavLink>
          <NavLink href={"/stock"}>Stock</NavLink>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href={"/chat"}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-muted-foreground" />
          </Link>

          {nickname && (
            <div
              className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push("/auth/mypage")}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={profileImage ?? undefined} />
                <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                  {nickname?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">
                {nickname}
              </span>
            </div>
          )}

          <button
            className="text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            onClick={handleClickAuth}
          >
            {nickname ? "로그아웃" : "로그인"}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-foreground" />
          ) : (
            <Menu className="w-5 h-5 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md">
          <div className="px-4 py-3 flex flex-col gap-1">
            <Link
              href="/crypto"
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Crypto
            </Link>
            <Link
              href="/stock"
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Stock
            </Link>
            <Link
              href="/chat"
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageSquare className="w-4 h-4" />
              채팅
            </Link>

            {nickname && (
              <div
                className="px-3 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/auth/mypage");
                }}
              >
                <Avatar className="w-7 h-7">
                  <AvatarImage src={profileImage ?? undefined} />
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                    {nickname?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground">
                  {nickname}
                </span>
              </div>
            )}

            <button
              className="mt-1 text-sm font-medium px-3 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer text-center"
              onClick={handleClickAuth}
            >
              {nickname ? "로그아웃" : "로그인"}
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {authVisible && <AuthPopup setAuthVisible={setAuthVisible} />}
      </AnimatePresence>
    </header>
  );
}
