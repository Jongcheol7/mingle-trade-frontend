"use client";

import { useChatRoomLists } from "@/hooks/chat/useChatReactQuery";
import ChatRoomLists from "./ChatRoomLists";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUserStore } from "@/store/useUserStore";
import ChatPage from "./ChatPage";
import { MessageSquare } from "lucide-react";

export default function ChatMain() {
  const { email } = useUserStore();
  const { data } = useChatRoomLists(email ?? "");
  const router = useRouter();
  const [roomId, setRoomId] = useState(0);

  useEffect(() => {
    if (!email) {
      toast.error("로그인 정보가 없습니다.");
      router.push("/");
    }
  }, [email, router]);

  return (
    <div className="flex flex-col md:flex-row max-w-[1000px] mx-auto gap-4 h-[calc(100vh-120px)]">
      <aside className={`w-full md:w-[280px] shrink-0 ${roomId !== 0 ? "hidden md:block" : ""}`}>
        {data && email && (
          <ChatRoomLists roomLists={data} setRoomId={setRoomId} />
        )}
      </aside>
      <div className={`flex-1 min-w-0 ${roomId === 0 ? "hidden md:block" : ""}`}>
        {roomId !== 0 ? (
          <div className="h-full flex flex-col">
            <button
              className="md:hidden text-sm text-primary font-medium px-3 py-2 self-start mb-2"
              onClick={() => setRoomId(0)}
            >
              ← 목록으로
            </button>
            <ChatPage roomId={roomId} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">채팅방을 선택해주세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
