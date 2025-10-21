"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function MyPageMain() {
  const [hydrated, setHydrated] = useState(false);
  const { nickname, profileImage, setUser, email } = useUserStore();
  const [newNickname, setNewNickname] = useState(nickname ?? "");

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

  return (
    <div className="flex justify-center mt-16">
      <Card className="w-full max-w-[600px] border-none shadow-lg rounded-2xl bg-gradient-to-b from-white to-amber-50">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <p className="text-gray-500 text-sm">마이페이지 ✨</p>
          <Avatar className="w-28 h-28 border-4 border-white shadow-md">
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
            <button className="px-5 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition-all duration-200">
              로그아웃
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
