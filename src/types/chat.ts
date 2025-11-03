export type RoomType = {
  id: number;
  room_name: string;
  is_direct: boolean;
};

export type MessageType = {
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  isDirect: boolean;
  roomName: string;
  message: string;
  roomId: number | undefined;
  createdAt?: Date;
};
