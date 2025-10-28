"use client";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function HomeMain() {
  const { setUser, clearUser } = useUserStore();
  const searchParam = useSearchParams();
  console.log("searchParam", searchParam.get("tryLogin"));

  useEffect(() => {
    if (!searchParam.get("tryLogin")) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/auth/login", {
          withCredentials: true, //쿠키자동포함
        });
        setUser(res.data);
      } catch (err) {
        toast.error("로그인실패 " + err);
        clearUser();
      }
    };

    fetchUser();
  }, [setUser, clearUser, searchParam]);

  return (
    <section className="fixed w-full h-[100%] flex flex-col justify-center mt-20 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-center bg-gradient-to-b from-amber-50 to-white">
      <h1 className="text-4xl font-bold mb-4">
        세상의 모든 자산이 연결되는 곳
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Mingle Trade에서 암호화폐와 주식 소식을 한눈에
      </p>
    </section>
  );
}
