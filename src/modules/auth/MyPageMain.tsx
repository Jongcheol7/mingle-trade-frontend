"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import api from "@/lib/api";
import axios from "axios";
import { Settings } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import FileToS3 from "../common/FileToS3";
import imageCompression from "browser-image-compression";

export default function MyPageMain() {
  const [hydrated, setHydrated] = useState(false);
  const { nickname, profileImage, email, setUser, clearUser } = useUserStore();
  const [newNickname, setNewNickname] = useState(nickname ?? "");
  const router = useRouter();
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;

  if (!email) {
    toast.success("로그인 후 이용 가능합니다.");
    redirect("/");
  }

  const handleNicknameChange = async () => {
    try {
      const res = await api.post("/api/user/update/nickname", {
        nickname: newNickname,
        email,
      });
      if (res.data === "success") {
        setUser({ nickname: newNickname });
        toast.success("닉네임이 변경되었습니다.");
      } else {
        toast.error("닉네임 변경 실패");
      }
    } catch {
      toast.error("닉네임 변경에 실패했습니다.");
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      clearUser();
      router.push("/");
    } catch (err) {
      toast.error("로그아웃 실패" + err);
    }
  };

  const handleProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    });

    try {
      const url = await FileToS3(compressedFile, "profile");
      const uploadRes = await axios.put(url, compressedFile, {
        headers: {
          "Content-Type": compressedFile.type,
        },
      });

      if (uploadRes.status !== 200 && uploadRes.status !== 204) {
        throw new Error("S3 업로드 실패");
      }

      const fileUrl = url
        .split("?")[0]
        .replace(
          process.env.NEXT_PUBLIC_S3_BASE_URL,
          process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN
        );

      const updateRes = await api.post("/api/user/update/profileImage", {
        email,
        imageUrl: fileUrl,
      });

      if (updateRes.data === "success") {
        setUser({ profileImage: fileUrl });
        toast.success("프로필 이미지가 변경되었습니다.");
      } else {
        toast.error("DB 업데이트 실패");
      }
    } catch {
      toast.error("프로필 이미지 변경에 실패했습니다.");
    }
  };

  return (
    <div className="flex justify-center mt-16">
      <Card className="w-full max-w-[600px] border border-border shadow-lg rounded-2xl">
        <CardHeader className="relative flex flex-col items-center gap-2 pb-2">
          <button
            className="absolute z-50 top-8 left-1/2 translate-x-10 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => imageRef.current?.click()}
          >
            <Settings />
          </button>
          <input
            type="file"
            className="hidden"
            onChange={handleProfileImage}
            accept="image/*"
            ref={imageRef}
          />
          <p className="text-muted-foreground text-sm">마이페이지</p>
          <Avatar className="w-28 h-28 border-4 border-border shadow-md">
            <AvatarImage src={profileImage || "/default_profile.png"} />
            <AvatarFallback className="text-2xl font-bold bg-muted text-muted-foreground">
              {nickname?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-semibold text-foreground mt-3">
            {nickname ? `${nickname}님` : "닉네임 미설정"}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 mt-4">
          <div>
            <label className="text-muted-foreground font-medium text-sm">
              닉네임 변경
            </label>
            <div className="flex gap-3 mt-2">
              <Input
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                placeholder="새 닉네임 입력"
                className="flex-1"
              />
              <button
                onClick={handleNicknameChange}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-colors"
              >
                변경
              </button>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              className="px-5 py-2 border border-border bg-muted font-semibold rounded-md text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
