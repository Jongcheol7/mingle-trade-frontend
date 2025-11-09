// components/ChatWindow.tsx
"use client";

import { useChatMessage } from "@/hooks/chat/useChatReactQuery";
import useSocket from "@/hooks/chat/useSocket";
import AvartarModule from "@/modules/common/AvartarModule";
import { timeTransform } from "@/modules/common/TimeTransform";
import { useUserStore } from "@/store/useUserStore";
import { MessageType } from "@/types/chat";
import axios from "axios";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

type ChatWindowProps = {
  receiverNickname: string;
  receiverUrl: string;
  receiverEmail: string;
  onClose: () => void;
};

export default function ChatWindow({
  receiverNickname,
  receiverUrl,
  receiverEmail,
  onClose,
}: ChatWindowProps) {
  const socketRef = useSocket();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [roomId, setRoomId] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { email: senderEmail, nickname: senderNickname } = useUserStore();

  //채팅방 조회하자
  useEffect(() => {
    if (!senderEmail || !receiverEmail) return;
    const findChatRoom = async () => {
      const res = await axios.get(
        "http://localhost:8080/api/chat/findChatRoom",
        {
          params: { senderEmail, receiverEmail },
        }
      );
      setRoomId(res.data.data);
    };
    findChatRoom();
  }, [senderEmail, receiverEmail]);

  // // 채팅 내용 조회하기
  const { data, isSuccess } = useChatMessage(
    roomId,
    senderEmail ?? "",
    receiverEmail
  );

  useEffect(() => {
    if (isSuccess && data.pages) {
      if (data.pages[0].roomId) {
        setRoomId(data.pages[0].roomId);
      }
      const allMessages = data.pages
        .flatMap((page) => page.data || [])
        .reverse();
      setMessages(allMessages);
    }
  }, [data, isSuccess]);

  // 스크롤 하단 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 소켓 메세지 송수신
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    // 서버에서 메세지 받기
    socket.on("chat", (message: MessageType) => {
      if (roomId === 0) {
        if (message.roomId && message.roomId > 0) {
          setRoomId(message.roomId);
        }
      }
      setMessages((prev) => [...prev, message]);
    });

    // 이벤트 중복 방지
    return () => {
      socket.off("chat");
    };
  }, [socketRef, receiverEmail, roomId]);

  // 보내기 버튼 클릭시
  const handleSend = () => {
    const socket = socketRef.current;
    if (!socket || input.trim() === "") return;

    if (!senderEmail || !senderNickname) {
      toast.error("로그인 정보가 없습니다.");
      return;
    }
    // 서버로 메세지 보내기
    socket.emit("chat", {
      id: 0,
      roomId,
      senderEmail,
      receiverEmail,
      senderNickname,
      receiverNickname,
      receiverUrl,
      isDirect: true,
      roomName: receiverNickname,
      content: input,
      createdAt: new Date(),
    });
    setInput("");
  };

  //  console.log("🔥 DB에서 받은 messages", data?.pages);
  return createPortal(
    <div className="fixed bottom-4 right-4 w-[350px] h-[400px] bg-white border shadow-xl rounded-xl flex flex-col z-60">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex gap-1 items-center">
          <AvartarModule src={receiverUrl} />
          <span className="font-semibold">{receiverNickname}</span>
        </div>
        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 p-3 overflow-y-auto max-h-[300px] scrollbar-none">
        {messages.map((msg: MessageType, idx) => {
          {
            const isMe = msg.senderEmail === senderEmail;
            console.log("msg : ", msg);
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
                    {msg.content || "빈값"}
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
          }
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex border-t p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 px-2 py-1 border rounded mr-2 text-sm"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
        >
          보내기
        </button>
      </div>
    </div>,
    document.body
  );
}
