import { MessageType } from "@/types/chat";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

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
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef;
}
