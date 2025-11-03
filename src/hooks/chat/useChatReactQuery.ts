import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useChatMessage(roomId: number) {
  return useInfiniteQuery({
    queryKey: ["ChatMessages", roomId],
    queryFn: async ({ pageParam = null, queryKey }) => {
      const [, roomId] = queryKey;
      const res = await axios.get("/api/chat/messages", {
        params: { roomId, cursor: pageParam, limit: 10 },
      });
      return res.data;
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
