"use client";
import { useUserStore } from "@/store/useUserStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  email?: string;
  name?: string;
  picture?: string;
  provider?: string;
  nickname?: string;
  profileImage?: string;
}

export default function HomeMain() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { setUser } = useUserStore();

  useEffect(() => {
    if (token) {
      //JWT 토큰을 localStorage에 저장
      localStorage.setItem("accessToken", token);

      //JWT 해석 및 분해
      const decoded = jwtDecode<CustomJwtPayload>(token);

      console.log("decoded : ", decoded);

      //필요하다면 Zustand에도 사용자 상태 저장하자. (추후 TO-DO)
      setUser({
        token,
        email: decoded.sub || null,
        name: decoded.name || null,
        picture: decoded.picture || null,
        provider: decoded.provider || null,
        nickname: decoded.nickname || null,
        profileImage: decoded.profileImage || null,
      });

      router.replace("/");
    }
  }, [token, router, setUser]);

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
