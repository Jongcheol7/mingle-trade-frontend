import { FreeBoard } from "@/types/freeboard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export function useFreeBoardSave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FreeBoard) => {
      const isNew = Number(data.id) === 0;
      const res = isNew
        ? await api.post("/api/freeboard/insert", data)
        : await api.put("/api/freeboard/update", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freeboardLists"] });
    },
    onError: (err) => {
      toast.error(err.message || "게시글 저장에 실패했습니다.");
    },
  });
}

export function useFreeBoardAllLists(page = 1) {
  return useQuery({
    queryKey: ["freeboardLists", page],
    queryFn: async () => {
      const res = await api.get("/api/freeboard/selectAll", {
        params: { page, limit: 10 },
      });
      return res.data.data;
    },
    staleTime: 30 * 1000,
  });
}

export function useFreeBoardDetails(id: number) {
  return useQuery({
    queryKey: ["freeboardDetails", id],
    queryFn: async () => {
      const res = await api.get(`/api/freeboard/${id}`);
      return res.data;
    },
    enabled: Number(id) !== 0,
    staleTime: 60 * 1000,
  });
}

export function useFreeBoardDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: number) => {
      const res = await api.post("/api/freeboard/delete", { id: postId });
      return res.data;
    },
    onSuccess: () => {
      toast.success("게시글이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["freeboardLists"] });
    },
    onError: (err) => {
      toast.error(err.message || "게시글 삭제에 실패했습니다.");
    },
  });
}
