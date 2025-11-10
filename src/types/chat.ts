export type RoomType = {
  id: number;
  room_name: string;
  is_direct: boolean;
  room_image: string;
  created_at: Date;
  last_message: string;
  last_message_at: Date;
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
  message: string;
  createdAt?: Date;
};
