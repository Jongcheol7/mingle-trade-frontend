import { MessageType } from "@/types/chat";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

// 서버 주소
const SOCKET_URL = "http://localhost:4000";

type ClientToServerEvents = {
  chat: (message: MessageType) => void;
};
type ServerToClientEvents = {
  chat: (message: MessageType) => void;
};

export default function useSocket() {
  const socketRef =
    useRef<Socket<ServerToClientEvents, ClientToServerEvents>>(null);

  useEffect(() => {
    // 소켓 연결
    const socket = io(SOCKET_URL, {
      transports: ["websocket"], //안정적인 웹소켓 사용
    });

    socketRef.current = socket;

    console.log("Socket connected");

    // 언마운트시 연결 종료
    return () => {
      socket.disconnect();
      console.log("Socket disconnected.");
    };
  }, []);

  return socketRef;
}
