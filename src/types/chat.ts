export type RoomType = {
  id: number;
  room_name: string;
  is_direct: boolean;
};

export type MessageType = {
  id: number;
  roomId: number;
  senderEmail: string;
  receiverEmail: string;
  senderNickname: string;
  receiverNickname: string;
  receiverUrl: string;
  isDirect: boolean;
  roomName: string;
  content: string;
  createdAt?: Date;
};
