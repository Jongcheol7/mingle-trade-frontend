"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { timeTransform } from "@/modules/common/TimeTransform";
import { RoomType } from "@/types/chat";

type Props = {
  roomLists: RoomType[];
  setRoomId: (val: number) => void;
};

export default function ChatRoomLists({ roomLists, setRoomId }: Props) {
  return (
    <Card className="h-full">
      <CardHeader className="border-b border-border">
        <h2 className="text-base font-semibold">채팅 목록</h2>
      </CardHeader>
      <CardContent className="px-2 pt-2">
        <div className="flex flex-col gap-1">
          {roomLists.map((room: RoomType) => {
            return (
              <div
                key={room.id}
                className="flex gap-3 p-2.5 items-center hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
                onClick={() => setRoomId(room.id)}
              >
                <Avatar className="w-10 h-10 border border-border shadow-sm shrink-0">
                  <AvatarImage src={room.room_image} />
                  <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                    {""}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">
                    {room.room_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {room.last_message}
                  </p>
                </div>
                <div className="flex flex-col items-end text-[10px] text-muted-foreground shrink-0">
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
