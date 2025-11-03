"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatMessage } from "@/hooks/chat/useChatReactQuery";
import useSocket from "@/hooks/chat/useSocket";
import { MessageType, RoomType } from "@/types/chat";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  roomInfo: RoomType | null;
  email: string;
  setRoomInfo: (roomInfo: null) => void;
};

export default function ChatPage({ roomInfo, email, setRoomInfo }: Props) {
  const socketRef = useSocket();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverUrl, setReceiverUrl] = useState("");
  console.log("ChatPage 에서의 roomInfo : ", roomInfo);

  // 상대방 정보 추출하기
  useEffect(() => {
    if (!roomInfo) return;
    const notMe = roomInfo.chatRoomMember.find(
      (member) => member.userId != user.id
    );

    if (notMe) {
      setReceiverId(notMe.userId);
      setReceiverName(notMe.user.username);
      setReceiverUrl(notMe.user.imageUrl);
    }
  }, [roomInfo, user.id]);

  // 채팅 내용 조회하기
  const { data, isSuccess } = useChatMessage(roomInfo?.id ?? 0);
  useEffect(() => {
    if (isSuccess && data.pages) {
      const allMessages = data.pages.flatMap((page) => page.result).reverse();
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
      setMessages((prev) => [...prev, message]);
    });

    // 이벤트 중복 방지
    return () => {
      socket.off("chat");
    };
  }, [socketRef, receiverId]);

  // 보내기 버튼 클릭시
  const handleSend = () => {
    const socket = socketRef.current;
    if (!socket || input.trim() === "") return;

    // 서버로 메세지 보내기
    socket.emit("chat", {
      senderId: user!.id,
      receiverId,
      senderName: user!.username,
      receiverName,
      isDirect: true,
      roomName: receiverName,
      message: input,
      roomId: roomInfo?.id ?? 0,
    });
    setInput("");
  };

  return (
    <div className="bg-white h-[100vh] border  flex flex-col z-50">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex gap-1 items-center">
          <Avatar>
            <AvatarImage src={receiverUrl} />
            <AvatarFallback>{receiverName[0]}</AvatarFallback>
          </Avatar>
          <span className="font-semibold">{receiverName}</span>
        </div>
        <button onClick={() => setRoomInfo(null)}>
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 p-3 overflow-y-auto  scrollbar-none">
        {messages.map((msg: MessageType, idx) => {
          const isMe = msg.senderId === user?.id;
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
    </div>
  );
}
