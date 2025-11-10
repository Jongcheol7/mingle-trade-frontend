"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useChatMessage } from "@/hooks/chat/useChatReactQuery";
import useSocket from "@/hooks/chat/useSocket";
import AvartarModule from "@/modules/common/AvartarModule";
import { timeTransform } from "@/modules/common/TimeTransform";
import { useUserStore } from "@/store/useUserStore";
import { MessageType } from "@/types/chat";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

type Props = {
  roomId: number;
};

export default function ChatPage({ roomId }: Props) {
  const socketRef = useSocket();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const { email: senderEmail, nickname: senderNickname } = useUserStore();
  const [receiverUrl, setReceiverUrl] = useState("");
  const [receiverNickname, setReceiverNickname] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  // ✅ 1. 무한스크롤 (채팅 내역)
  const { data, isSuccess, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useChatMessage(roomId, "", "");

  // ✅ 2. 쿼리 새로고침 (방 바뀔 때)
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["directMessages", roomId] });
  }, [roomId, queryClient]);

  // ✅ 3. 데이터 구성
  useEffect(() => {
    if (!isSuccess || !data?.pages) return;

    // 채팅은 최신 메시지가 아래에 위치하도록 (reverse 제거)
    const allMessages = data.pages.flatMap((page) => page.data || []);
    const members = data.pages.flatMap((page) => page.member || []);

    const receiverInfo = members.find((m) => m.email !== senderEmail);
    if (receiverInfo) {
      setReceiverUrl(receiverInfo.profile_image);
      setReceiverNickname(receiverInfo.nickname);
      setReceiverEmail(receiverInfo.email);
    }

    setMessages(allMessages);
  }, [data, isSuccess, senderEmail]);

  // ✅ 4. 초기 진입 시 스크롤 맨 아래로
  const initialLoad = useRef(true);
  useEffect(() => {
    if (initialLoad.current && messages.length > 0) {
      requestAnimationFrame(() => {
        scrollContainerRef.current?.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "auto",
        });
      });
      initialLoad.current = false;
    }
  }, [messages]);

  // ✅ 5. 위로 스크롤 시 과거 불러오기
  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          const prevHeight = scrollContainerRef.current?.scrollHeight || 0;
          await fetchNextPage();
          // ✅ 이전 스크롤 위치 유지
          requestAnimationFrame(() => {
            const newHeight = scrollContainerRef.current?.scrollHeight || 0;
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTop = newHeight - prevHeight;
            }
          });
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.1,
      }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  // ✅ 6. 실시간 소켓 수신
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    // 서버에서 메세지 받기
    socket.on("chat", (message: MessageType) => {
      setMessages((prev) => [message, ...prev]);
      requestAnimationFrame(() => {
        scrollContainerRef.current?.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    });
    // 이벤트 중복 방지
    return () => {
      socket.off("chat");
    };
  }, [socketRef, receiverEmail, roomId]);

  // ✅ 7. 메시지 전송
  const handleSend = () => {
    const socket = socketRef.current;
    if (!socket || input.trim() === "") return;

    socket.emit("chat", {
      id: 0,
      roomId,
      senderEmail: senderEmail || "",
      receiverEmail,
      senderNickname: senderNickname || "",
      receiverNickname,
      receiverUrl,
      isDirect: true,
      roomName: "",
      message: input,
      createdAt: new Date(),
    });
    setInput("");
  };

  return (
    <Card className="bg-white border rounded-xl flex flex-col h-[calc(100vh-150px)]">
      <CardHeader className="flex items-center justify-between p-3 border-b h-[40px]">
        <div className="flex gap-1 items-center">
          <AvartarModule src={receiverUrl} />
          <span className="font-semibold">{receiverNickname}</span>
        </div>
      </CardHeader>

      {/* ✅ 아래에서 위로 쌓이는 구조 */}
      <CardContent
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-3 scrollbar-none flex flex-col-reverse"
      >
        <div className="flex flex-col-reverse gap-1">
          {/* 화면상 '맨 위'에 해당하는 sentinel */}
          <div ref={sentinelRef} />

          {messages.map((msg, idx) => {
            const isMe = msg.senderEmail === senderEmail;
            return (
              <div
                key={idx}
                className={`flex w-full mb-1 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end gap-1 ${
                    isMe ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`max-w-[75%] break-words rounded-xl px-2 py-1 text-sm ${
                      isMe ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    {msg.message}
                  </div>
                  <div className="text-[10px] text-gray-500 leading-none">
                    <div>{timeTransform(msg.createdAt!).date}</div>
                    <div className={`${isMe ? "text-right" : "text-left"}`}>
                      {timeTransform(msg.createdAt!).time}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-2 py-1 border rounded mr-2 text-sm"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
        >
          보내기
        </button>
      </CardFooter>
    </Card>
  );
}
