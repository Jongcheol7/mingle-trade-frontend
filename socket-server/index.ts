import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors"; //다른 주소에서도 서버에 접근할수 있도록 허용해주는 설정
import { MessageType } from "@/types/chat";
import axios from "axios";

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
    if (!message.senderEmail) {
      console.error("보내는 사람 정보가 없습니다.");
      return;
    }
    if (!message.receiverEmail) {
      console.error("받는 사람 정보가 없습니다.");
      return;
    }
    if (!message.message || message.message.trim() === "") {
      console.error("메세지가 없습니다.");
      return;
    }

    try {
      // 1. 방이 없다면 채팅방을 만들자.
      if (message.roomId === 0) {
        const makeRoomRes = await axios.post(
          "http://localhost:8080/api/chat/makeChatRoom",
          {
            senderEmail: message.senderEmail,
            receiverEmail: message.receiverEmail,
            receiverUrl: message.receiverUrl,
          }
        );
        //console.log("방생성 결과: ", makeRoomRes.data.data.room_id);
        message.roomId = makeRoomRes.data.data.room_id;
      }

      // 2. 채팅 DB에 저장해보자.
      const messageSaveRes = await axios.post(
        "http://localhost:8080/api/chat/saveChatMessage",
        {
          roomId: message.roomId,
          senderEmail: message.senderEmail,
          message: message.message,
        }
      );
      //console.log("메세지 저장 결과: ", messageSaveRes.data);
      io.emit("chat", message);
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
