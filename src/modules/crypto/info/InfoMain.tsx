"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { useEffect, useState } from "react";

type Props = {
  symbol: string; // 예: 'bitcoin', 'ethereum', 'solana'
};

export default function InfoMain({ symbol }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [coin, setCoin] = useState<any>(null);
  const [lang, setLang] = useState<"ko" | "en">("en"); // 🇰🇷🇺🇸 선택
  const [currency, setCurrency] = useState<"usd" | "krw">("usd"); // 통화 단위

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/coins/bitcoin`
        );
        setCoin(res.data);
      } catch (err: unknown) {
        console.error("코인 데이터 불러오기 실패:", err);
      }
    };

    fetchCoinData();
  }, [symbol]);

  if (!coin) return <div className="p-6 text-muted-foreground">Loading...</div>;

  const data = coin.market_data;

  // 💡 언어별 설명 처리
  const description =
    lang === "ko"
      ? coin.description?.ko || "설명 정보가 없습니다."
      : coin.description?.en || "Description not available.";

  // 💡 통화별 금액 처리
  const currentPrice =
    currency === "krw" ? data.current_price.krw : data.current_price.usd;

  const marketCap =
    currency === "krw" ? data.market_cap.krw : data.market_cap.usd;

  const currencySymbol = currency === "krw" ? "₩" : "$";

  // 💡 긴 숫자에 대한 locale format (자동 자릿수 구분)
  const formatNumber = (num: number) =>
    num?.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-card border border-border rounded-2xl shadow-md space-y-6 text-foreground transition-all">
      {/* 헤더 */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border shadow-md">
            <AvatarImage src={coin.image.large || "/default_profile.png"} />
            <AvatarFallback className="text-2xl font-bold bg-muted text-muted-foreground">
              {coin.symbol.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {coin.name}
              <span className="text-muted-foreground text-sm uppercase">
                ({coin.symbol})
              </span>
            </h2>
            <p className="text-sm text-muted-foreground">
              출시일: {coin.genesis_date || "정보 없음"} | 알고리즘:{" "}
              {coin.hashing_algorithm || "N/A"}
            </p>
          </div>
        </div>
        {/* 언어 / 통화 선택 */}
        <div className="flex gap-2">
          <select
            className="border border-border rounded-md px-3 py-1 text-sm bg-card"
            value={lang}
            onChange={(e) => setLang(e.target.value as "ko" | "en")}
          >
            <option value="en">🇺🇸 English</option>
            <option value="ko">🇰🇷 한국어</option>
          </select>

          <select
            className="border border-border rounded-md px-3 py-1 text-sm bg-card"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as "usd" | "krw")}
          >
            <option value="usd">USD ($)</option>
            <option value="krw">KRW (₩)</option>
          </select>
        </div>
      </div>

      {/* 시세 정보 */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-muted p-4 rounded-xl min-w-[150px]">
          <p className="text-xs text-muted-foreground">
            현재가 ({currency.toUpperCase()})
          </p>
          <p className="text-lg font-semibold break-words">
            {currencySymbol}
            {formatNumber(currentPrice)}
          </p>
        </div>
        <div className="bg-muted p-4 rounded-xl min-w-[250px]">
          <p className="text-xs text-muted-foreground">시가총액</p>
          <p className="text-lg font-semibold break-words">
            {currencySymbol}
            {formatNumber(marketCap)}
          </p>
        </div>
        <div className="bg-muted p-4 rounded-xl min-w-[150px]">
          <p className="text-xs text-muted-foreground">유통량</p>
          <p className="text-lg font-semibold break-words">
            {formatNumber(data.circulating_supply)}
          </p>
        </div>
        <div className="bg-muted p-4 rounded-xl min-w-[150px]">
          <p className="text-xs text-muted-foreground">총 발행량</p>
          <p className="text-lg font-semibold break-words">
            {formatNumber(data.total_supply) ?? "정보 없음"}
          </p>
        </div>
      </div>

      {/* 설명 */}
      <div>
        <h3 className="text-lg font-semibold mb-2">
          {lang === "ko" ? "설명" : "Description"}
        </h3>
        <p
          className="text-sm leading-relaxed text-foreground"
          dangerouslySetInnerHTML={{
            __html:
              description.replace(/<\/?a[^>]*>/g, "").split(". ")[0] + ".",
          }}
        ></p>
      </div>

      {/* 링크 */}
      <div>
        <h3 className="text-lg font-semibold mb-2">
          {lang === "ko" ? "관련 링크" : "Links"}
        </h3>
        <div className="flex flex-wrap gap-3 text-sm">
          {coin.links.homepage[0] && (
            <a
              href={coin.links.homepage[0]}
              target="_blank"
              className="text-primary hover:underline"
            >
              {lang === "ko" ? "공식 홈페이지" : "Official Site"}
            </a>
          )}
          {coin.links.whitepaper && (
            <a
              href={coin.links.whitepaper}
              target="_blank"
              className="text-primary hover:underline"
            >
              {lang === "ko" ? "백서" : "Whitepaper"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
