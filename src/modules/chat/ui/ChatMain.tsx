"use client";

import { useChatRoomLists } from "@/hooks/chat/useChatReactQuery";
import ChatRoomLists from "./ChatRoomLists";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useUserStore } from "@/store/useUserStore";

export default function ChatMain() {
  const { email } = useUserStore();
  const { data } = useChatRoomLists(email ?? "");
  const router = useRouter();

  useEffect(() => {
    if (!email) {
      toast.error("로그인 정보가 없습니다.");
      router.push("/");
    }
  }, [email, router]);

  return (
    <div className="flex">
      <div className="w-[37%] mr-2">
        {data && email && <ChatRoomLists roomLists={data} />}
      </div>
      <div className="flex-1">
        {/* {roomInfo && (
          <ChatPage
            roomInfo={roomInfo}
            email={email!}
            setRoomInfo={setRoomInfo}
          />
        )} */}
      </div>
    </div>
  );
}
