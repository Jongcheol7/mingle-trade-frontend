import { FreeBoard } from "@/types/freeboard";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export function useCryptoNewsSave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FreeBoard) => {
      let res;
      if (Number(data.id) === 0) {
        res = await api.post("/api/freeboard/insert", data);
      } else if (Number(data.id) !== 0) {
        res = await api.put("/api/freeboard/update", data);
      }

      return res?.data || null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freeboardLists"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

export function useCryptoNewsAllLists() {
  return useInfiniteQuery({
    queryKey: ["cryptoNewsLists"],
    queryFn: async ({ pageParam = null }) => {
      const res = await api.get("/api/crypto/news", {
        params: {
          cursor: pageParam,
          limit: 10,
        },
      });
      if (res.data.status === "success") {
        return res.data.data;
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

export function useCryptoNewsDetails(id: number) {
  return useQuery({
    queryKey: ["freeboardDetails", id],
    queryFn: async () => {
      const res = await api.get(`/api/freeboard/${id}`);
      return res.data;
    },
    enabled: Number(id) !== 0,
  });
}
