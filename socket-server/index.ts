import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors"; //다른 주소에서도 서버에 접근할수 있도록 허용해주는 설정
import { prisma } from "@/lib/prisma";

type MessageType = {
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  isDirect: boolean;
  roomName: string;
  message: string;
  roomId: number | undefined;
};

// 익스프레스 앱 생성
const app = express();
// http서버만들기 (express를 감싸서 socket.it랑 함께 씀)
const server = http.createServer(app);

// CORS 설정 (다른 주소에서도 접속 허용)
// 예: 프론트엔드가 http://localhost:3000 에서 실행될 때 여기에 접속 가능하게 함
app.use(
  cors({
    // 프론트엔드 주소
    origin: "http://localhost:3000",
    // 쿠키 등 자격정보 허용
    credentials: true,
  })
);

// socket.io 서버 만들기 (실제로 실시간 채팅을 처리하는 핵심 부분)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 클라이언트 연결 처리
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // 메세지 수신 (클라이언트가 'chat' 이벤트로 메시지를 보냈을 때 실행됨)
  socket.on("chat", async (message: MessageType) => {
    console.log("Message received:", message);

    // 받은 메세지를 DB에 먼저 저장을 해보자.
    if (!message.senderId) {
      console.error("보내는 사람 정보가 없습니다.");
      return;
    }
    if (!message.receiverId) {
      console.error("받는 사람 정보가 없습니다.");
      return;
    }
    if (!message.message || message.message.trim() === "") {
      console.error("메세지가 없습니다.");
      return;
    }

    try {
      let finalRoomId = message.roomId;
      // 1. 방이 없다면 채팅방을 만들자.
      if (message.roomId === 0) {
        const newRoomId = await prisma.chatRoom.create({
          data: {
            isDirect: message.isDirect,
            roomName: message.roomName,
            chatRoomMember: {
              create: [
                { userId: message.senderId },
                { userId: message.receiverId },
              ],
            },
          },
        });
        finalRoomId = newRoomId.id;
      }
      console.log(`${!message.roomId ? "채팅룸 생성 완료" : ""}`);

      // 2. 메세지 저장
      const messageSave = await prisma.message.create({
        data: {
          roomId: finalRoomId!,
          senderId: message.senderId,
          message: message.message,
        },
        include: {
          sender: true,
        },
      });
      console.log("메세지 저장 완료");

      // 전체 클라이언트에게 전송
      io.emit("chat", messageSave);
    } catch (err) {
      console.error("메세지 저장중 에러발생 : ", err);
      return;
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// 서버 실행
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Socket server running on http://localhost:${PORT}`);
});
