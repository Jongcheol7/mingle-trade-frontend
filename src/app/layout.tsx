import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutProp } from "@/types/common";
import HeaderMain from "@/modules/common/HeaderMain";
import ReactQueryClient from "@/components/common/ReactQueryProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MingleTrade - 세상의 모든 자산이 연결되는 곳",
  description:
    "암호화폐와 주식 실시간 시세, 커뮤니티, 포트폴리오 관리를 한곳에서",
};

export default function RootLayout({ children }: LayoutProp) {
  return (
    <html lang="ko" className="antialiased">
      <ReactQueryClient>
        <body
          className={`${geistSans.variable} ${geistMono.variable} min-h-screen`}
        >
          <HeaderMain />
          <main className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-4 pb-10">
            {children}
          </main>
          <Toaster richColors position="bottom-center" />
        </body>
      </ReactQueryClient>
    </html>
  );
}
