"use client";

import { RoomType } from "@/types/chat";

type Props = {
  roomLists: RoomType[];
};

export default function ChatRoomLists({ roomLists }: Props) {
  // 마지막 채팅시간 구하기.

  return (
    <div className="mt-5">
      <h1 className="mb-5 text-xl font-bold">채팅 목록</h1>

      <div className="flex flex-col gap-2">
        {roomLists.map((room: RoomType) => {
          return <div key={room.id}>{room.room_name}</div>;
        })}
      </div>
    </div>
  );
}
