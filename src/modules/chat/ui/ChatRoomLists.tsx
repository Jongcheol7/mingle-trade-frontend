"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AvartarModule from "@/modules/common/AvartarModule";
import { timeTransform } from "@/modules/common/TimeTransform";
import { RoomType } from "@/types/chat";

type Props = {
  roomLists: RoomType[];
  setRoomId: (val: number) => void;
};

export default function ChatRoomLists({ roomLists, setRoomId }: Props) {
  // 마지막 채팅시간 구하기.

  return (
    <Card className="h-[calc(100vh-150px)]">
      <CardHeader>
        <h1 className="text-xl font-bold">채팅 목록</h1>
      </CardHeader>
      <CardContent className="px-3">
        <div className="flex flex-col gap-3">
          {roomLists.map((room: RoomType) => {
            return (
              <div
                key={room.id}
                className="flex gap-2 pb-2 items-center hover:bg-gray-100 transition-all border-b border-b-gray-200"
                onClick={() => setRoomId(room.id)}
              >
                <Avatar className="w-9 h-9 border-1 border-white shadow-md">
                  <AvatarImage src={room.room_image} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-amber-300 to-yellow-400 text-white">
                    {""}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-bold text-[14px]">{room.room_name}</p>
                  <p className="text-[13px] text-gray-700">
                    {room.last_message}
                  </p>
                </div>
                <div className="flex flex-col items-center text-[10px]">
                  <p>{timeTransform(room.last_message_at!).date}</p>
                  <p>{timeTransform(room.last_message_at!).time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
