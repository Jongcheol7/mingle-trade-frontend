export type RoomType = {
  id: number;
  room_name: string;
  is_direct: boolean;
};

export type MessageType = {
  senderEmail: string;
  receiverEmail: string;
  senderNickname: string;
  receiverNickname: string;
  isDirect: boolean;
  roomName: string;
  message: string;
  createdAt?: Date;
};
