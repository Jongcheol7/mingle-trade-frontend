import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useChatMessage(
  roomId: number,
  senderEmail: string,
  receiverEmail: string
) {
  return useInfiniteQuery({
    queryKey: ["directMessages", roomId, senderEmail, receiverEmail],
    queryFn: async ({ pageParam = null }) => {
      const res = await axios.get(
        "http://localhost:8080/api/chat/directMessages",
        {
          params: {
            roomId,
            senderEmail,
            receiverEmail,
            cursor: pageParam,
            limit: 10,
          },
        }
      );

      if (res.data.status === "success") {
        return res.data;
      } else {
        throw new Error(res.data.message || "조회 실패");
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    initialPageParam: null,
  });
}

export function useChatRoomLists(email: string) {
  return useQuery({
    queryKey: ["chatRoomLists", email],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8080/api/chat/roomList", {
        params: { email },
      });

      if (res.data.status === "success") {
        return res.data.data;
      } else {
        throw new Error(res.data.message || "조회 실패");
      }
    },
    enabled: !!email,
  });
}

export function useMakeChatRoom(
  senderEmail: string,
  receiverEmail: string,
  receiverNickname: string
) {
  return useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        "http://localhost:8080/api/chat/makeChatRoom",
        {
          senderEmail,
          receiverEmail,
          receiverNickname,
        }
      );
      if (res.data.status === "success") {
        return res.data.data;
      } else {
        throw new Error(res.data.message || "방 생성 실패");
      }
    },
  });
}
