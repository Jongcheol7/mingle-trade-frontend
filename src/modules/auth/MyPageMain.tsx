"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import axios from "axios";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
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

  const handleNicknameChange = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/user/update/nickname",
        {
          nickname: newNickname,
          email,
        }
      );
      if (res.data === "success") {
        setUser({ nickname: newNickname });
        toast.success("닉네임이 변경되었습니다.");
      } else {
        toast.error("닉네임 변경 실패");
      }
    } catch (err) {
      toast.error("닉네임 변경 실패 " + err);
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/logout", null, {
        withCredentials: true, //쿠키포함
      });
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

      //기존 프로필 삭제 + DB갱신
      const updateRes = await axios.post(
        "http://localhost:8080/api/user/update/profileImage",
        { email, imageUrl: fileUrl }
      );

      if (updateRes.data === "success") {
        //zustand 갱신
        setUser({ profileImage: fileUrl });
        toast.success("프로필 이미지가 변경되었습니다.");
      } else {
        toast.error("DB 업데이트 실패");
      }
    } catch (err) {
      console.error("handleProfileImage 에러:", err);
      toast.error("프로필 변경 실패: " + err);
    }
  };

  return (
    <div className="flex justify-center mt-16">
      <Card className="w-full max-w-[600px] border-none shadow-lg rounded-2xl bg-gradient-to-b from-white to-amber-50">
        <CardHeader className="relative flex flex-col items-center gap-2 pb-2">
          <button
            className="absolute z-50 top-8 left-1/2 translate-x-10 text-gray-500 hover:text-black cursor-pointer"
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
          <p className="text-gray-500 text-sm">마이페이지 ✨</p>
          <Avatar className=" w-28 h-28 border-4 border-white shadow-md">
            <AvatarImage src={profileImage || "/default_profile.png"} />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-amber-300 to-yellow-400 text-white">
              {nickname?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-semibold text-gray-800 mt-3">
            {nickname ? `${nickname}님` : "닉네임 미설정"}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 mt-4">
          {/* 닉네임 변경 섹션 */}
          <div>
            <label className="text-gray-600 font-medium text-sm">
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
                className="px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-500 text-white font-semibold transition-all duration-200"
              >
                변경
              </button>
            </div>
          </div>

          {/* 로그아웃 버튼 */}
          <div className="flex justify-center mt-4">
            <button
              className="px-5 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition-all duration-200"
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
