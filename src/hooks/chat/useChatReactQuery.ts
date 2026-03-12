import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export function useChatMessage(
  roomId: number,
  senderEmail: string,
  receiverEmail: string
) {
  return useInfiniteQuery({
    queryKey: ["directMessages", roomId],
    queryFn: async ({ pageParam = null }) => {
      const res = await api.get("/api/chat/directMessages", {
        params: {
          roomId,
          senderEmail,
          receiverEmail,
          cursor: pageParam,
          limit: 10,
        },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    initialPageParam: null,
    staleTime: 0,
  });
}

export function useChatRoomLists(email: string) {
  return useQuery({
    queryKey: ["chatRoomLists", email],
    queryFn: async () => {
      const res = await api.get("/api/chat/roomList", {
        params: { email },
      });
      return res.data.data;
    },
    enabled: !!email,
    staleTime: 10 * 1000,
  });
}

export function useMakeChatRoom() {
  return useMutation({
    mutationFn: async ({
      senderEmail,
      receiverEmail,
      receiverNickname,
    }: {
      senderEmail: string;
      receiverEmail: string;
      receiverNickname: string;
    }) => {
      const res = await api.post("/api/chat/makeChatRoom", {
        senderEmail,
        receiverEmail,
        receiverNickname,
      });
      return res.data.data;
    },
    onError: (err) => {
      toast.error(err.message || "채팅방 생성에 실패했습니다.");
    },
  });
}
