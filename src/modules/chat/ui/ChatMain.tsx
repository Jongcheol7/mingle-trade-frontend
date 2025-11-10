"use client";

import { useChatRoomLists } from "@/hooks/chat/useChatReactQuery";
import ChatRoomLists from "./ChatRoomLists";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUserStore } from "@/store/useUserStore";
import ChatPage from "./ChatPage";

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

  console.log("roomId : ", roomId);

  return (
    <div className="flex min-w-[400px] max-w-[1000px] m-auto">
      <div className="w-[30%] mr-2 ">
        {data && email && (
          <ChatRoomLists roomLists={data} setRoomId={setRoomId} />
        )}
      </div>
      <div className="flex-1">
        {roomId !== 0 && <ChatPage roomId={roomId} />}
      </div>
    </div>
  );
}
