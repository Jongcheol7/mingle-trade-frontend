"use client";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { TrendingUp, Users, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: TrendingUp,
    title: "실시간 시세",
    desc: "Binance, Upbit 실시간 가격을 한눈에 확인",
    href: "/crypto/chart",
  },
  {
    icon: Users,
    title: "커뮤니티",
    desc: "투자자들과 자유롭게 정보 교환",
    href: "/crypto/freeboard",
  },
  {
    icon: BarChart3,
    title: "포트폴리오",
    desc: "내 보유 자산의 수익률을 실시간 추적",
    href: "/crypto/portfolio",
  },
];

export default function HomeMain() {
  const { setUser, clearUser } = useUserStore();
  const searchParam = useSearchParams();

  useEffect(() => {
    if (!searchParam.get("tryLogin")) return;

    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/login");
        setUser(res.data);
      } catch (err) {
        toast.error("로그인실패 " + err);
        clearUser();
      }
    };

    fetchUser();
  }, [setUser, clearUser, searchParam]);

  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section className="text-center py-12 sm:py-20 max-w-2xl px-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
          세상의 모든 자산이
          <br />
          <span className="text-primary">연결되는 곳</span>
        </h1>
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
          암호화폐 실시간 시세, 뉴스, 커뮤니티, 포트폴리오 관리까지
          <br className="hidden sm:block" />
          MingleTrade에서 한번에
        </p>
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/crypto/freeboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            시작하기
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/crypto/news"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors"
          >
            뉴스 보기
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl pb-12 sm:pb-20 px-4 sm:px-0">
        {features.map((f) => (
          <Link
            key={f.title}
            href={f.href}
            className="group flex flex-col items-center text-center p-8 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {f.title}
            </h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
